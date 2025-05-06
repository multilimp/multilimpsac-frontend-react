export interface ClientProps {
  codigoUnidadEjecutora: string;
  createdAt: string;
  direccion: string;
  departamento?: {
    id: string;
    name: string;
  };
  provincia?: {
    id: string;
    name: string;
  };
  distrito?: {
    id: string;
    name: string;
  };
  email?: string;
  estado: true;
  id: number;
  razonSocial: string;
  ruc: string;
  telefono?: string;
  updatedAt: string;
}
