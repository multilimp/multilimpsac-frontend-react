
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import SearchBar from "@/components/common/SearchBar";
import { DataGrid, DataGridColumn } from "@/components/ui/data-grid";
import { useToast } from "@/components/ui/use-toast";
import BreadcrumbNav from "@/components/layout/BreadcrumbNav";

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
  const [clients] = useState<Client[]>(mockClients);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const breadcrumbItems = [
    {
      label: "Clientes",
      path: "/clientes",
      isCurrentPage: true
    }
  ];

  const columns: DataGridColumn[] = [
    { key: 'id', name: 'ID', type: 'string', sortable: true, filterable: true },
    { key: 'name', name: 'Nombre', type: 'string', sortable: true, filterable: true },
    { key: 'ruc', name: 'RUC', type: 'string', sortable: true, filterable: true },
    { key: 'contact', name: 'Contacto', type: 'string', sortable: true, filterable: true },
    { key: 'phone', name: 'Teléfono', type: 'string', sortable: true, filterable: true },
    { key: 'email', name: 'Email', type: 'string', sortable: true, filterable: true },
    { key: 'status', name: 'Estado', type: 'string', sortable: true, filterable: true },
  ];

  const handleReload = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Datos actualizados",
        description: "La lista de clientes ha sido actualizada",
      });
    }, 1000);
  };

  const handleRowClick = (row: Client) => {
    console.log('Cliente seleccionado:', row);
    toast({
      title: "Cliente seleccionado",
      description: `${row.name}`,
    });
  };

  return (
    <DashboardLayout>
      <BreadcrumbNav items={breadcrumbItems} />
      <PageHeader
        title="Clientes"
        subtitle="Gestione los clientes en el sistema"
        showAddButton
        addButtonText="Agregar Cliente"
      />

      <div className="mb-6">
        <DataGrid 
          data={clients}
          columns={columns}
          loading={loading}
          pageSize={10}
          onRowClick={handleRowClick}
          onReload={handleReload}
        />
      </div>
    </DashboardLayout>
  );
};

export default ClientPage;
