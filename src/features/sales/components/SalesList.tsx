
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DataTable from '@/components/common/DataTable';

interface Sale {
  id: string;
  number: string;
  client: string;
  date: string;
  status: string;
  total: number;
}

interface SalesListProps {
  sales: Sale[];
  isLoading: boolean;
  onRefresh: () => void;
}

const SalesList: React.FC<SalesListProps> = ({ sales, isLoading, onRefresh }) => {
  const columns = [
    {
      header: "Número",
      accessorKey: "number" as keyof Sale,
    },
    {
      header: "Cliente",
      accessorKey: "client" as keyof Sale,
    },
    {
      header: "Fecha",
      accessorKey: "date" as keyof Sale,
    },
    {
      header: "Estado",
      accessorKey: "status" as keyof Sale,
      cell: (sale: Sale) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          sale.status === 'Completado' ? 'bg-green-100 text-green-800' : 
          sale.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-gray-100 text-gray-800'
        }`}>
          {sale.status}
        </span>
      ),
    },
    {
      header: "Total",
      accessorKey: "total" as keyof Sale,
      cell: (sale: Sale) => `S/ ${sale.total.toFixed(2)}`,
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <DataTable 
          columns={columns} 
          data={sales}
          loading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default SalesList;
