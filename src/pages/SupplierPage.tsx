
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import SearchBar from "@/components/common/SearchBar";
import DataTable, { Column } from "@/components/common/DataTable";
import { useToast } from "@/components/ui/use-toast";

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
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.ruc.includes(searchTerm) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleDeleteSupplier = (supplier: Supplier) => {
    setSuppliers(suppliers.filter((s) => s.id !== supplier.id));
    toast({
      title: "Proveedor eliminado",
      description: "El proveedor ha sido eliminado correctamente",
    });
  };

  const columns: Column<Supplier>[] = [
    { header: "Proveedor", accessorKey: "name" },
    { header: "RUC", accessorKey: "ruc" },
    { header: "Categoría", accessorKey: "category" },
    { header: "Contacto", accessorKey: "contact" },
    { header: "Email", accessorKey: "email" },
    {
      header: "Estado",
      accessorKey: "status",
      cell: (supplier) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            supplier.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}
        >
          {supplier.status === "active" ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Proveedores"
        subtitle="Gestione los proveedores en el sistema"
        showAddButton
        addButtonText="Agregar Proveedor"
      />

      <div className="mb-6">
        <SearchBar
          placeholder="Buscar por nombre, RUC, email o categoría..."
          onChange={handleSearch}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredSuppliers}
        onDelete={handleDeleteSupplier}
        onEdit={() => {}}
        onView={() => {}}
      />
    </DashboardLayout>
  );
};

export default SupplierPage;
