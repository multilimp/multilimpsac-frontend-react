
import React from 'react';
import { DataGrid, DataGridColumn } from '@/components/ui/data-grid';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/app/core/utils';
import { Money } from '@/core/domain/types/value-objects';
import { useQuery } from '@tanstack/react-query';
import { Tracking } from '@/domain/tracking/models/tracking.model';

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
      <Badge variant={row.status === 'completed' ? 'success' : 'default'}>
        {row.status}
      </Badge>
    )
  }
];

export const TrackingList: React.FC = () => {
  const { data: trackingData, isLoading } = useQuery({
    queryKey: ['tracking'],
    queryFn: async () => ({ data: [] }) // Implement actual tracking service
  });

  const mappedData = React.useMemo(() => {
    if (!trackingData?.data) return [];
    return trackingData.data.map(order => ({
      ...order,
      id: order.id.value
    }));
  }, [trackingData?.data]);

  return (
    <DataGrid
      columns={columns}
      data={mappedData}
      loading={isLoading}
      pageSize={10}
    />
  );
};
