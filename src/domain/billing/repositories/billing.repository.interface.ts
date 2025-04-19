
import { Invoice, InvoiceFormInput } from '../models/billing.model';

export interface InvoiceFilter {
  type?: Invoice['type'];
  status?: Invoice['status'];
  clientId?: string;
  fromDate?: string;
  toDate?: string;
  series?: string;
  searchTerm?: string;
  paymentStatus?: Invoice['paymentStatus'];
  page?: number;
  pageSize?: number;
}

export interface IBillingRepository {
  getAll(filters?: InvoiceFilter): Promise<{ data: Invoice[], count: number }>;
  getById(id: string): Promise<Invoice>;
  create(data: InvoiceFormInput): Promise<Invoice>;
  update(id: string, data: Partial<InvoiceFormInput>): Promise<Invoice>;
  updateStatus(id: string, status: Invoice['status']): Promise<Invoice>;
  updatePaymentStatus(id: string, status: Invoice['paymentStatus']): Promise<Invoice>;
  void(id: string): Promise<Invoice>;
  generateElectronicBilling(id: string): Promise<Invoice>;
  delete(id: string): Promise<void>;
}
