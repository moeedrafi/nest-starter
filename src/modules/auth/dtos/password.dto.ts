import { IsString, IsEmail } from 'class-validator';

export class ForgotPasswordDTO {
  @IsEmail()
  email!: string;
}

export class ResetPasswordDTO {
  @IsString()
  password!: string;

  @IsString()
  confirmPassword!: string;
}
