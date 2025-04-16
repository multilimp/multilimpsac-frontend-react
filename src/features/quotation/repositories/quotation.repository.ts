
import { Quotation, QuotationItem } from "../models/quotation";
import { QuotationFormValues } from "../models/quotationForm.model";

export interface QuotationRepository {
  getAll(): Promise<Quotation[]>;
  getById(id: string): Promise<Quotation>;
  create(data: QuotationFormValues): Promise<Quotation>;
  update(id: string, data: QuotationFormValues): Promise<Quotation>;
  updateStatus(id: string, status: Quotation['status']): Promise<Quotation>;
  delete(id: string): Promise<void>;
}
