import { DistrictProps, ProvinceProps, RegionProps } from '../ubigeo/ubigeo';

export interface TransportProps {
  id: number;
  ruc: string;
  razonSocial: string;

  telefono?: string;
  email?: string;
  estado: boolean;
  cobertura: string;

  departamento?: RegionProps;
  provincia?: ProvinceProps;
  distrito?: DistrictProps;
  direccion?: string;
}
