
import { IBaseRepository } from '@/core/domain/repository/base.repository.interface';
import { Quotation, QuotationFormInput, QuotationStatus } from '../models/quotation.model';
import { EntityId, Status } from '@/core/domain/types/value-objects';

export interface QuotationFilter {
  status?: QuotationStatus;
  clientId?: string;
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}

export interface IQuotationRepository extends Omit<IBaseRepository<Quotation, EntityId>, 'create' | 'update'> {
  getAll(filter?: QuotationFilter): Promise<{ data: Quotation[], count: number }>;
  create(data: QuotationFormInput): Promise<Quotation>;
  update(id: EntityId, data: Partial<QuotationFormInput>): Promise<Quotation>;
  updateStatus(id: EntityId, status: Status): Promise<Quotation>;
}
