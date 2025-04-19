
import { Quotation, QuotationFormInput, QuotationStatus } from '../models/quotation.model';
import { createDateVO, createEntityId, createMoney } from '@/core/domain/types/value-objects';

export class QuotationMapper {
  static toDTO(domain: Quotation) {
    return {
      id: domain.id.value,
      number: domain.number,
      clientId: domain.clientId.value,
      clientName: domain.clientName,
      date: domain.date.value,
      expiryDate: domain.expiryDate.value,
      total: domain.total.amount,
      status: domain.status,
      items: domain.items.map(item => ({
        ...item,
        unitPrice: item.unitPrice.amount,
        total: item.total.amount
      }))
    };
  }

  static fromDTO(dto: any): Quotation {
    return {
      id: createEntityId(dto.id),
      number: dto.number,
      clientId: createEntityId(dto.client_id),
      clientName: dto.client_name,
      date: createDateVO(dto.date),
      expiryDate: createDateVO(dto.expiry_date),
      total: createMoney(dto.total),
      status: dto.status as QuotationStatus,
      items: dto.items.map(item => ({
        ...item,
        unitPrice: createMoney(item.unit_price),
        total: createMoney(item.total)
      })),
      createdBy: dto.created_by,
      notes: dto.notes
    };
  }

  static fromFormInput(input: QuotationFormInput): Partial<Quotation> {
    return {
      clientId: createEntityId(input.clientId),
      date: createDateVO(input.date),
      expiryDate: createDateVO(input.expiryDate),
      status: input.status,
      notes: input.notes,
      items: input.items.map(item => ({
        ...item,
        unitPrice: createMoney(item.unitPrice),
        total: createMoney(item.quantity * item.unitPrice)
      }))
    };
  }
}
