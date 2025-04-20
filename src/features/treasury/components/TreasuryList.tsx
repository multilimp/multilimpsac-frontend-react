
import React from 'react';
import { DataGrid, DataGridColumn } from '@/components/ui/data-grid';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Money } from '@/core/domain/types/value-objects';
import { useQuery } from '@tanstack/react-query';
import { Treasury } from '@/domain/treasury/models/treasury.model';

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
    key: 'paymentStatus',
    name: 'Estado',
    type: 'string',
    sortable: true,
    filterable: true,
    render: (row) => (
      <Badge variant={row.paymentStatus === 'completed' ? 'success' : 'default'}>
        {row.paymentStatus}
      </Badge>
    )
  }
];

export const TreasuryList: React.FC = () => {
  const { data: treasuryData, isLoading } = useQuery({
    queryKey: ['treasury'],
    queryFn: async () => ({ data: [] }) // Implement actual treasury service
  });

  const mappedData = React.useMemo(() => {
    if (!treasuryData?.data) return [];
    return treasuryData.data.map(order => ({
      ...order,
      id: order.id.value
    }));
  }, [treasuryData?.data]);

  return (
    <DataGrid
      columns={columns}
      data={mappedData}
      loading={isLoading}
      pageSize={10}
    />
  );
};
