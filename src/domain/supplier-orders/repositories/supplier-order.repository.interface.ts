
import { IBaseRepository } from '@/core/domain/repository/base.repository.interface';
import { SupplierOrder, SupplierOrderId } from '../models/supplier-order.model';

export interface SupplierOrderFilter {
  status?: string;
  supplierId?: string;
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}

export interface ISupplierOrderRepository extends IBaseRepository<SupplierOrder, SupplierOrderId> {
  getAll(filters?: SupplierOrderFilter): Promise<{ data: SupplierOrder[]; count: number }>;
  updateStatus(id: SupplierOrderId, status: string): Promise<SupplierOrder>;
}
