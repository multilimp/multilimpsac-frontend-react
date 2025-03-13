
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import SearchBar from "@/components/common/SearchBar";
import DataTable, { Column } from "@/components/common/DataTable";
import { useToast } from "@/components/ui/use-toast";

interface Client {
  id: string;
  name: string;
  ruc: string;
  address: string;
  phone: string;
  email: string;
  contact: string;
  status: "active" | "inactive";
}

// Mock data
const mockClients: Client[] = [
  {
    id: "1",
    name: "Cliente Corporativo A",
    ruc: "20987654321",
    address: "Av. Principal 123, Lima",
    phone: "987654321",
    email: "contacto@clientea.com",
    contact: "Juan Pérez",
    status: "active",
  },
  {
    id: "2",
    name: "Cliente Corporativo B",
    ruc: "20567891234",
    address: "Jr. Secundario 456, Lima",
    phone: "987123456",
    email: "info@clienteb.com",
    contact: "María López",
    status: "active",
  },
  {
    id: "3",
    name: "Cliente Corporativo C",
    ruc: "20654321987",
    address: "Calle Nueva 789, Lima",
    phone: "912345678",
    email: "ventas@clientec.com",
    contact: "Pedro Gómez",
    status: "inactive",
  },
];

const ClientPage = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.ruc.includes(searchTerm) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleDeleteClient = (client: Client) => {
    setClients(clients.filter((c) => c.id !== client.id));
    toast({
      title: "Cliente eliminado",
      description: "El cliente ha sido eliminado correctamente",
    });
  };

  const columns: Column<Client>[] = [
    { header: "Cliente", accessorKey: "name" },
    { header: "RUC", accessorKey: "ruc" },
    { header: "Contacto", accessorKey: "contact" },
    { header: "Teléfono", accessorKey: "phone" },
    { header: "Email", accessorKey: "email" },
    {
      header: "Estado",
      accessorKey: "status",
      cell: (client) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            client.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}
        >
          {client.status === "active" ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Clientes"
        subtitle="Gestione los clientes en el sistema"
        showAddButton
        addButtonText="Agregar Cliente"
      />

      <div className="mb-6">
        <SearchBar
          placeholder="Buscar por nombre, RUC o email..."
          onChange={handleSearch}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredClients}
        onDelete={handleDeleteClient}
        onEdit={() => {}}
        onView={() => {}}
      />
    </DashboardLayout>
  );
};

export default ClientPage;
