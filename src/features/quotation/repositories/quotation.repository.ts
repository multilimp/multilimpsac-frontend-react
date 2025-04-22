
import { Quotation, QuotationItem } from "../../processes/quotation/models/quotation";
import { QuotationFormValues } from "../../processes/quotation/models/quotationForm.model";

export interface QuotationRepository {
  getAll(): Promise<Quotation[]>;
  getById(id: string): Promise<Quotation>;
  create(data: QuotationFormValues): Promise<Quotation>;
  update(id: string, data: QuotationFormValues): Promise<Quotation>;
  updateStatus(id: string, status: Quotation['status']): Promise<Quotation>;
  delete(id: string): Promise<void>;
}
