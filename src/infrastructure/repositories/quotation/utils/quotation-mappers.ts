
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
    status: dbQuotation.estado as Quotation['status'],
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
