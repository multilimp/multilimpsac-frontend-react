
/**
 * Base repository interface that defines standard CRUD operations
 */
export interface IRepository<T, ID> {
  getAll(): Promise<T[]>;
  getById(id: ID): Promise<T>;
  create(entity: Omit<T, 'id'>): Promise<T>;
  update(id: ID, entity: Partial<T>): Promise<T>;
  delete(id: ID): Promise<void>;
}
