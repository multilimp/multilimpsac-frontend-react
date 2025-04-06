
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import { DataGrid, DataGridColumn } from "@/components/ui/data-grid";
import { useToast } from "@/components/ui/use-toast";
import BreadcrumbNav from "@/components/layout/BreadcrumbNav";
import { Transport } from "@/features/transport/models/transport.model";
import { fetchTransports } from "@/data/services/transportService";

const TransportPage: React.FC = () => {
  const [transports, setTransports] = useState<Transport[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTransports();
  }, []);

  const loadTransports = async () => {
    setLoading(true);
    try {
      const data = await fetchTransports();
      setTransports(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading transports:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los transportes",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

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
    loadTransports();
  };

  const handleRowClick = (row: Transport) => {
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
          loading={loading}
          pageSize={10}
          onRowClick={handleRowClick}
          onReload={handleReload}
        />
      </div>
    </DashboardLayout>
  );
};

export default TransportPage;
