
export interface Contact {
  id: string;
  name: string;
  position?: string;
  phone?: string;
  email?: string;
  status: 'active' | 'inactive';
}
