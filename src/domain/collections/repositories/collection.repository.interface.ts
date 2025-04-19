import { Collection, CollectionFormInput, Payment } from '../models/collection.model';

export interface CollectionFilter {
  status?: Collection['status'];
  clientId?: string;
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}

export interface ICollectionRepository {
  getAll(filters?: CollectionFilter): Promise<{ data: Collection[], count: number }>;
  getById(id: string): Promise<Collection>;
  create(data: CollectionFormInput): Promise<Collection>;
  update(id: string, data: Partial<CollectionFormInput>): Promise<Collection>;
  updateStatus(id: string, status: Collection['status']): Promise<Collection>;
  
  // Métodos específicos para pagos
  addPayment(collectionId: string, payment: Omit<Payment, 'id' | 'collectionId' | 'createdAt' | 'createdBy'>): Promise<Payment>;
  updatePayment(collectionId: string, paymentId: string, payment: Partial<Omit<Payment, 'id' | 'collectionId' | 'createdAt' | 'createdBy'>>): Promise<Payment>;
  deletePayment(collectionId: string, paymentId: string): Promise<void>;
  
  delete(id: string): Promise<void>;
}