import { DistrictProps, RegionProps } from '../ubigeo/ubigeo';

export interface ProviderProps {
  id: number;
  razonSocial: string;
  ruc: string;

  departamento?: RegionProps;
  provincia?: ProviderProps;
  distrito?: DistrictProps;
  direccion?: string;

  email?: string;
  telefono?: string;
  estado: boolean;
}
