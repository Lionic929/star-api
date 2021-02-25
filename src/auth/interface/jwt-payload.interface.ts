import { UserRole } from '../enum/user-role.enum';

export interface JwtPayload {
  id: number;
  login: string;
  email: string;
  role: keyof UserRole;
  emailConfirm: boolean;
  balanceAmount: number;
}
