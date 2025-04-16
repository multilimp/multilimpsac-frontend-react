
import React, { useState } from "react";
import { useTransports } from "../services/transport.service";
import { Transport, TransportDB } from "../models/transport.model";
import { LoadingFallback } from "@/components/common/LoadingFallback";
import PageHeader from "@/components/common/PageHeader";
import { DataGrid, DataGridColumn } from "@/components/ui/data-grid";
import BreadcrumbNav from "@/components/layout/BreadcrumbNav";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const TransportPage: React.FC = () => {
  const { data: transports = [], isLoading, error, refetch } = useTransports();
  const { toast } = useToast();

  const breadcrumbItems = [
    {
      label: "Transportes",
      path: "/transportes",
      isCurrentPage: true
    }
  ];

  const columns: DataGridColumn[] = [
    { key: 'id', name: 'ID', type: 'string', sortable: true, filterable: true },
    { key: 'name', name: 'Razón Social', type: 'string', sortable: true, filterable: true },
    { key: 'ruc', name: 'RUC', type: 'string', sortable: true, filterable: true },
    { key: 'address', name: 'Dirección', type: 'string', sortable: true, filterable: true },
    { key: 'coverage', name: 'Cobertura', type: 'string', sortable: true, filterable: true },
    { key: 'department', name: 'Departamento', type: 'string', sortable: true, filterable: true },
    { key: 'province', name: 'Provincia', type: 'string', sortable: true, filterable: true },
    { key: 'district', name: 'Distrito', type: 'string', sortable: true, filterable: true },
    { 
      key: 'status', 
      name: 'Estado',  
      type: 'string',
      sortable: true, 
      filterable: true
    },
  ];

  const handleReload = () => {
    refetch();
    toast({
      title: "Datos actualizados",
      description: "La lista de transportes ha sido actualizada"
    });
  };

  const handleRowClick = (row: Transport) => {
    console.log('Transporte seleccionado:', row);
    toast({
      title: "Transporte seleccionado",
      description: row.name,
    });
  };

  if (isLoading) return <LoadingFallback />;
  
  if (error) return (
    <div className="p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {(error as Error).message}</p>
      </div>
    </div>
  );

  return (
    <div>
      <BreadcrumbNav items={breadcrumbItems} />
      <PageHeader
        title="Transportes"
        subtitle="Gestione los servicios de transporte en el sistema"
        showAddButton
        addButtonText="Agregar Transporte"
      />
      
      <div className="mb-6">
        <DataGrid 
          data={transports}
          columns={columns}
          loading={isLoading}
          pageSize={10}
          onRowClick={handleRowClick}
          onReload={handleReload}
        />
        
        <div className="mt-4 text-sm text-gray-500">
          Total: {transports.length} transportes
        </div>
      </div>
    </div>
  );
};

export default TransportPage;
