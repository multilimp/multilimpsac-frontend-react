
export interface Transport {
  id: string;
  razon_social: string;
  ruc: string;
  direccion: string;
  departamento: string;
  provincia: string;
  distrito: string;
  cobertura?: string;
  estado: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransportContact {
  id: string;
  nombre: string;
  cargo?: string;
  telefono?: string;
  correo?: string;
  email?: string; // For compatibility with some components
  estado: boolean;
  transporte_id?: string;
}
