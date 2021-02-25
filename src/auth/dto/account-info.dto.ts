import { UserRole } from '../enum/user-role.enum';

export interface AccountInfoDto {
  id: number;
  login: string;
  email: string;
}
