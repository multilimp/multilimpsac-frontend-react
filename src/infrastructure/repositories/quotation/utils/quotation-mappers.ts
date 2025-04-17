
import { Quotation, QuotationItem } from "@/domain/quotation/models/quotation.model";
import { numberToStringId } from "@/core/utils/id-conversions";

/**
 * Maps a database quotation to the domain model
 */
export function mapDbQuotationToDomain(
  dbQuotation: any,
  items: QuotationItem[]
): Quotation {
  return {
    id: numberToStringId(dbQuotation.id),
    number: dbQuotation.codigo_cotizacion,
    clientId: numberToStringId(dbQuotation.cliente_id),
    clientName: dbQuotation.clientes?.razon_social || "",
    date: dbQuotation.fecha_cotizacion,
    expiryDate: dbQuotation.fecha_entrega,
    total: dbQuotation.monto_total || 0,
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
    createdBy: "",
    createdAt: dbQuotation.created_at,
    updatedAt: dbQuotation.updated_at
  };
}

/**
 * Maps a database quotation item to the domain model
 */
export function mapDbQuotationItemToDomain(dbItem: any): QuotationItem {
  return {
    id: numberToStringId(dbItem.id),
    productId: dbItem.producto_id ? numberToStringId(dbItem.producto_id) : undefined,
    code: dbItem.codigo,
    productName: dbItem.descripcion || "",
    description: dbItem.descripcion || "",
    quantity: dbItem.cantidad,
    unitPrice: dbItem.precio_unitario,
    total: dbItem.total,
    taxRate: dbItem.tasa_impuesto,
    unitMeasure: dbItem.unidad_medida
  };
}

/**
 * Maps a domain status to a database status string
 */
export function mapDomainStatusToDb(status: Quotation['status']): string {
  return status; // Currently the same values, but having a mapping function allows for future differences
}

/**
 * Maps a database status string to a domain status
 */
export function mapDbStatusToDomain(dbStatus: string): Quotation['status'] {
  // Validate that the status is one of the allowed values
  const validStatuses: Quotation['status'][] = ['draft', 'sent', 'approved', 'rejected', 'expired'];
  
  if (validStatuses.includes(dbStatus as Quotation['status'])) {
    return dbStatus as Quotation['status'];
  }
  
  // Default to draft if invalid
  return 'draft';
}
