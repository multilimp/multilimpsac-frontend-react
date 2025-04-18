
import { IRepository } from "@/core/domain/repository.interface";
import { Quotation } from "../models/quotation.model";
import { QuotationFormInput } from "../models/quotation.model";

export interface QuotationFilter {
  status?: Quotation['status'];
  clientId?: string;
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Repository interface specific to the quotation domain
 */
export interface IQuotationRepository extends Omit<IRepository<Quotation, string>, 'update' | 'create' | 'getAll'> {
  getAll(filter?: QuotationFilter): Promise<{ data: Quotation[], count: number }>;
  getById(id: string): Promise<Quotation>;
  create(data: QuotationFormInput): Promise<Quotation>;
  update(id: string, data: QuotationFormInput): Promise<Quotation>;
  updateStatus(id: string, status: Quotation['status']): Promise<Quotation>;
  delete(id: string): Promise<void>;
}
