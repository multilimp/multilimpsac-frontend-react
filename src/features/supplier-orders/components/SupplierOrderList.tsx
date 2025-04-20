
import React from 'react';
import { useSupplierOrders } from '@/domain/supplier-orders';
import { DataGrid, DataGridColumn } from '@/components/ui/data-grid';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Money } from '@/core/domain/types/value-objects';

// Since SupplierOrderId is not directly compatible with string | number, 
// we'll add a mapper to convert it when presenting to the DataGrid
const mapSupplierOrderForDataGrid = (order: any) => ({
  ...order,
  id: order.id.value, // Extract the string value from the SupplierOrderId object
});

const columns: DataGridColumn[] = [
  {
    key: 'number',
    name: 'Número',
    type: 'string',
    sortable: true,
    filterable: true,
  },
  {
    key: 'supplierName',
    name: 'Proveedor',
    type: 'string',
    sortable: true,
    filterable: true,
  },
  {
    key: 'date',
    name: 'Fecha',
    type: 'date',
    sortable: true,
    filterable: true,
    getValue: (row) => formatDate(row.date.value)
  },
  {
    key: 'total.amount',
    name: 'Total',
    type: 'number',
    sortable: true,
    filterable: true,
    getValue: (row) => {
      const total = row.total as Money;
      return total.amount.toLocaleString('es-PE', {
        style: 'currency',
        currency: total.currency
      });
    }
  },
  {
    key: 'status',
    name: 'Estado',
    type: 'string',
    sortable: true,
    filterable: true,
    render: (row) => (
      <Badge variant={row.status.value === 'completed' ? 'success' : 'default'}>
        {row.status.value}
      </Badge>
    )
  }
];

export const SupplierOrderList: React.FC = () => {
  const { data: supplierOrders, isLoading } = useSupplierOrders();

  // Map the data to be compatible with DataGrid expecting id as string | number
  const mappedData = React.useMemo(() => {
    if (!supplierOrders?.data) return [];
    return supplierOrders.data.map(mapSupplierOrderForDataGrid);
  }, [supplierOrders?.data]);

  return (
    <DataGrid
      columns={columns}
      data={mappedData}
      loading={isLoading}
      pageSize={10}
    />
  );
};
