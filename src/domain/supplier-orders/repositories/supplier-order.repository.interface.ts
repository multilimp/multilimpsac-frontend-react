import { SupplierOrder, SupplierOrderFormInput } from '../models/supplier-order.model';

export interface SupplierOrderFilter {
  status?: SupplierOrder['status'];
  supplierId?: string;
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}

export interface ISupplierOrderRepository {
  getAll(filters?: SupplierOrderFilter): Promise<{ data: SupplierOrder[], count: number }>;
  getById(id: string): Promise<SupplierOrder>;
  create(data: SupplierOrderFormInput): Promise<SupplierOrder>;
  update(id: string, data: Partial<SupplierOrderFormInput>): Promise<SupplierOrder>;
  updateStatus(id: string, status: SupplierOrder['status']): Promise<SupplierOrder>;
  delete(id: string): Promise<void>;
}