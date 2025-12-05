import { DistrictProps, ProvinceProps, RegionProps } from '../ubigeo/ubigeo';

export interface BankAccount {
  id?: number;
  banco: string;
  numeroCuenta: string;
  tipoCuenta: 'corriente' | 'ahorros';
  cci?: string;
  numeroCci?: string;
  titularCuenta: string;
  moneda?: 'SOLES' | 'DOLARES';
  activa?: boolean;
}

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
  direcciones?: string;
  logo: string;
  cuentasBancarias?: BankAccount[];
}
