
import { Quotation, QuotationFormInput } from "../models/quotation.model";
import { IQuotationRepository } from "../repositories/quotation.repository.interface";
import { SupabaseQuotationRepository } from "@/infrastructure/repositories/quotation/quotation.supabase.repository";

/**
 * Service for quotation operations
 */
export class QuotationService {
  private repository: IQuotationRepository;

  constructor(repository: IQuotationRepository = new SupabaseQuotationRepository()) {
    this.repository = repository;
  }

  async getAllQuotations(): Promise<Quotation[]> {
    return await this.repository.getAll();
  }

  async getQuotationById(id: string): Promise<Quotation> {
    return await this.repository.getById(id);
  }

  async createQuotation(data: QuotationFormInput): Promise<Quotation> {
    return await this.repository.create(data);
  }

  async updateQuotation(id: string, data: QuotationFormInput): Promise<Quotation> {
    return await this.repository.update(id, data);
  }

  async updateQuotationStatus(id: string, status: Quotation['status']): Promise<Quotation> {
    return await this.repository.updateStatus(id, status);
  }

  async deleteQuotation(id: string): Promise<void> {
    return await this.repository.delete(id);
  }

  getEmptyQuotationForm(): QuotationFormInput {
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

// Export a singleton instance for use across the application
export const quotationService = new QuotationService();
