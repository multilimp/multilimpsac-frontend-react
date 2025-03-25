
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import { DataGrid, DataGridColumn } from "@/components/ui/data-grid";
import { useToast } from "@/components/ui/use-toast";
import BreadcrumbNav from "@/components/layout/BreadcrumbNav";

interface Transport {
  id: string;
  company: string;
  ruc: string;
  address: string;
  phone: string;
  email: string;
  contact: string;
  vehicleType: string;
  vehiclePlate: string;
  status: "active" | "inactive";
}

// Mock data
const mockTransports: Transport[] = [
  {
    id: "1",
    company: "Transportes Rápidos S.A.C.",
    ruc: "20123456789",
    address: "Av. Principal 123, Lima",
    phone: "987654321",
    email: "contacto@transportesrapidos.com",
    contact: "Juan Pérez",
    vehicleType: "Camión",
    vehiclePlate: "ABC-123",
    status: "active",
  },
  {
    id: "2",
    company: "Logística Integral E.I.R.L.",
    ruc: "20567891234",
    address: "Jr. Secundario 456, Lima",
    phone: "987123456",
    email: "info@logisticaintegral.com",
    contact: "María López",
    vehicleType: "Furgón",
    vehiclePlate: "DEF-456",
    status: "active",
  },
  {
    id: "3",
    company: "Envíos Express S.A.",
    ruc: "20654321987",
    address: "Calle Nueva 789, Lima",
    phone: "912345678",
    email: "ventas@enviosexpress.com",
    contact: "Pedro Gómez",
    vehicleType: "Van",
    vehiclePlate: "GHI-789",
    status: "inactive",
  },
];

const TransportPage = () => {
  const [transports] = useState<Transport[]>(mockTransports);
  const [loading, setLoading] = useState(false);
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
    { key: 'company', name: 'Empresa', type: 'string', sortable: true, filterable: true },
    { key: 'ruc', name: 'RUC', type: 'string', sortable: true, filterable: true },
    { key: 'vehicleType', name: 'Tipo Vehículo', type: 'string', sortable: true, filterable: true },
    { key: 'vehiclePlate', name: 'Placa', type: 'string', sortable: true, filterable: true },
    { key: 'contact', name: 'Contacto', type: 'string', sortable: true, filterable: true },
    { key: 'status', name: 'Estado', type: 'string', sortable: true, filterable: true },
  ];

  const handleReload = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Datos actualizados",
        description: "La lista de transportes ha sido actualizada",
      });
    }, 1000);
  };

  const handleRowClick = (row: Transport) => {
    console.log('Transporte seleccionado:', row);
    toast({
      title: "Transporte seleccionado",
      description: `${row.company}`,
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
