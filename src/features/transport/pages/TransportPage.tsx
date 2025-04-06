
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import { DataGrid, DataGridColumn } from "@/components/ui/data-grid";
import { useToast } from "@/hooks/use-toast";
import BreadcrumbNav from "@/components/layout/BreadcrumbNav";
import { useTransports } from "@/features/transport/services/transport.service";

const TransportPage: React.FC = () => {
  const { data: transports = [], isLoading, refetch } = useTransports();
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
    { key: 'name', name: 'Empresa', type: 'string', sortable: true, filterable: true },
    { key: 'ruc', name: 'RUC', type: 'string', sortable: true, filterable: true },
    { key: 'address', name: 'Dirección', type: 'string', sortable: true, filterable: true },
    { key: 'coverage', name: 'Cobertura', type: 'string', sortable: true, filterable: true },
    { key: 'status', name: 'Estado', type: 'string', sortable: true, filterable: true },
  ];

  const handleReload = () => {
    refetch();
    toast({
      title: "Datos actualizados",
      description: "La lista de transportes ha sido actualizada"
    });
  };

  const handleRowClick = (row: any) => {
    console.log('Transporte seleccionado:', row);
    toast({
      title: "Transporte seleccionado",
      description: `${row.name}`,
    });
  };

  return (
    <DashboardLayout>
      <BreadcrumbNav items={breadcrumbItems} />
      <PageHeader
        title="Transportes"
        subtitle="Gestione las empresas de transporte en el sistema"
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
      </div>
    </DashboardLayout>
  );
};

export default TransportPage;
