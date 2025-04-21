
import React, { useState } from "react";
import DataTable, { Column } from "@/components/common/DataTable";
import SearchBar from "@/components/common/SearchBar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/app/core/utils";
import { SupplierOrder } from "@/data/models/purchaseOrder";

// This is a simplified structure just for the transport assignments
interface TransportAssignment {
  id: string;
  orderNumber: string;
  supplierOrderId: string;
  supplierName: string;
  transportId: string;
  transportName: string;
  assignmentDate: string;
  deliveryDate: string;
  status: "pending" | "in_transit" | "delivered" | "cancelled";
  details: string;
  cost: number;
  paymentStatus: "pending" | "partial" | "completed";
}

const mockData: TransportAssignment[] = [
  {
    id: "trans-001",
    orderNumber: "TR-20230001",
    supplierOrderId: "op-001",
    supplierName: "Proveedor A",
    transportId: "transport-001",
    transportName: "Transporte X",
    assignmentDate: "2023-08-18",
    deliveryDate: "2023-08-25",
    status: "pending",
    details: "Productos para entregar en la bodega central",
    cost: 500,
    paymentStatus: "pending"
  },
  {
    id: "trans-002",
    orderNumber: "TR-20230002",
    supplierOrderId: "op-002",
    supplierName: "Proveedor B",
    transportId: "transport-002",
    transportName: "Transporte Y",
    assignmentDate: "2023-08-19",
    deliveryDate: "2023-08-27",
    status: "in_transit",
    details: "Entregar en sucursal norte",
    cost: 600,
    paymentStatus: "pending"
  }
];

const TransportAssignmentList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredData = mockData.filter((assignment) => 
    assignment.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    assignment.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.transportName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusBadge = (status: TransportAssignment["status"]) => {
    const variants: Record<TransportAssignment["status"], { className: string; label: string }> = {
      pending: { className: "bg-yellow-500", label: "Pendiente" },
      in_transit: { className: "bg-blue-500", label: "En Tránsito" },
      delivered: { className: "bg-green-500", label: "Entregado" },
      cancelled: { className: "bg-red-500", label: "Cancelado" }
    };
    
    return (
      <Badge className={variants[status].className}>
        {variants[status].label}
      </Badge>
    );
  };
  
  const paymentStatusBadge = (status: TransportAssignment["paymentStatus"]) => {
    const variants: Record<TransportAssignment["paymentStatus"], { className: string; label: string }> = {
      pending: { className: "bg-yellow-500", label: "Pendiente" },
      partial: { className: "bg-blue-500", label: "Parcial" },
      completed: { className: "bg-green-500", label: "Completado" }
    };
    
    return (
      <Badge className={variants[status].className}>
        {variants[status].label}
      </Badge>
    );
  };

  const columns: Column<TransportAssignment>[] = [
    {
      header: "Número",
      accessorKey: "orderNumber"
    },
    {
      header: "Proveedor",
      accessorKey: "supplierName"
    },
    {
      header: "Transporte",
      accessorKey: "transportName"
    },
    {
      header: "Asignación",
      accessorKey: "assignmentDate",
      cell: (assignment) => formatDate(assignment.assignmentDate)
    },
    {
      header: "Entrega",
      accessorKey: "deliveryDate",
      cell: (assignment) => formatDate(assignment.deliveryDate)
    },
    {
      header: "Costo",
      accessorKey: "cost",
      cell: (assignment) => `$${assignment.cost.toLocaleString()}`
    },
    {
      header: "Estado",
      accessorKey: "status",
      cell: (assignment) => statusBadge(assignment.status)
    },
    {
      header: "Pago",
      accessorKey: "paymentStatus",
      cell: (assignment) => paymentStatusBadge(assignment.paymentStatus)
    }
  ];

  const handleView = (assignment: TransportAssignment) => {
    console.log("Ver detalles de:", assignment);
  };

  const handleEdit = (assignment: TransportAssignment) => {
    console.log("Editar:", assignment);
  };

  const handleDelete = (assignment: TransportAssignment) => {
    console.log("Eliminar:", assignment);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6">
          <SearchBar 
            placeholder="Buscar por número, proveedor o transporte..." 
            onChange={setSearchTerm}
            className="max-w-md"
          />
        </div>
        
        <DataTable 
          columns={columns}
          data={filteredData}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </CardContent>
    </Card>
  );
};

export default TransportAssignmentList;
