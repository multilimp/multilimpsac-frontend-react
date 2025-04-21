
import { Client, ClientContact } from "@/features/entities/client/models/client.model";

// This is a simple mock client service for now
class ClientService {
  async getAll(): Promise<Client[]> {
    // Mock implementation
    return [
      {
        id: "1",
        razonSocial: "ACME Corporation",
        ruc: "12345678901",
        codUnidad: "ACME-001",
        direccion: "123 Main St",
        departamento: "Lima",
        provincia: "Lima",
        distrito: "Miraflores",
        estado: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }
  
  async getById(id: string): Promise<Client> {
    // Mock implementation
    return {
      id,
      razonSocial: "ACME Corporation",
      ruc: "12345678901",
      codUnidad: "ACME-001",
      direccion: "123 Main St",
      departamento: "Lima",
      provincia: "Lima",
      distrito: "Miraflores",
      estado: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
  
  async create(client: Partial<Client>): Promise<Client> {
    // Mock implementation
    return {
      ...client,
      id: "new-id",
      estado: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Client;
  }
  
  async update(id: string, client: Partial<Client>): Promise<Client> {
    // Mock implementation
    return {
      ...client,
      id,
      updatedAt: new Date().toISOString()
    } as Client;
  }
  
  async delete(id: string): Promise<void> {
    // Mock implementation
    return;
  }

  // Contact methods
  async fetchContactsById(clientId: string): Promise<ClientContact[]> {
    // Mock implementation
    return [
      {
        id: "1",
        clientId,
        nombre: "John Doe",
        telefono: "123456789",
        correo: "john.doe@example.com",
        cargo: "Manager",
        estado: true
      }
    ];
  }

  async createContact(contact: Partial<ClientContact>): Promise<ClientContact> {
    // Mock implementation
    return {
      ...contact,
      id: "new-contact-id",
      estado: true
    } as ClientContact;
  }

  async updateContact(id: string, contact: Partial<ClientContact>): Promise<ClientContact> {
    // Mock implementation
    return {
      ...contact,
      id
    } as ClientContact;
  }

  async deleteContact(id: string): Promise<void> {
    // Mock implementation
    return;
  }
}

export default new ClientService();
