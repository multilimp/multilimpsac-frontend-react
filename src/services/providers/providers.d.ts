import { DistrictProps, ProvinceProps, RegionProps } from '../ubigeo/ubigeo';

export interface ProviderProps {
  id: number;
  razonSocial: string;
  ruc: string;

  departamento?: RegionProps;
  provincia?: ProvinceProps;
  distrito?: DistrictProps;
  direccion?: string;

  email?: string;
  telefono?: string;
  estado: boolean;
}
