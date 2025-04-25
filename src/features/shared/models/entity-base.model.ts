
export interface EntityBase {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}
