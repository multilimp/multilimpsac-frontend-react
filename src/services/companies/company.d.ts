import { DistrictProps, ProvinceProps, RegionProps } from '../ubigeo/ubigeo';

export interface CompanyProps {
  id: number;
  razonSocial: string;
  ruc: string;
  telefono: string;
  email: string;
  web: string;
  departamento?: RegionProps;
  provincia?: ProvinceProps;
  distrito?: DistrictProps;
  direccion: string;
  logo: string;
}
