import React, { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { DataGrid, DataGridColumn } from "@/components/ui/data-grid";
import { useToast } from "@/hooks/use-toast";
import BreadcrumbNav from "@/components/layout/BreadcrumbNav";
import { useQuery } from "@tanstack/react-query";
import ClientService from "../services/client.service";
import { ClienteDB } from "../models/client.model";

const ClientPage: React.FC = () => {
  const { toast } = useToast();
  const { data: clients = [], isLoading, refetch } = useQuery({
    queryKey: ["clients"],
    queryFn: ClientService.getAll,
  });

  const breadcrumbItems = [
    {
      label: "Clientes",
      path: "/clientes",
      isCurrentPage: true
    }
  ];

  const columns: DataGridColumn[] = [
    { key: 'id', name: 'ID', type: 'string', sortable: true, filterable: true },
    { key: 'razon_social', name: 'Razón Social', type: 'string', sortable: true, filterable: true },
    { key: 'cod_unidad', name: 'Código Unidad', type: 'string', sortable: true, filterable: true },
    { key: 'ruc', name: 'RUC', type: 'string', sortable: true, filterable: true },
    { key: 'distrito', name: 'Distrito', type: 'string', sortable: true, filterable: true },
    { key: 'provincia', name: 'Provincia', type: 'string', sortable: true, filterable: true },
    { key: 'departamento', name: 'Departamento', type: 'string', sortable: true, filterable: true },
    { key: 'direccion', name: 'Dirección', type: 'string', sortable: true, filterable: true },
    { key: 'status', name: 'Estado', type: 'string', sortable: true, filterable: true },
  ];

  const handleReload = () => {
    refetch();
    toast({
      title: "Datos actualizados",
      description: "La lista de clientes ha sido actualizada"
    });
  };

  const handleRowClick = (row: ClienteDB) => {
    console.log('Cliente seleccionado:', row);
    toast({
      title: "Cliente seleccionado",
      description: `${row.razon_social} ha sido seleccionado`,
    });
  };

  return (
    <div>
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
          loading={isLoading}
          pageSize={10}
          onRowClick={handleRowClick}
          onReload={handleReload}
        />
      </div>
    </div>
  );
};

export default ClientPage;
