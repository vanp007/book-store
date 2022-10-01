import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserSignIn {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
