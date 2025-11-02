import { IsNotEmpty, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsNotEmpty()
  @MinLength(4, { message: 'حداقل طول نام کاربری 6 کاراکتر می باشد' })
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
