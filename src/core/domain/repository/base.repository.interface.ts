
import { EntityId } from '../types/value-objects';

export interface IBaseRepository<T, ID extends EntityId> {
  getAll(filter?: any): Promise<{ data: T[]; count: number }>;
  getById(id: ID): Promise<T>;
  create(entity: Omit<T, 'id'>): Promise<T>;
  update(id: ID, entity: Partial<T>): Promise<T>;
  delete(id: ID): Promise<void>;
}
