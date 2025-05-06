export interface TransportProps {
  id: number;
  ruc: string;
  razonSocial: string;

  telefono?: string;
  email?: string;
  estado: boolean;
  cobertura: string;

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
  direccion?: string;
}
