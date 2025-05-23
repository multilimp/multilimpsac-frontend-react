import { ContactProps } from '../contacts/contacts';
import { ProviderProps } from '../providers/providers';
import { TransportProps } from '../transports/transports';

export interface ProviderOrderProps {
  id: number;
  codigoOp: string;
  empresaId?: number;
  proveedorId: number;
  contactoProveedorId: number;
  fechaDespacho: string;
  fechaProgramada: string;
  fechaRecepcion: string;
  notaPedido: string;
  totalProveedor: null;
  tipoPago: null;
  notaPago: null;
  notaGestionOp: null;
  tipoEntrega: null;
  retornoMercaderia: null;
  estadoOp: null;
  fechaEntrega: null;
  cargoOea: null;
  etiquetado: null;
  embalaje: null;
  observaciones: null;
  notaAdicional: null;
  activo: true;
  ordenCompraId: null;
  createdAt: string;
  updatedAt: string;
  empresa: null;
  proveedor: ProviderProps;
  contactoProveedor: ContactProps;
  ordenCompra: null;
  productos: [
    {
      id: number;
      codigo: string;
      descripcion: string;
      unidadMedida: string;
      cantidad: 1;
      cantidadAlmacen: 1;
      cantidadTotal: 1;
      precioUnitario: string;
      total: string;
      ordenProveedorId: 7;
      createdAt: string;
      updatedAt: string;
    }
  ];
  pagos: [];
  transportesAsignados: Array<{
    id: number;
    codigoTransporte: string;
    transporteId: number;
    ordenProveedorId: number;
    contactoTransporteId: number;
    tipoDestino: string;
    region: string;
    provincia: string;
    distrito: string;
    direccion: string;
    notaTransporte: string;
    cotizacionTransporte: string;
    estadoPago: null;
    montoFlete: null;
    grt: null;
    createdAt: string;
    updatedAt: string;
    transporte: TransportProps;
    contactoTransporte: ContactProps;
    pagos: [];
  }>;
}
