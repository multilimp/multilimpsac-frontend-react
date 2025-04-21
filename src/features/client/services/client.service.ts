
import { Client, ClientContact } from '@/features/entities/client/models/client.model';
import { ClientService } from '@/features/entities/client/services/client.service';

// Define the client service object
const clientService = {
  getAll: () => ClientService.fetchClients(),
  getById: (id: string) => ClientService.fetchClientById(id),
  create: (client: Partial<Client>) => ClientService.createClient(client),
  update: (id: string, client: Partial<Client>) => ClientService.updateClient(id, client),
  delete: (id: string) => ClientService.deleteClient(id),
  fetchContactsById: (clientId: string) => ClientService.fetchClientContacts(clientId),
  createContact: (contact: Partial<ClientContact>) => ClientService.createContact(contact),
  updateContact: (id: string, contact: Partial<ClientContact>) => ClientService.updateContact(id, contact),
  deleteContact: (id: string) => ClientService.deleteContact(id)
};

export default clientService;
