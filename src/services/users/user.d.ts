import { RolesEnum } from './global.enum';

export interface UserProps {
  id: number;
  email: string;
  estado: boolean;
  foto?: string;
  nombre: string;
  role: RolesEnum;
}
