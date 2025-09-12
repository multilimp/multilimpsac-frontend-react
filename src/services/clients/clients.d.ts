import { DistrictProps, ProvinceProps, RegionProps } from '../ubigeo/ubigeo';

export interface ClientProps {
  codigoUnidadEjecutora: string;
  createdAt: string;
  direccion: string;
  departamento?: RegionProps;
  provincia?: ProvinceProps;
  distrito?: DistrictProps;
  email?: string;
  estado: true;
  id: number;
  razonSocial: string;
  ruc: string;
  telefono?: string;
  sede?: string;
  updatedAt: string;
}
