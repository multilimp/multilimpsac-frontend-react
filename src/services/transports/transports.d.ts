import { DistrictProps, ProvinceProps, RegionProps } from '../ubigeo/ubigeo';

export interface BankAccount {
  banco: string;
  numeroCuenta: string;
  tipoCuenta: 'corriente' | 'ahorros';
  cci?: string;
  titularCuenta: string;
}

import { DistrictProps, ProvinceProps, RegionProps } from '../ubigeo/ubigeo';

export interface BankAccount {
  id?: number; // Para cuentas existentes
  banco: string;
  numeroCuenta: string;
  tipoCuenta: 'corriente' | 'ahorros';
  cci?: string; // Campo del frontend
  numeroCci?: string; // Campo del backend
  titularCuenta: string;
  moneda?: 'SOLES' | 'DOLARES';
  activa?: boolean;
}

export interface TransportProps {
  id: number;
  razonSocial: string;
  ruc: string;
  cobertura?: string;

  departamento?: RegionProps;
  provincia?: ProvinceProps;
  distrito?: DistrictProps;
  direccion?: string;

  email?: string;
  telefono?: string;
  estado: boolean;

  // Información bancaria para pagos - múltiples cuentas
  cuentasBancarias?: BankAccount[];

  // Información de saldos
  saldo?: number;
  saldoTipo?: 'A_FAVOR' | 'DEBE';
}
