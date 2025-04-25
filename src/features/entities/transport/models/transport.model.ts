
export interface Transport {
  id: string;
  razon_social: string;
  ruc: string;
  direccion: string;
  cobertura: string;
  estado: boolean;
  departamento: string;
  provincia: string;
  distrito: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransportContact {
  id: string;
  nombre: string;
  cargo?: string;
  telefono?: string;
  email?: string;
  correo?: string;
  estado: boolean;
  transporte_id: string;
}
