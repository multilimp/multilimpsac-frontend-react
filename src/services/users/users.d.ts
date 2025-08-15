import { RolesEnum } from './user.enum';

export interface UserProps {
  id: number;
  nombre: string;
  email: string;
  password?: string;
  role: RolesEnum;
  foto?: string;
  estado: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Campos adicionales que pueden venir del frontend pero no están en BD
  telefono?: string;
  departamento?: string;
  fechaIngreso?: string;
  ultimoAcceso?: string;
  permisos?: string[];
  ubicacion?: string;
}
