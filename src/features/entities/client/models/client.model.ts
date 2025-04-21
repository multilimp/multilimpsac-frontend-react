
export interface Client {
  id: string;
  name: string;
  ruc: string;
  address: string;
  phone: string;
  email: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientContact {
  id: string;
  clientId: string;
  name: string;
  phone: string;
  email: string;
  position: string;
}

export type ClientFormInput = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;
