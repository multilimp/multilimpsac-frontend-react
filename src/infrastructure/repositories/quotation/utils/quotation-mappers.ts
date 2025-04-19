
import { Quotation, QuotationItem } from "@/domain/quotation/models/quotation.model";
import { numberToStringId } from "@/core/utils/id-conversions";
import { createStatus } from "@/core/domain/types/value-objects";

/**
 * Maps a database status string to a domain status
 */
export function mapDbStatusToDomain(dbStatus: string): string {
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
export function mapDomainStatusToDb(status: string | { value: string }): string {
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
    status: createStatus(mapDbStatusToDomain(dbQuotation.estado)),
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
    createdBy: createEntityId(String(dbQuotation.created_by || '0')),
    createdAt: createDateVO(dbQuotation.created_at),
    updatedAt: createDateVO(dbQuotation.updated_at)
  };
}

/**
 * Maps a database quotation item to the domain model
 */
export function mapDbQuotationItemToDomain(dbItem: any): QuotationItem {
  return {
    id: createEntityId(String(dbItem.id)),
    productId: dbItem.producto_id ? createEntityId(String(dbItem.producto_id)) : undefined,
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

// Import these at the top to avoid circular dependencies
import { createEntityId, createDateVO, createMoney } from "@/core/domain/types/value-objects";
