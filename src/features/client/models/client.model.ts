
// Add the missing DTO types for client service

export interface ClientDB {
  id: number;
  cod_unidad: string;
  razon_social: string;
  ruc: string;
  estado: boolean;
  direccion?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClientCreateDTO {
  cod_unidad?: string;
  razon_social?: string;
  ruc?: string;
  estado?: boolean;
  direccion?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
}

export interface ClientUpdateDTO {
  cod_unidad?: string;
  razon_social?: string;
  ruc?: string;
  estado?: boolean;
  direccion?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
}
