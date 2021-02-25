import { IsNotEmpty, IsString, MaxLength, Matches } from 'class-validator';
import { getErrorId } from '../../utils';
import { Errors } from '../enum/errors.enum';

export class ContactMessageDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @Matches(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, {
    context: getErrorId(Errors.VALIDATION_NAME),
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/,
    {
      context: getErrorId(Errors.VALIDATION_EMAIL),
    },
  )
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  message: string;

  @IsNotEmpty({
    context: getErrorId(Errors.VALIDATION_REQUIRED),
  })
  @IsString()
  @MaxLength(300, {
    context: getErrorId(Errors.VALIDATION_TYPE),
  })
  type: string;
}
