
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import { DataGrid, DataGridColumn } from "@/components/ui/data-grid";
import { useToast } from "@/components/ui/use-toast";
import BreadcrumbNav from "@/components/layout/BreadcrumbNav";

interface Supplier {
  id: string;
  name: string;
  ruc: string;
  address: string;
  phone: string;
  email: string;
  contact: string;
  category: string;
  status: "active" | "inactive";
}

// Mock data
const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "Proveedor 1 S.A.C.",
    ruc: "20123456789",
    address: "Av. Principal 123, Lima",
    phone: "987654321",
    email: "contacto@proveedor1.com",
    contact: "Juan Pérez",
    category: "Productos de Limpieza",
    status: "active",
  },
  {
    id: "2",
    name: "Proveedor 2 E.I.R.L.",
    ruc: "20567891234",
    address: "Jr. Secundario 456, Lima",
    phone: "987123456",
    email: "info@proveedor2.com",
    contact: "María López",
    category: "Equipos Industriales",
    status: "active",
  },
  {
    id: "3",
    name: "Proveedor 3 S.A.",
    ruc: "20654321987",
    address: "Calle Nueva 789, Lima",
    phone: "912345678",
    email: "ventas@proveedor3.com",
    contact: "Pedro Gómez",
    category: "Productos Químicos",
    status: "inactive",
  },
];

const SupplierPage = () => {
  const [suppliers] = useState<Supplier[]>(mockSuppliers);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const breadcrumbItems = [
    {
      label: "Proveedores",
      path: "/proveedores",
      isCurrentPage: true
    }
  ];

  const columns: DataGridColumn[] = [
    { key: 'id', name: 'ID', type: 'string', sortable: true, filterable: true },
    { key: 'name', name: 'Proveedor', type: 'string', sortable: true, filterable: true },
    { key: 'ruc', name: 'RUC', type: 'string', sortable: true, filterable: true },
    { key: 'category', name: 'Categoría', type: 'string', sortable: true, filterable: true },
    { key: 'contact', name: 'Contacto', type: 'string', sortable: true, filterable: true },
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
        description: "La lista de proveedores ha sido actualizada",
      });
    }, 1000);
  };

  const handleRowClick = (row: Supplier) => {
    console.log('Proveedor seleccionado:', row);
    toast({
      title: "Proveedor seleccionado",
      description: `${row.name}`,
    });
  };

  return (
    <DashboardLayout>
      <BreadcrumbNav items={breadcrumbItems} />
      <PageHeader
        title="Proveedores"
        subtitle="Gestione los proveedores en el sistema"
        showAddButton
        addButtonText="Agregar Proveedor"
      />
      
      <div className="mb-6">
        <DataGrid 
          data={suppliers}
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

export default SupplierPage;
