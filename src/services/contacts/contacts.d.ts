
export interface ContactProps {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  cargo: string;
  cumpleanos?: string;
  nota?: string;
  usuarioDestacado?: string;
  tipo: string;
  referenciaId: number;
  clienteId?: number;
  proveedorId?: number;
  transporteId?: number;
}
