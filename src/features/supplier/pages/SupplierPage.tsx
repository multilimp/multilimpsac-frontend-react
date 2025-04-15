
import React, { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { DataGrid, DataGridColumn } from "@/components/ui/data-grid";
import { useToast } from "@/hooks/use-toast";
import BreadcrumbNav from "@/components/layout/BreadcrumbNav";
import { useSuppliers } from "@/features/supplier/services/supplier.service";
import { Supplier } from "@/features/supplier/models/supplier.model";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const SupplierPage: React.FC = () => {
  const { data: suppliers = [], isLoading, isError, refetch } = useSuppliers();
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
    { key: 'address', name: 'Dirección', type: 'string', sortable: true, filterable: true },
    { key: 'contact', name: 'Contacto', type: 'string', sortable: true, filterable: true },
    { key: 'email', name: 'Email', type: 'string', sortable: true, filterable: true },
    { key: 'status', name: 'Estado', type: 'string', sortable: true, filterable: true },
  ];

  const handleReload = () => {
    refetch();
    toast({
      title: "Datos actualizados",
      description: "La lista de proveedores ha sido actualizada"
    });
  };

  const handleRowClick = (row: any) => {
    console.log('Proveedor seleccionado:', row);
    toast({
      title: "Proveedor seleccionado",
      description: `${row.name}`,
    });
  };

  if (isError) {
    return (
      <DashboardLayout>
        <div className="text-center py-10">
          <div className="text-red-500 text-xl mb-4">Error al cargar proveedores</div>
          <button 
            onClick={() => refetch()} 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Reintentar
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <BreadcrumbNav items={breadcrumbItems} />
      <PageHeader
        title="Proveedores"
        subtitle="Gestione los proveedores en el sistema"
        showAddButton
        addButtonText="Agregar Proveedor"
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
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
      )}
    </DashboardLayout>
  );
};

export default SupplierPage;
