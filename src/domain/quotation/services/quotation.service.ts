
import { IQuotationRepository } from '../repositories/quotation.repository.interface';
import { SupabaseQuotationRepository } from '@/infrastructure/repositories/quotation/quotation.supabase.repository';
import { Quotation, QuotationFormInput } from '../models/quotation.model';
import { QuotationFormValues } from '@/features/quotation/models/quotationForm.model';

export interface QuotationFilter {
  status?: Quotation['status'];
  clientId?: string;
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}

export class QuotationService {
  private repository: IQuotationRepository;

  constructor(repository: IQuotationRepository) {
    this.repository = repository;
  }

  /**
   * Gets all quotations with optional filtering and pagination
   */
  async getQuotations(filters?: QuotationFilter): Promise<{ data: Quotation[], count: number }> {
    return this.repository.getAll(filters);
  }

  /**
   * Gets a quotation by its ID
   */
  async getQuotationById(id: string): Promise<Quotation> {
    return this.repository.getById(id);
  }

  /**
   * Creates a new quotation
   */
  async createQuotation(data: QuotationFormInput): Promise<Quotation> {
    return this.repository.create(data);
  }

  /**
   * Updates an existing quotation
   */
  async updateQuotation(id: string, data: QuotationFormInput): Promise<Quotation> {
    return this.repository.update(id, data);
  }

  /**
   * Updates the status of a quotation
   */
  async updateQuotationStatus(id: string, status: Quotation['status']): Promise<Quotation> {
    return this.repository.updateStatus(id, status);
  }

  /**
   * Deletes a quotation
   */
  async deleteQuotation(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  /**
   * Returns an empty quotation form to use as default values
   */
  getEmptyQuotationForm(): QuotationFormValues {
    return {
      clientId: '',
      contactId: '',
      date: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [{
        productName: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        code: '',
        unitMeasure: 'unidad'
      }],
      status: 'draft',
      paymentType: '',
      paymentNote: '',
      orderNote: '',
      deliveryAddress: '',
      deliveryDistrict: '',
      deliveryProvince: '',
      deliveryDepartment: '',
      deliveryReference: ''
    };
  }
}

// Export a singleton instance for use across the application
export const quotationService = new QuotationService(new SupabaseQuotationRepository());
