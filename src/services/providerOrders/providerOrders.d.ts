import { ContactProps } from '../contacts/contacts';
import { ProviderProps } from '../providers/providers';
import { TransportProps } from '../transports/transports';
import { TransporteAsignadoProps } from '../transporteAsignado/transporteAsignado';
import { Almacen } from '@/types/almacen.types';
import { EstadoVentaType } from '@/utils/constants';

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
  notaObservaciones: null;
  notaCobranzas: null;
  isCompleted: boolean;
  estadoRolOp: EstadoVentaType;
  activo: true;
  ordenCompraId: number | null;
  createdAt: string;
  updatedAt: string;
  empresa: null;
  proveedor: ProviderProps;
  contactoProveedor: ContactProps;
  ordenCompra: {
    id: number;
    codigoVenta: string;
    fechaEmision: string;
    empresaId: number;
    clienteId: number;
    contactoClienteId: number;
    departamentoEntrega: string;
    provinciaEntrega: string;
    distritoEntrega: string;
    direccionEntrega: string;
    referenciaEntrega: string;
    montoVenta?: string | null;
    documentoOce: string;
    documentoOcf: string;
    fechaMaxForm: string;
    fechaEntregaOc: string;
    cliente: {
      id: number;
      razonSocial: string;
      ruc: string;
    };
    contactoCliente: {
      id: number;
      nombre: string;
      cargo: string;
      telefono: string;
      email: string;
    };
  } | null;
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
  transportesAsignados: TransporteAsignadoProps[];
}
