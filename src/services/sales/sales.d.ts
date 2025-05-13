import { ClientProps } from '../clients/clients';
import { CompanyProps } from '../companies/company';

export interface SaleProps {
  id: 5;
  codigoVenta: string;
  fechaEmision?: string;
  archivoOc?: string;
  empresaId: number;
  clienteId: number;
  contactoClienteId?: number;
  catalogoEmpresaId?: number;
  ventaPrivada: boolean;
  provinciaEntrega?: {
    id: string;
    name: string;
  };
  distritoEntrega?: {
    id: string;
    name: string;
  };
  departamentoEntrega?: {
    id: string;
    name: string;
  };
  direccionEntrega?: string;
  referenciaEntrega?: string;
  fechaEntrega?: string;
  montoVenta?: string;
  fechaForm?: string;
  fechaMaxForm?: string;
  productos: Array<string>;
  documentoOce?: string;
  documentoOcf?: string;
  siaf?: string;
  etapaSiaf?: string;
  fechaSiaf?: string;
  documentoPeruCompras?: string;
  fechaPeruCompras?: string;
  fechaEntregaOc?: string;
  penalidad?: string;
  netoCobrado?: string;
  estadoCobranza?: string;
  fechaEstadoCobranza?: string;
  fechaProximaGestion?: string;
  etapaActual: 'creacion' | 'pending' | 'completed';
  estadoActivo: boolean;
  empresa: CompanyProps;
  cliente: ClientProps;
  contactoCliente?: string;
  catalogoEmpresa?: string;
  ordenesProveedor: [];
}

export interface SaleFilter {
  clientRuc?: string;
  companyRuc?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
}
