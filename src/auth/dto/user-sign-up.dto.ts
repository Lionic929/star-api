import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';

export class UserSignUpDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-z0-9_]{3,16}$/)
  login: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  password: string;

  @IsOptional()
  @IsString()
  @Matches(
    /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/,
  )
  email: string;
}
