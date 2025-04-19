
import { 
  createDateVO, 
  createEntityId, 
  createMoney,
  createStatus
} from '@/core/domain/types/value-objects';
import type { Quotation, QuotationFormInput, QuotationItem } from '../models/quotation.model';

export class QuotationMapper {
  static toDomain(raw: any): Quotation {
    return {
      id: createEntityId(String(raw.id)),
      number: raw.codigo_cotizacion,
      clientId: createEntityId(String(raw.cliente_id)),
      clientName: raw.clientes?.razon_social || '',
      date: createDateVO(raw.fecha_cotizacion),
      expiryDate: createDateVO(raw.fecha_entrega),
      total: createMoney(Number(raw.monto_total) || 0),
      status: createStatus(raw.estado || 'draft'),
      items: (raw.items || []).map(this.toDomainItem),
      notes: raw.nota_pedido,
      paymentNote: raw.nota_pago,
      paymentType: raw.tipo_pago,
      orderNote: raw.nota_pedido,
      deliveryAddress: raw.direccion_entrega,
      deliveryDistrict: raw.distrito_entrega,
      deliveryProvince: raw.provincia_entrega,
      deliveryDepartment: raw.departamento_entrega,
      deliveryReference: raw.referencia_entrega,
      createdBy: createEntityId(String(raw.created_by || '0')),
      createdAt: createDateVO(raw.created_at),
      updatedAt: createDateVO(raw.updated_at)
    };
  }

  static toDomainItem(raw: any): QuotationItem {
    return {
      id: createEntityId(String(raw.id)),
      productId: raw.producto_id ? createEntityId(String(raw.producto_id)) : undefined,
      productName: raw.descripcion || '',
      description: raw.descripcion || '',
      quantity: raw.cantidad,
      unitPrice: createMoney(Number(raw.precio_unitario)),
      total: createMoney(Number(raw.total)),
      taxRate: raw.tasa_impuesto,
      unitMeasure: raw.unidad_medida,
      code: raw.codigo
    };
  }

  static toRepository(domainQuotation: Partial<Quotation>): any {
    return {
      cliente_id: domainQuotation.clientId?.value,
      fecha_cotizacion: domainQuotation.date?.value,
      fecha_entrega: domainQuotation.expiryDate?.value,
      monto_total: domainQuotation.total?.amount,
      estado: domainQuotation.status?.value,
      tipo_pago: domainQuotation.paymentType,
      nota_pago: domainQuotation.paymentNote,
      nota_pedido: domainQuotation.notes,
      direccion_entrega: domainQuotation.deliveryAddress,
      distrito_entrega: domainQuotation.deliveryDistrict,
      provincia_entrega: domainQuotation.deliveryProvince,
      departamento_entrega: domainQuotation.deliveryDepartment,
      referencia_entrega: domainQuotation.deliveryReference
    };
  }

  static fromFormInput(input: QuotationFormInput): Partial<Quotation> {
    const total = input.items.reduce((sum, item) => 
      sum + (item.quantity * item.unitPrice), 0);

    return {
      clientId: createEntityId(input.clientId),
      date: createDateVO(input.date),
      expiryDate: createDateVO(input.expiryDate),
      total: createMoney(total),
      status: createStatus(input.status),
      paymentType: input.paymentType,
      paymentNote: input.paymentNote,
      orderNote: input.orderNote,
      deliveryAddress: input.deliveryAddress,
      deliveryDistrict: input.deliveryDistrict,
      deliveryProvince: input.deliveryProvince,
      deliveryDepartment: input.deliveryDepartment,
      deliveryReference: input.deliveryReference,
      items: input.items.map(item => ({
        id: createEntityId('temp'),
        productId: item.productId ? createEntityId(item.productId) : undefined,
        productName: item.productName,
        description: item.description || item.productName,
        quantity: item.quantity,
        unitPrice: createMoney(item.unitPrice),
        total: createMoney(item.quantity * item.unitPrice),
        taxRate: item.taxRate,
        unitMeasure: item.unitMeasure,
        code: item.code
      }))
    };
  }
}
