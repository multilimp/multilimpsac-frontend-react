// src/services/orders/order.ts
export interface OrderProps {
  id: string | number;
  codigoVento: string;            // Código Vento
  razonSocialCliente: string;     // Razón social cliente
  rucCliente: string;             // RUC cliente
  rucEmpresa: string;             // RUC empresa
  razonSocialEmpresa: string;     // Razón social Empresa
  contacto: string;               // Contacto
  catalogo: string;               // Catálogo
  fechaRegistro: string;          // Fecha registro (ISO string)
  fechaMaximaEntrega: string;     // Fecha máxima entrega (ISO string)
  montoVenta: number;             // Monto Venta
  cue: string;                    // CUE
  departamento: string;           // Departamento
  oce: string;                    // OCE
  ocf: string;                    // OCF
  fechaEntregaOC: string;         // Fecha entrega OC (ISO string)
}
