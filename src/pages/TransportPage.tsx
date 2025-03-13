
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import SearchBar from "@/components/common/SearchBar";
import DataTable, { Column } from "@/components/common/DataTable";
import { useToast } from "@/components/ui/use-toast";

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
  const [transports, setTransports] = useState<Transport[]>(mockTransports);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredTransports = transports.filter((transport) =>
    transport.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transport.ruc.includes(searchTerm) ||
    transport.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transport.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleDeleteTransport = (transport: Transport) => {
    setTransports(transports.filter((t) => t.id !== transport.id));
    toast({
      title: "Transporte eliminado",
      description: "El transporte ha sido eliminado correctamente",
    });
  };

  const columns: Column<Transport>[] = [
    { header: "Empresa", accessorKey: "company" },
    { header: "RUC", accessorKey: "ruc" },
    { header: "Tipo de Vehículo", accessorKey: "vehicleType" },
    { header: "Placa", accessorKey: "vehiclePlate" },
    { header: "Contacto", accessorKey: "contact" },
    {
      header: "Estado",
      accessorKey: "status",
      cell: (transport) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            transport.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}
        >
          {transport.status === "active" ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Transportes"
        subtitle="Gestione las empresas de transporte en el sistema"
        showAddButton
        addButtonText="Agregar Transporte"
      />

      <div className="mb-6">
        <SearchBar
          placeholder="Buscar por empresa, RUC o placa..."
          onChange={handleSearch}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredTransports}
        onDelete={handleDeleteTransport}
        onEdit={() => {}}
        onView={() => {}}
      />
    </DashboardLayout>
  );
};

export default TransportPage;
