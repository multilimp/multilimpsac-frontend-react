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
  referenciaId: 4;
  clienteId: 4;
  proveedorId?: number;
  transporteId?: number;
}
