
import { 
  createDateVO, 
  createEntityId, 
  createMoney,
  createStatus
} from '@/core/domain/types/value-objects';
import type { Sale, SaleFormInput, SaleItem } from '../models/sale.model';

export class SaleMapper {
  static toDomain(raw: any): Sale {
    return {
      id: createEntityId(String(raw.id)),
      number: raw.codigo_venta,
      clientId: createEntityId(String(raw.cliente_id)),
      clientName: raw.cliente_nombre || '',
      date: createDateVO(raw.fecha_form),
      total: createMoney(Number(raw.monto_venta) || 0),
      status: createStatus(raw.etapa_actual || 'pending'),
      items: [], // Map items if available
      paymentStatus: createStatus(raw.estado_pago || 'pending'),
      paymentType: raw.tipo_pago || '',
      notes: raw.nota_op,
      createdBy: createEntityId(String(raw.created_by || '0')),
      createdAt: createDateVO(raw.created_at),
      updatedAt: createDateVO(raw.updated_at)
    };
  }

  static toDomainList(rawList: any[]): Sale[] {
    return rawList.map(this.toDomain);
  }

  static toRepository(domainSale: Partial<Sale>): any {
    return {
      cliente_id: domainSale.clientId?.value,
      fecha_form: domainSale.date?.value,
      monto_venta: domainSale.total?.amount,
      etapa_actual: domainSale.status?.value,
      tipo_pago: domainSale.paymentType,
      nota_op: domainSale.notes,
      estado_pago: domainSale.paymentStatus?.value
    };
  }

  static fromFormInput(input: SaleFormInput): Partial<Sale> {
    const total = input.items.reduce((sum, item) => 
      sum + (item.quantity * item.unitPrice), 0);

    return {
      clientId: createEntityId(input.clientId),
      date: createDateVO(input.date),
      total: createMoney(total),
      status: createStatus('pending'),
      paymentStatus: createStatus('pending'),
      paymentType: input.paymentType,
      notes: input.notes,
      items: input.items.map(item => ({
        id: createEntityId('temp'),
        productId: createEntityId(item.productId),
        productName: item.productName,
        description: item.description,
        quantity: item.quantity,
        unitPrice: createMoney(item.unitPrice),
        total: createMoney(item.quantity * item.unitPrice),
        taxRate: item.taxRate,
        unitMeasure: item.unitMeasure
      }))
    };
  }
}
