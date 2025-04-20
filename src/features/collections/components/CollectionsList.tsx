
import React from 'react';
import { DataGrid, DataGridColumn } from '@/components/ui/data-grid';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Money } from '@/core/domain/types/value-objects';
import { useQuery } from '@tanstack/react-query';
import { Collection } from '@/domain/collections/models/collection.model';

const columns: DataGridColumn[] = [
  {
    key: 'orderNumber',
    name: 'Número',
    type: 'string',
    sortable: true,
    filterable: true,
  },
  {
    key: 'clientName',
    name: 'Cliente',
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
    key: 'dueDate',
    name: 'Vencimiento',
    type: 'date',
    sortable: true,
    filterable: true,
    getValue: (row) => formatDate(row.dueDate.value)
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
    key: 'pendingAmount.amount',
    name: 'Pendiente',
    type: 'number',
    sortable: true,
    filterable: true,
    getValue: (row) => {
      const amount = row.pendingAmount as Money;
      return amount.amount.toLocaleString('es-PE', {
        style: 'currency',
        currency: amount.currency
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
      <Badge variant={row.status === 'completed' ? 'success' : row.status === 'overdue' ? 'destructive' : 'default'}>
        {row.status}
      </Badge>
    )
  }
];

export const CollectionsList: React.FC = () => {
  const { data: collectionsData, isLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: async () => ({ data: [] }) // Implement actual collections service
  });

  const mappedData = React.useMemo(() => {
    if (!collectionsData?.data) return [];
    return collectionsData.data.map(order => ({
      ...order,
      id: order.id.value
    }));
  }, [collectionsData?.data]);

  return (
    <DataGrid
      columns={columns}
      data={mappedData}
      loading={isLoading}
      pageSize={10}
    />
  );
};
