
import React from 'react';
import { useSupplierOrders } from '@/domain/supplier-orders';
import { DataGrid, DataGridColumn } from '@/components/ui/data-grid';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Money } from '@/core/domain/types/value-objects';

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

export const SupplierOrderList = () => {
  const { data: supplierOrders, isLoading } = useSupplierOrders();

  return (
    <DataGrid
      columns={columns}
      data={supplierOrders?.data || []}
      loading={isLoading}
      pageSize={10}
    />
  );
};
