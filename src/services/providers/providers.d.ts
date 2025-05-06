export interface ProviderProps {
  id: number;
  razonSocial: string;
  ruc: string;

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

  email?: string;
  telefono?: string;
  estado: boolean;
}
