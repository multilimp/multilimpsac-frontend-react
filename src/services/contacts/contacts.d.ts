import { ContactTypeEnum } from './contacts.enum';

export interface ContactProps {
  id: number;
  nombre: string;
  cargo: string;
  telefono: string;
  email: string;
  cumpleanos?: string;
  nota?: string;
  usuarioDestacado?: string;
  tipo: ContactTypeEnum;
  referenciaId: number;
  clienteId?: number;
  proveedorId?: number;
  transporteId?: number;
}

export interface ContactFilterProps {
  page?: number | string;
  pageSize?: number | string;
  tipo?: ContactTypeEnum;
  referenciaId?: number | string;
}

export interface ContactUpdateProps {
  nombre?: string;
  cargo?: string;
  telefono?: string;
  email?: string; 
  cumpleanos?: string;
  nota?: string;
  usuarioDestacado?: boolean;
}
