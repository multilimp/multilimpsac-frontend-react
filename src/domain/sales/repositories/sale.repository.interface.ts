import { Sale, SaleFormInput } from '../models/sale.model';

export interface SaleFilter {
  status?: Sale['status'];
  clientId?: string;
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}

export interface ISaleRepository {
  getAll(filters?: SaleFilter): Promise<{ data: Sale[], count: number }>;
  getById(id: string): Promise<Sale>;
  create(data: SaleFormInput): Promise<Sale>;
  update(id: string, data: Partial<SaleFormInput>): Promise<Sale>;
  updateStatus(id: string, status: Sale['status']): Promise<Sale>;
  delete(id: string): Promise<void>;
}