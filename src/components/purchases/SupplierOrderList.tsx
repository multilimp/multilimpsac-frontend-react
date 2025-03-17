
import React, { useState } from "react";
import DataTable, { Column } from "@/components/common/DataTable";
import SearchBar from "@/components/common/SearchBar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { SupplierOrder } from "@/data/models/purchaseOrder";

const mockData: SupplierOrder[] = [
  {
    id: "op-001",
    orderNumber: "OP-20230001",
    purchaseOrderId: "po-001",
    supplierId: "supplier-001",
    supplierName: "Proveedor A",
    transportId: "transport-001",
    transportName: "Transporte X",
    date: "2023-08-16",
    deliveryDate: "2023-08-25",
    status: "pending",
    paymentStatus: "pending",
    items: [],
    total: 3000,
    payments: [],
    createdAt: "2023-08-16T10:00:00Z",
    updatedAt: "2023-08-16T10:00:00Z"
  },
  {
    id: "op-002",
    orderNumber: "OP-20230002",
    purchaseOrderId: "po-001",
    supplierId: "supplier-002",
    supplierName: "Proveedor B",
    date: "2023-08-17",
    deliveryDate: "2023-08-27",
    status: "partial",
    paymentStatus: "partial",
    items: [],
    total: 2000,
    payments: [{
      id: "payment-001",
      date: "2023-08-20",
      amount: 1000,
      method: "transfer",
      reference: "TR-001",
      createdAt: "2023-08-20T14:30:00Z"
    }],
    createdAt: "2023-08-17T11:30:00Z",
    updatedAt: "2023-08-20T14:30:00Z"
  }
];

const SupplierOrderList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredData = mockData.filter((order) => 
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusBadge = (status: SupplierOrder["status"]) => {
    const variants: Record<SupplierOrder["status"], { className: string; label: string }> = {
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
  
  const paymentStatusBadge = (status: SupplierOrder["paymentStatus"]) => {
    const variants: Record<SupplierOrder["paymentStatus"], { className: string; label: string }> = {
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

  const columns: Column<SupplierOrder>[] = [
    {
      header: "Número",
      accessorKey: "orderNumber"
    },
    {
      header: "Proveedor",
      accessorKey: "supplierName"
    },
    {
      header: "Fecha",
      accessorKey: "date",
      cell: (order) => formatDate(order.date)
    },
    {
      header: "Entrega",
      accessorKey: "deliveryDate",
      cell: (order) => formatDate(order.deliveryDate)
    },
    {
      header: "Total",
      accessorKey: "total",
      cell: (order) => `$${order.total.toLocaleString()}`
    },
    {
      header: "Estado",
      accessorKey: "status",
      cell: (order) => statusBadge(order.status)
    },
    {
      header: "Pago",
      accessorKey: "paymentStatus",
      cell: (order) => paymentStatusBadge(order.paymentStatus)
    }
  ];

  const handleView = (order: SupplierOrder) => {
    console.log("Ver detalles de:", order);
  };

  const handleEdit = (order: SupplierOrder) => {
    console.log("Editar:", order);
  };

  const handleDelete = (order: SupplierOrder) => {
    console.log("Eliminar:", order);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6">
          <SearchBar 
            placeholder="Buscar por número o proveedor..." 
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

export default SupplierOrderList;
