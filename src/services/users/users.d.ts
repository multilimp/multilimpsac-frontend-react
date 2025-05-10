import { RolesEnum } from '@/types/global.enum';

export interface UserProps {
  id: number;
  nombre: string;
  email: string;
  password?: string;
  role: RolesEnum;
  foto?: string;
  estado: boolean;
}
