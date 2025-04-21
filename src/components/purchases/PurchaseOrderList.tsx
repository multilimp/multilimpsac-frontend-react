
import React, { useState } from "react";
import DataTable, { Column } from "@/components/common/DataTable";
import SearchBar from "@/components/common/SearchBar";
import { Card, CardContent } from "@/components/ui/card";
import { PurchaseOrder } from "@/data/models/purchaseOrder";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/app/core/utils";

const mockData: PurchaseOrder[] = [
  {
    id: "po-001",
    orderNumber: "OC-20230001",
    clientId: "client-001",
    clientName: "Empresa ABC",
    date: "2023-08-15",
    total: 5000,
    status: "pending",
    type: "public",
    documents: {
      oce: "OC-EXT-001"
    },
    items: [],
    createdAt: "2023-08-15T10:00:00Z",
    updatedAt: "2023-08-15T10:00:00Z"
  },
  {
    id: "po-002",
    orderNumber: "OC-20230002",
    clientId: "client-002",
    clientName: "Empresa XYZ",
    date: "2023-08-20",
    total: 8500,
    status: "completed",
    type: "private",
    documents: {
      oce: "OC-EXT-002",
      ocf: "OC-FIS-001"
    },
    items: [],
    createdAt: "2023-08-20T11:30:00Z",
    updatedAt: "2023-08-20T11:30:00Z"
  }
];

const PurchaseOrderList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredData = mockData.filter((order) => 
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusBadge = (status: PurchaseOrder["status"]) => {
    const variants: Record<PurchaseOrder["status"], { className: string; label: string }> = {
      pending: { className: "bg-yellow-500", label: "Pendiente" },
      partial: { className: "bg-blue-500", label: "Parcial" },
      completed: { className: "bg-green-500", label: "Completada" },
      cancelled: { className: "bg-red-500", label: "Cancelada" }
    };
    
    return (
      <Badge className={variants[status].className}>
        {variants[status].label}
      </Badge>
    );
  };
  
  const typeBadge = (type: PurchaseOrder["type"]) => {
    const variants: Record<PurchaseOrder["type"], { className: string; label: string }> = {
      public: { className: "bg-purple-500", label: "Pública" },
      private: { className: "bg-gray-500", label: "Privada" }
    };
    
    return (
      <Badge className={variants[type].className}>
        {variants[type].label}
      </Badge>
    );
  };

  const columns: Column<PurchaseOrder>[] = [
    {
      header: "Número",
      accessorKey: "orderNumber"
    },
    {
      header: "Cliente",
      accessorKey: "clientName"
    },
    {
      header: "Fecha",
      accessorKey: "date",
      cell: (order) => formatDate(order.date)
    },
    {
      header: "Total",
      accessorKey: "total",
      cell: (order) => `$${order.total.toLocaleString()}`
    },
    {
      header: "Tipo",
      accessorKey: "type",
      cell: (order) => typeBadge(order.type)
    },
    {
      header: "Estado",
      accessorKey: "status",
      cell: (order) => statusBadge(order.status)
    }
  ];

  const handleView = (order: PurchaseOrder) => {
    console.log("Ver detalles de:", order);
  };

  const handleEdit = (order: PurchaseOrder) => {
    console.log("Editar:", order);
  };

  const handleDelete = (order: PurchaseOrder) => {
    console.log("Eliminar:", order);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6">
          <SearchBar 
            placeholder="Buscar por número o cliente..." 
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

export default PurchaseOrderList;
