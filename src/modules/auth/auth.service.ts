import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import { createHash, randomBytes, randomUUID } from 'crypto';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from '@/common/enums/enums';
import { authentication } from '@/config/env.config';
import { LoginDTO } from '@/modules/auth/dtos/login.dto';
import { UsersService } from '@/modules/users/users.service';
import { EmailService } from '@/modules/email/email.service';
import { RegisterDTO } from '@/modules/auth/dtos/register.dto';
import type { RequestWithUser } from '@/common/interfaces/user.interface';
import { hashing, isPasswordMatch, isTokenMatch } from '@/common/utils/utils';
import { resetPasswordTemplate } from '@/common/email-templates/reset-password';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    @Inject(authentication.KEY)
    private readonly authConfig: ConfigType<typeof authentication>,
  ) {}

  async getTokens(id: string, role: 'user' | 'admin') {
    const refreshTokenId = randomUUID();

    const accessPayload = { sub: id, role };
    const refreshPayload = { sub: id, jti: refreshTokenId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.authConfig.refreshJWTSecret,
        expiresIn: this.authConfig.refreshExpiry,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async signUp(data: RegisterDTO) {
    const { email, password, username } = data;
    if (!email || !password || !username) {
      throw new NotFoundException('All Fields are required');
    }

    const existingUser = await this.usersService.findOne({ email, username });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await hashing(password);
    const createdUser = await this.usersService.create(
      email,
      hashedPassword,
      username,
      UserRole.USER,
    );

    return createdUser;
  }

  async signIn(data: LoginDTO) {
    const { email, password } = data;
    if (!email || !password) {
      throw new NotFoundException('All Fields are required');
    }

    const existingUser = await this.usersService.findByEmail(email);
    if (!existingUser) {
      throw new NotFoundException('Invalid credentials');
    }

    const isValidPassword = await isPasswordMatch(
      password,
      existingUser.password,
    );
    if (!isValidPassword) {
      throw new NotFoundException('Invalid credentials');
    }

    const { accessToken, refreshToken } = await this.getTokens(
      existingUser.id,
      existingUser.role,
    );

    const hashedRefreshToken = await hashing(refreshToken, 12);
    await this.usersService.update(existingUser.id, {
      refreshToken: hashedRefreshToken,
    });

    return { accessToken, refreshToken, user: existingUser };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      // verify token
      const payload: RequestWithUser = await this.jwtService.verifyAsync(
        refreshToken,
        { secret: this.authConfig.refreshJWTSecret },
      );

      // fetch user + hashed refresh token
      const user = await this.usersService.findById(payload.sub, {
        select: { id: true, refreshToken: true, role: true },
      });
      if (!user || !user.refreshToken) throw new UnauthorizedException();

      // compare hash
      const isValid = await isTokenMatch(refreshToken, user.refreshToken);
      if (!isValid) throw new UnauthorizedException();

      // generate new tokens
      const { accessToken, refreshToken: newRefreshToken } =
        await this.getTokens(user.id, user.role);

      // hash new refresh token and save
      const hashed = await hashing(newRefreshToken, 12);
      await this.usersService.update(user.id, { refreshToken: hashed });

      // return new tokens
      return { accessToken, refreshToken: newRefreshToken };
    } catch {
      throw new UnauthorizedException(`Invalid or expired refresh token`);
    }
  }

  async forgotPassword(email: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (!existingUser) {
      throw new NotFoundException('Email not found');
    }

    const rawToken = randomBytes(26).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');

    await this.usersService.update(existingUser.id, {
      resetToken: tokenHash,
      resetTokenExpiry: new Date(
        Date.now() + this.authConfig.resetPasswordExpiry,
      ),
    });

    const resetUrl = `${this.authConfig.frontendUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;
    const html = resetPasswordTemplate(resetUrl);
    await this.emailService.resetPasswordMail(
      existingUser.email,
      'Reset your Password',
      html,
    );

    return null;
  }

  async resetPassword(
    token: string,
    password: string,
    confirmPassword: string,
  ) {
    if (password !== confirmPassword) {
      throw new BadRequestException('Password dont match');
    }

    const hashedToken = createHash('sha256').update(token).digest('hex');
    const user = await this.usersService.findByResetToken(hashedToken);

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await hashing(password);
    await this.usersService.update(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    return null;
  }
}
