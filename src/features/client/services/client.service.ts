
import { Client, ClientContact } from "@/features/entities/client/models/client.model";

// This is a simple mock client service for now
class ClientService {
  async getAll(): Promise<Client[]> {
    // Mock implementation
    return [
      {
        id: "1",
        name: "ACME Corporation",
        ruc: "12345678901",
        address: "123 Main St",
        phone: "123-456-7890",
        email: "contact@acme.com",
        contactName: "John Doe",
        contactPhone: "123-456-7890",
        contactEmail: "john@acme.com",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }
  
  async getById(id: string): Promise<Client> {
    // Mock implementation
    return {
      id,
      name: "ACME Corporation",
      ruc: "12345678901",
      address: "123 Main St",
      phone: "123-456-7890",
      email: "contact@acme.com",
      contactName: "John Doe",
      contactPhone: "123-456-7890",
      contactEmail: "john@acme.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
  
  async create(client: Partial<Client>): Promise<Client> {
    // Mock implementation
    return {
      ...client,
      id: "new-id",
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
}

export default new ClientService();
