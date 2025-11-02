import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  lastname: string;

  @MinLength(4, { message: 'حداقل طول نام کاربری 6 کاراکتر می باشد' })
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'حداقل طول پسوورد 6 کاراکتر می باشد' })
  password: string;
}
