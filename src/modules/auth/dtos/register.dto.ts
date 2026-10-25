import { IsEmail, IsString } from 'class-validator';

export class RegisterDTO {
  @IsEmail()
  email!: string;

  @IsString()
  username!: string;

  @IsString()
  password!: string;
}
