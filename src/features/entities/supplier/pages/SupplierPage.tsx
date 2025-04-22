
import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import { DataGrid, DataGridColumn } from "@/components/ui/data-grid";
import { useToast } from "@/hooks/use-toast";
import BreadcrumbNav from "@/components/layout/BreadcrumbNav";
import { useSuppliers } from "@/features/entities/supplier/services/supplier.service";
import { Supplier } from "@/features/entities/supplier/models/supplier.model";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const SupplierPage: React.FC = () => {
  const { data: suppliers = [], isLoading, isError, refetch } = useSuppliers();
  const { toast } = useToast();
  const navigate = useNavigate();

  const breadcrumbItems = [
    {
      label: "Proveedores",
      path: "/proveedores",
      isCurrentPage: true,
    },
  ];

  const columns: DataGridColumn[] = [
    { key: "id", name: "ID", type: "string", sortable: true, filterable: true },
    {
      key: "name",
      name: "Razón Social",
      type: "string",
      sortable: true,
      filterable: true,
    },
    {
      key: "ruc",
      name: "RUC",
      type: "string",
      sortable: true,
      filterable: true,
    },
    {
      key: "address",
      name: "Dirección",
      type: "string",
      sortable: true,
      filterable: true,
    },
    {
      key: "department",
      name: "Departamento",
      type: "string",
      sortable: true,
      filterable: true,
    },
    {
      key: "province",
      name: "Provincia",
      type: "string",
      sortable: true,
      filterable: true,
    },
    {
      key: "district",
      name: "Distrito",
      type: "string",
      sortable: true,
      filterable: true,
    },
    {
      key: "amount",
      name: "Monto",
      type: "string",
      sortable: true,
      filterable: true,
    },
    {
      key: "status",
      name: "Estado",
      type: "string",
      sortable: true,
      filterable: true,
      render: (row: Supplier) => (
        <Badge variant={row.status === "active" ? "default" : "secondary"}>
          {row.status === "active" ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
  ];

  const handleReload = () => {
    refetch();
    toast({
      title: "Datos actualizados",
      description: "La lista de proveedores ha sido actualizada",
    });
  };

  const handleRowClick = (row: Supplier) => {
    navigate(`/proveedores/${row.id}`);
  };

  const handleAddSupplier = () => {
    navigate("/proveedores/new");
  };

  return (
    <div>
      <BreadcrumbNav items={breadcrumbItems} />
      <PageHeader
        title="Proveedores"
        subtitle="Gestione los proveedores en el sistema"
        showAddButton
        addButtonText="Agregar Proveedor"
        onAddClick={handleAddSupplier}
      />
      
      <div className="mb-6">
        <DataGrid 
          data={suppliers}
          columns={columns}
          loading={isLoading}
          pageSize={10}
          onRowClick={handleRowClick}
          onReload={handleReload}
        />
        
        <div className="mt-4 text-sm text-gray-500">
          Total: {suppliers.length} proveedores
        </div>
      </div>
    </div>
  );
};

export default SupplierPage;
