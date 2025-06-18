import apiClient from '../apiClient';
import { ContactFilterProps, ContactProps } from './contacts';

export const getContacts = async (params?: ContactFilterProps): Promise<Array<ContactProps>> => {
  const res = await apiClient.get('/contacts', { params });
  return res.data.data;
};

export const createContact = async (contactData: Partial<ContactProps>): Promise<ContactProps> => {
  const res = await apiClient.post('/contacts', contactData);
  return res.data;
};

export const updateContact = async (contactId: number, contactData: Partial<ContactProps>): Promise<ContactProps> => {
  const res = await apiClient.put(`/contacts/${contactId}`, contactData);
  return res.data;
};

export const deleteContact = async (contactId: number): Promise<boolean> => {
  const res = await apiClient.delete(`/contacts/${contactId}`);
  return res.status === 200;
};

export const getContactsByEntityType = async (entityType: 'cliente' | 'proveedor' | 'transporte', entityId: number): Promise<Array<ContactProps>> => {
  let endpoint;
  
  switch (entityType) {
    case 'cliente':
      endpoint = `/contacts/client/${entityId}`;
      break;
    case 'proveedor':
      endpoint = `/contacts/provider/${entityId}`;
      break;
    case 'transporte':
      endpoint = `/contacts/transport/${entityId}`;
      break;
    default:
      throw new Error(`Tipo de entidad no válido: ${entityType}`);
  }
  
  const res = await apiClient.get(endpoint);
  return res.data.data; // El backend devuelve { data: [...], meta: {...} }
};
