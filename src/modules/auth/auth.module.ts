import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { authentication } from '@/config/env.config';
import { AuthService } from '@/modules/auth/auth.service';
import { UsersModule } from '@/modules/users/users.module';
import { EmailModule } from '@/modules/email/email.module';
import { AuthController } from '@/modules/auth/auth.controller';
import type { IAuthentication } from '@/config/env.config.interface';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      inject: [authentication.KEY],
      useFactory: (authConfig: IAuthentication) => ({
        secret: authConfig.jwtSecret,
        signOptions: { expiresIn: authConfig.expiry },
      }),
    }),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
