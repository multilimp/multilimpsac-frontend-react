
import { IRepository } from "@/core/domain/repository.interface";
import { Quotation } from "../models/quotation.model";
import { QuotationFormInput } from "../models/quotation.model";

/**
 * Repository interface specific to the quotation domain
 */
export interface IQuotationRepository extends Omit<IRepository<Quotation, string>, 'update' | 'create'> {
  getAll(): Promise<Quotation[]>;
  getById(id: string): Promise<Quotation>;
  create(data: QuotationFormInput): Promise<Quotation>;
  update(id: string, data: QuotationFormInput): Promise<Quotation>;
  updateStatus(id: string, status: Quotation['status']): Promise<Quotation>;
  delete(id: string): Promise<void>;
}
