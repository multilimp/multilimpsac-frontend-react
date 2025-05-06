export interface CompanyProps {
  id: number;
  razonSocial: string;
  ruc: string;
  telefono: string;
  email: string;
  web: string;

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
  direccion: string;
  logo: string;
}
