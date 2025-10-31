import { CatalogProps } from '../catalogs/catalogs';
import { ClientProps } from '../clients/clients';
import { CompanyProps } from '../companies/company';
import { ContactProps } from '../contacts/contacts';
import { ProviderOrderProps } from '../providerOrders/providerOrders';
import { EstadoVentaType, EstadoCobranzaType, EstadoSeguimientoType } from '@/utils/constants';

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
  multipleFuentesFinanciamiento: boolean;
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
  codigoOcf?: string; // Código manual de orden de compra física
  siaf: string;
  etapaSiaf: string;
  fechaSiaf: string;
  documentoPeruCompras?: string;
  fechaPeruCompras?: string;
  fechaEntregaOc?: string;
  penalidad?: string;
  netoCobrado?: string;
  estadoCobranza?: EstadoCobranzaType;
  fechaEstadoCobranza?: string;
  fechaProximaGestion?: string;
  cobradorId?: number;
  cartaCci?: string;
  cartaGarantia?: string;
  cartaAmpliacion?: string;
  etapaActual: string;
  estadoVenta: EstadoVentaType;
  estadoFacturacion: EstadoVentaType;
  estadoRolSeguimiento: EstadoSeguimientoType;
  estadoCobranzaRol?: EstadoSeguimientoType;
  estadoActivo: boolean;
  createdAt: string;
  updatedAt: string;
  empresa: CompanyProps;
  cliente: ClientProps;
  contactoCliente: ContactProps;
  catalogoEmpresa: CatalogProps;
  cobrador?: {
    id: number;
    nombre: string;
  };
  ordenesProveedor: Array<ProviderOrderProps>;
  // Relación plural de facturaciones devuelta por el backend
  facturaciones?: Array<{
    id: number;
    factura?: string | null;
    fechaFactura?: string | null;
    grr?: string | null;
    esRefacturacion?: boolean | null;
  }>;
  facturacion?: {
    factura: string;
    fechaFactura: string;
    grr: string;
    retencion: string;
    detraccion: string;
    formaEnvioFactura: string;
    estado: number;
  };
  ordenCompraPrivada?: {
    id: number;
    ordenCompraId: number;
    clienteId?: number;
    contactoClienteId?: number;
    estadoPago?: string;
    fechaPago?: string;
    documentoPago?: string;
    documentoCotizacion?: string; // Documento de cotización
    cotizacion?: string; // Campo de cotización
    notaPago?: string;
    // Campos de tipo de entrega
    tipoDestino?: string;
    nombreAgencia?: string;
    destinoFinal?: string;
    nombreEntidad?: string;
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
  documentoOceUrl?: string; // Nueva propiedad para la URL del archivo OCAM subido
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
