
export interface Cliente {
  id: string;
  razonSocial: string;
  ruc: string;
  codUnidad: string;
  direccion?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  estado: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactoCliente {
  id: string;
  nombre: string;
  cargo?: string;
  telefono?: string;
  correo?: string;
  email?: string; // For compatibility with some components
  estado: boolean;
  clientId?: string;
}

// Alias types for compatibility
export type Client = Cliente;
export type ClientContact = ContactoCliente;
