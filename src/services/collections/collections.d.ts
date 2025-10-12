// src/services/collections/collections.d.ts
export interface CollectionProps {
  id: number;
  codigoVenta: string;
  cliente: {
    razonSocial: string;
    ruc: string;
    codigoUnidadEjecutora: string;
  };
  empresa: {
    ruc: string;
    razonSocial: string;
  };
  contactoCliente?: {
    nombre: string;
    cargo: string;
  };
  catalogoEmpresa?: {
    nombre: string;
  };
  fechaForm: string | null;
  fechaMaxForm: string | null;
  montoVenta: string;
  direccionEntrega?: string;
  departamentoEntrega?: string;
  provinciaEntrega?: string;
  distritoEntrega?: string;
  referenciaEntrega?: string;
  estadoVenta?: string;
  documentoOce?: string;
  documentoOcf?: string;
  // Campos específicos de cobranza (se pueden agregar después)
  estadoCobranza?: string;
  fechaEstadoCobranza?: string | null;
  netoCobrado?: string;
  penalidad?: string;
  fechaProximaGestion?: string | null;
}
