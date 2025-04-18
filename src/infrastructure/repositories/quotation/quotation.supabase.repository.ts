
import { Quotation, QuotationFormInput } from "@/domain/quotation/models/quotation.model";
import { IQuotationRepository, QuotationFilter } from "@/domain/quotation/repositories/quotation.repository.interface";
import { QuotationReadRepository } from "./quotation.read.repository";
import { QuotationWriteRepository } from "./quotation.write.repository";

/**
 * Supabase implementation of the quotation repository
 */
export class SupabaseQuotationRepository implements IQuotationRepository {
  private readRepository: QuotationReadRepository;
  private writeRepository: QuotationWriteRepository;

  constructor() {
    this.readRepository = new QuotationReadRepository();
    this.writeRepository = new QuotationWriteRepository();
  }

  async getAll(filter?: QuotationFilter): Promise<{ data: Quotation[], count: number }> {
    const { page, pageSize, ...otherFilters } = filter || {};
    
    return this.readRepository.getAll(
      otherFilters, 
      page && pageSize ? { page, pageSize } : undefined
    );
  }

  async getById(id: string): Promise<Quotation> {
    return this.readRepository.getById(id);
  }

  async create(data: QuotationFormInput): Promise<Quotation> {
    return this.writeRepository.create(data);
  }

  async update(id: string, data: QuotationFormInput): Promise<Quotation> {
    return this.writeRepository.update(id, data);
  }

  async updateStatus(id: string, status: Quotation['status']): Promise<Quotation> {
    return this.writeRepository.updateStatus(id, status);
  }

  async delete(id: string): Promise<void> {
    return this.writeRepository.delete(id);
  }
}
