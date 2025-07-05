import { CatalogProps } from '../catalogs/catalogs';
import { ClientProps } from '../clients/clients';
import { CompanyProps } from '../companies/company';
import { ContactProps } from '../contacts/contacts';

export interface SaleProps {
  id: number;
  codigoVenta: string;
  fechaEmision: string;
  archivoOc?: string;
  empresaId: number;
  clienteId: number;
  contactoClienteId: number;
  catalogoEmpresaId: number;
  ventaPrivada: boolean;
  departamentoEntrega?: string;
  provinciaEntrega?: string;
  distritoEntrega?: string;
  direccionEntrega: string;
  referenciaEntrega: string;
  fechaEntrega: string;
  montoVenta: string;
  fechaForm: string;
  fechaMaxForm: string;
  productos: Array<{
    cantidad: number;
    codigo: string;
    marca: string;
    descripcion: string;
  }>;
  documentoOce: string;
  documentoOcf: string;
  siaf: string;
  etapaSiaf: string;
  fechaSiaf: string;
  documentoPeruCompras?: string;
  fechaPeruCompras?: string;
  fechaEntregaOc?: string;
  penalidad?: string;
  netoCobrado?: string;
  estadoCobranza?: string;
  fechaEstadoCobranza?: string;
  fechaProximaGestion?: string;
  retencion?: string;
  detraccion?: string;
  etapaActual: string;
  estadoVenta: string;
  estadoActivo: boolean;
  createdAt: string;
  updatedAt: string;
  empresa: CompanyProps;
  cliente: ClientProps;
  contactoCliente: ContactProps;
  catalogoEmpresa: CatalogProps;
  ordenesProveedor: Array<any>;
  ordenCompraPrivada?: {
    id: number;
    ordenCompraId: number;
    clienteId?: number;
    contactoClienteId?: number;
    estadoPago?: string;
    fechaPago?: string;
    documentoPago?: string;
    cliente?: ClientProps;
    contactoCliente?: ContactProps;
    pagos?: Array<{
      id: number;
      fechaPago: string;
      bancoPago: string;
      descripcionPago: string;
      archivoPago?: string;
      montoPago: number;
      estadoPago: boolean;
    }>;
  };
}

export interface SaleProcessedProps {
  ventaPrivada?: boolean;
  empresaRuc?: string;
  empresaRazonSocial?: string;
  clienteRuc?: string;
  clienteRazonSocial?: string;
  codigoUnidadEjecutora?: string;
  provinciaEntrega?: string;
  distritoEntrega?: string;
  departamentoEntrega?: string;
  regionEntrega?: string;
  direccionEntrega?: string;
  referenciaEntrega?: string;
  fechaEntrega?: string;
  montoVenta?: number;
  fechaForm?: string;
  fechaMaxForm?: string;
  fechaMaxEntrega?: string;
  productos?: Array<{
    codigo: string;
    descripcion: string;
    marca: string;
    cantidad: number;
  }>;
  siaf?: number;
  fechaSiaf?: string;
  codigoCatalogo: null;
  contactos: Array<{
    cargo: string;
    nombre: string;
    telefono: string;
  }>;
}

export interface SaleFiltersProps {
  page?: number;
  pageSize?: number;
  clienteId?: number;
  minPrice?: number;
  maxPrice?: number;
  fechaFrom?: string;
  fechaTo?: string;
  search?: string;
}
