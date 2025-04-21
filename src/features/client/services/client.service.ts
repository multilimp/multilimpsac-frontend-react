
import { Client, ClientContact } from '@/features/entities/client/models/client.model';
import { clientService as entityClientService } from '@/features/entities/client/services/client.service';

// Define the client service object
const clientService = {
  getAll: () => entityClientService.fetchClients(),
  getById: (id: string) => entityClientService.fetchClientById(id),
  create: (client: Partial<Client>) => entityClientService.createClient(client),
  update: (id: string, client: Partial<Client>) => entityClientService.updateClient(id, client),
  delete: (id: string) => entityClientService.deleteClient(id),
  fetchContactsById: (clientId: string) => entityClientService.fetchClientContacts(clientId),
  createContact: (contact: Partial<ClientContact>) => entityClientService.createContact(contact),
  updateContact: (id: string, contact: Partial<ClientContact>) => entityClientService.updateContact(id, contact),
  deleteContact: (id: string) => entityClientService.deleteContact(id)
};

export default clientService;
