
import { SupplierOrder, SupplierOrderItem } from '../models/supplier-order.model';

export class SupplierOrderMapper {
  public static toDomain(raw: any): SupplierOrder {
    return {
      id: { value: raw.id.toString(), isValid: () => true },
      number: raw.codigo_op || '',
      supplierId: { value: raw.proveedor_id?.toString() || '', isValid: () => true },
      supplierName: '', // Would need to fetch from supplier
      date: { 
        value: raw.fecha_entrega || new Date().toISOString(),
        isValid: () => true
      },
      deliveryDate: raw.fecha_programada ? {
        value: raw.fecha_programada,
        isValid: () => true
      } : null,
      total: {
        amount: Number(raw.total_proveedor) || 0,
        currency: 'PEN'
      },
      status: {
        value: raw.estado_op || 'draft',
        isValid: () => ['draft', 'sent', 'confirmed', 'received', 'cancelled'].includes(raw.estado_op)
      },
      items: [], // Would need to fetch these separately
      paymentStatus: {
        value: 'pending',
        isValid: () => true
      },
      paymentTerms: raw.tipo_pago || '',
      notes: raw.nota_pedido || '',
      deliveryAddress: '',
      createdAt: {
        value: raw.created_at || new Date().toISOString(),
        isValid: () => true
      },
      updatedAt: {
        value: raw.updated_at || new Date().toISOString(),
        isValid: () => true
      }
    };
  }

  public static toDatabase(domain: SupplierOrder): any {
    return {
      id: parseInt(domain.id.value),
      codigo_op: domain.number,
      proveedor_id: parseInt(domain.supplierId.value),
      fecha_entrega: domain.date.value,
      fecha_programada: domain.deliveryDate?.value,
      total_proveedor: domain.total.amount,
      estado_op: domain.status.value,
      tipo_pago: domain.paymentTerms,
      nota_pedido: domain.notes,
      created_at: domain.createdAt.value,
      updated_at: domain.updatedAt.value
    };
  }
}
