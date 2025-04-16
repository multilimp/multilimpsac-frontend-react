
import { Quotation } from "../models/quotation";
import { QuotationFormValues } from "../models/quotationForm.model";
import { QuotationRepository } from "./quotation.repository";
import { QuotationReadRepository } from "./quotation.read.repository";
import { QuotationWriteRepository } from "./quotation.write.repository";

/**
 * Implementation of QuotationRepository interface using Supabase
 */
export class SupabaseQuotationRepository implements QuotationRepository {
  private readRepository: QuotationReadRepository;
  private writeRepository: QuotationWriteRepository;

  constructor() {
    this.readRepository = new QuotationReadRepository();
    this.writeRepository = new QuotationWriteRepository();
  }

  async getAll(): Promise<Quotation[]> {
    return this.readRepository.getAll();
  }

  async getById(id: string): Promise<Quotation> {
    return this.readRepository.getById(id);
  }

  async create(data: QuotationFormValues): Promise<Quotation> {
    return this.writeRepository.create(data);
  }

  async update(id: string, data: QuotationFormValues): Promise<Quotation> {
    return this.writeRepository.update(id, data);
  }

  async updateStatus(id: string, status: Quotation['status']): Promise<Quotation> {
    return this.writeRepository.updateStatus(id, status);
  }

  async delete(id: string): Promise<void> {
    return this.writeRepository.delete(id);
  }
}
