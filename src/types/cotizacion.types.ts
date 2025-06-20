import { ClientProps } from '@/services/clients/clients';
import { CompanyProps } from '@/services/companies/company';
import { ContactProps } from '@/services/contacts/contacts';

// Tipos para Cotizaciones - Alineados con el backend Prisma
export interface CotizacionProps {
  id: number;
  codigoCotizacion: string;
  empresaId: number;
  clienteId: number;
  contactoClienteId?: number;
  montoTotal: string; // Decimal en string
  tipoPago: TipoPago;
  notaPago?: string;
  notaPedido?: string;
  direccionEntrega?: string;
  distritoEntrega?: string;
  provinciaEntrega?: string;
  departamentoEntrega?: string;
  referenciaEntrega?: string;
  estado: CotizacionEstado;
  fechaCotizacion: string; // ISO string
  fechaEntrega?: string; // ISO string
  createdAt: string;
  updatedAt: string;
  
  // Relaciones - usando tipos existentes del proyecto
  cliente?: ClientProps;
  empresa?: CompanyProps;
  contactoCliente?: ContactProps;
  productos?: CotizacionProductoProps[];
}

export interface CotizacionProductoProps {
  id: number;
  codigo: string;
  descripcion: string;
  unidadMedida?: string;
  cantidad: number;
  cantidadAlmacen?: number;
  cantidadTotal: number;
  precioUnitario: string; // Decimal en string
  total: string; // Decimal en string
  cotizacionId: number;
  createdAt: string;
  updatedAt: string;
}

export enum CotizacionEstado {
  PENDIENTE = 'PENDIENTE',
  ACEPTADA = 'ACEPTADA',
  RECHAZADA = 'RECHAZADA'
}

export enum TipoPago {
  CONTADO = 'CONTADO',
  CREDITO = 'CREDITO',
  CONSIGNACION = 'CONSIGNACION'
}

// Tipos para formularios
export interface CreateCotizacionData {
  codigoCotizacion: string;
  empresaId: number;
  clienteId: number;
  contactoClienteId?: number;
  montoTotal: string;
  tipoPago: TipoPago;
  notaPago?: string;
  notaPedido?: string;
  direccionEntrega?: string;
  distritoEntrega?: string;
  provinciaEntrega?: string;
  departamentoEntrega?: string;
  referenciaEntrega?: string;
  fechaCotizacion: string;
  fechaEntrega?: string;
  productos?: CreateCotizacionProductoData[];
}

export interface CreateCotizacionProductoData {
  codigo: string;
  descripcion: string;
  unidadMedida?: string;
  cantidad: number;
  cantidadAlmacen?: number;
  cantidadTotal: number;
  precioUnitario: string;
  total: string;
}

export interface UpdateCotizacionData extends Partial<CreateCotizacionData> {}
