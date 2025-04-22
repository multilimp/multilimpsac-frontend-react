
import { Quotation } from "../../processes/quotation/models/quotation";
import { QuotationFormValues } from "../../processes/quotation/models/quotationForm.model";
import { QuotationRepository } from "../repositories/quotation.repository";
import { SupabaseQuotationRepository } from "../repositories/quotation.supabase.repository";

class QuotationService {
  private repository: QuotationRepository;

  constructor(repository: QuotationRepository = new SupabaseQuotationRepository()) {
    this.repository = repository;
  }

  async getAllQuotations(): Promise<Quotation[]> {
    return await this.repository.getAll();
  }

  async getQuotationById(id: string): Promise<Quotation> {
    return await this.repository.getById(id);
  }

  async createQuotation(data: QuotationFormValues): Promise<Quotation> {
    return await this.repository.create(data);
  }

  async updateQuotation(id: string, data: QuotationFormValues): Promise<Quotation> {
    return await this.repository.update(id, data);
  }

  async updateQuotationStatus(id: string, status: Quotation['status']): Promise<Quotation> {
    return await this.repository.updateStatus(id, status);
  }

  async deleteQuotation(id: string): Promise<void> {
    return await this.repository.delete(id);
  }

  getEmptyQuotationForm(): QuotationFormValues {
    return {
      clientId: "",
      date: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [
        {
          productName: "",
          description: "",
          quantity: 1,
          unitPrice: 0,
        }
      ],
      status: "draft",
    };
  }
}

export const quotationService = new QuotationService();
