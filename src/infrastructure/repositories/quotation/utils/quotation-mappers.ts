
import { Quotation, QuotationItem, QuotationStatus } from "@/domain/quotation/models/quotation.model";
import { createEntityId, createDateVO, createMoney, createStatus, EntityId, DateVO, Status, Money } from "@/core/domain/types/value-objects";

/**
 * Maps a database status string to a domain status
 */
export function mapDbStatusToDomain(dbStatus: string): QuotationStatus {
  switch (dbStatus) {
    case 'borrador': return 'draft';
    case 'enviada': return 'sent';
    case 'aprobada': return 'approved';
    case 'rechazada': return 'rejected';
    case 'vencida': return 'expired';
    default: return 'draft';
  }
}

/**
 * Maps a domain status to a database status string
 */
export function mapDomainStatusToDb(status: string | Status): string {
  const statusValue = typeof status === 'object' ? status.value : status;
  
  switch (statusValue) {
    case 'draft': return 'borrador';
    case 'sent': return 'enviada';
    case 'approved': return 'aprobada';
    case 'rejected': return 'rechazada';
    case 'expired': return 'vencida';
    default: return 'borrador';
  }
}

/**
 * Maps a database quotation to the domain model
 */
export function mapDbQuotationToDomain(
  dbQuotation: any,
  items: QuotationItem[]
): Quotation {
  return {
    id: createEntityId(String(dbQuotation.id)),
    number: dbQuotation.codigo_cotizacion,
    clientId: createEntityId(String(dbQuotation.cliente_id)),
    clientName: dbQuotation.clientes?.razon_social || "",
    date: createDateVO(dbQuotation.fecha_cotizacion),
    expiryDate: createDateVO(dbQuotation.fecha_entrega),
    total: createMoney(Number(dbQuotation.monto_total) || 0),
    status: mapDbStatusToDomain(dbQuotation.estado),
    items: items,
    notes: dbQuotation.nota_pedido,
    paymentNote: dbQuotation.nota_pago,
    paymentType: dbQuotation.tipo_pago,
    orderNote: dbQuotation.nota_pedido,
    deliveryAddress: dbQuotation.direccion_entrega,
    deliveryDistrict: dbQuotation.distrito_entrega,
    deliveryProvince: dbQuotation.provincia_entrega,
    deliveryDepartment: dbQuotation.departamento_entrega,
    deliveryReference: dbQuotation.referencia_entrega,
    createdBy: String(dbQuotation.created_by || '0'),
    createdAt: dbQuotation.created_at ? createDateVO(dbQuotation.created_at) : createDateVO(new Date().toISOString()),
    updatedAt: dbQuotation.updated_at ? createDateVO(dbQuotation.updated_at) : createDateVO(new Date().toISOString())
  };
}

/**
 * Maps a domain quotation to a database object
 */
export function mapDomainQuotationToDb(quotation: Quotation): any {
  return {
    id: quotation.id.value,
    codigo_cotizacion: quotation.number,
    cliente_id: Number(quotation.clientId.value),
    fecha_cotizacion: quotation.date.value,
    fecha_entrega: quotation.expiryDate.value,
    monto_total: quotation.total.amount,
    estado: mapDomainStatusToDb(quotation.status),
    nota_pedido: quotation.notes,
    nota_pago: quotation.paymentNote,
    tipo_pago: quotation.paymentType,
    direccion_entrega: quotation.deliveryAddress,
    distrito_entrega: quotation.deliveryDistrict,
    provincia_entrega: quotation.deliveryProvince,
    departamento_entrega: quotation.deliveryDepartment,
    referencia_entrega: quotation.deliveryReference,
    created_by: quotation.createdBy,
    created_at: quotation.createdAt.value,
    updated_at: quotation.updatedAt.value
  };
}

/**
 * Maps a database quotation item to the domain model
 */
export function mapDbQuotationItemToDomain(dbItem: any): QuotationItem {
  return {
    id: String(dbItem.id),
    productId: dbItem.producto_id ? String(dbItem.producto_id) : undefined,
    productName: dbItem.descripcion || "",
    description: dbItem.descripcion || "",
    quantity: dbItem.cantidad,
    unitPrice: createMoney(Number(dbItem.precio_unitario)),
    total: createMoney(Number(dbItem.total)),
    taxRate: dbItem.tasa_impuesto,
    unitMeasure: dbItem.unidad_medida,
    code: dbItem.codigo
  };
}
