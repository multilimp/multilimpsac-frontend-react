
import { Quotation, QuotationItem } from "@/domain/quotation/models/quotation.model";
import { numberToStringId, stringToNumberId } from "@/core/utils/id-conversions";

/**
 * Maps database quotation status to domain model status
 */
export const mapDbStatusToDomain = (status: string | null): Quotation['status'] => {
  switch (status) {
    case 'aprobada': return 'approved';
    case 'rechazada': return 'rejected';
    case 'enviada': return 'sent';
    case 'vencida': return 'expired';
    default: return 'draft';
  }
};

/**
 * Maps domain model status to database status
 */
export const mapDomainStatusToDb = (status: string): string => {
  switch (status) {
    case 'approved': return 'aprobada';
    case 'rejected': return 'rechazada';
    case 'sent': return 'enviada';
    case 'expired': return 'vencida';
    default: return 'borrador';
  }
};

/**
 * Maps database quotation data to domain Quotation model
 */
export const mapDbQuotationToDomain = (
  dbQuotation: any, 
  items: QuotationItem[] = []
): Quotation => {
  return {
    id: numberToStringId(dbQuotation.id),
    number: dbQuotation.codigo_cotizacion,
    clientId: numberToStringId(dbQuotation.cliente_id),
    clientName: dbQuotation.clientes?.razon_social || "Cliente sin nombre",
    date: dbQuotation.fecha_cotizacion,
    expiryDate: dbQuotation.fecha_entrega,
    total: dbQuotation.monto_total || 0,
    status: mapDbStatusToDomain(dbQuotation.estado),
    items: items,
    notes: dbQuotation.nota_pedido,
    paymentNote: dbQuotation.nota_pago,
    paymentType: dbQuotation.tipo_pago,
    deliveryAddress: dbQuotation.direccion_entrega,
    deliveryDistrict: dbQuotation.distrito_entrega,
    deliveryProvince: dbQuotation.provincia_entrega,
    deliveryDepartment: dbQuotation.departamento_entrega,
    deliveryReference: dbQuotation.referencia_entrega,
    createdBy: "system",
    createdAt: dbQuotation.created_at,
    updatedAt: dbQuotation.updated_at
  };
};

/**
 * Maps database quotation item data to domain QuotationItem model
 */
export const mapDbQuotationItemToDomain = (dbItem: any): QuotationItem => {
  return {
    id: numberToStringId(dbItem.id),
    productId: dbItem.id ? numberToStringId(dbItem.id) : undefined,
    productName: dbItem.codigo || "",
    description: dbItem.descripcion || "",
    quantity: dbItem.cantidad || 0,
    unitPrice: dbItem.precio_unitario || 0,
    total: dbItem.total || 0,
    unitMeasure: dbItem.unidad_medida
  };
};
