import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import { DataGrid, DataGridColumn } from "@/components/ui/data-grid";
import { useToast } from "@/hooks/use-toast";
import BreadcrumbNav from "@/components/layout/BreadcrumbNav";
import { useQuery } from "@tanstack/react-query";
import { clientService } from "../services/client.service";
import { Client } from "../models/client.model";
import { Badge } from "@/components/ui/badge";

const ClientPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: clients = [], isLoading, refetch } = useQuery({
    queryKey: ["clients"],
    queryFn: clientService.fetchClients,
  });

  const breadcrumbItems = [
    {
      label: "Clientes",
      path: "/clientes",
      isCurrentPage: true
    }
  ];

  const columns: DataGridColumn[] = [
    { key: 'ruc', name: 'RUC', type: 'string', sortable: true, filterable: true },
    { key: 'razonSocial', name: 'Razón Social', type: 'string', sortable: true, filterable: true },
    { key: 'codUnidad', name: 'Código Unidad', type: 'string', sortable: true, filterable: true },
    { key: 'distrito', name: 'Distrito', type: 'string', sortable: true, filterable: true },
    { key: 'provincia', name: 'Provincia', type: 'string', sortable: true, filterable: true },
    { key: 'departamento', name: 'Departamento', type: 'string', sortable: true, filterable: true },
    { key: 'direccion', name: 'Dirección', type: 'string', sortable: true, filterable: true },
    { 
      key: 'estado', 
      name: 'Estado', 
      type: 'string', 
      sortable: true, 
      filterable: true,
      render: (row: Client) => (
        <Badge variant={row.estado ? "default" : "secondary"}>
          {row.estado ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
  ];

  const handleReload = () => {
    refetch();
    toast({
      title: "Datos actualizados",
      description: "La lista de clientes ha sido actualizada"
    });
  };

  const handleRowClick = (row: Client) => {
    navigate(`/clientes/${row.id}`);
  };

  const handleAddClient = () => {
    navigate('/clientes/new');
  };

  return (
    <div>
      <BreadcrumbNav items={breadcrumbItems} />
      <PageHeader
        title="Clientes"
        subtitle="Gestione los clientes en el sistema"
        showAddButton
        addButtonText="Agregar Cliente"
        onAddClick={handleAddClient}
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
        
        <div className="mt-4 text-sm text-gray-500">
          Total: {clients.length} clientes
        </div>
      </div>
    </div>
  );
};

export default ClientPage;

