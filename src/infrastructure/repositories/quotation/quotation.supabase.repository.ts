
import { Quotation, QuotationFormInput } from "@/domain/quotation/models/quotation.model";
import { IQuotationRepository, QuotationFilter } from "@/domain/quotation/repositories/quotation.repository.interface";
import { QuotationReadRepository } from "./quotation.read.repository";
import { QuotationWriteRepository } from "./quotation.write.repository";
import { createEntityId, createStatus, EntityId, Status } from "@/core/domain/types/value-objects";

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
      otherFilters as any, 
      page && pageSize ? { page, pageSize } : undefined
    );
  }

  async getById(id: EntityId): Promise<Quotation> {
    return this.readRepository.getById(id.value);
  }

  async create(data: QuotationFormInput): Promise<Quotation> {
    return this.writeRepository.create(data);
  }

  async update(id: EntityId, data: Partial<QuotationFormInput>): Promise<Quotation> {
    return this.writeRepository.update(id.value, data as QuotationFormInput);
  }

  async updateStatus(id: EntityId, status: Status): Promise<Quotation> {
    return this.writeRepository.updateStatus(id.value, status.value);
  }

  async delete(id: EntityId): Promise<void> {
    return this.writeRepository.delete(id.value);
  }
}
