
import React from 'react';
import { DataGrid, DataGridColumn } from '@/components/ui/data-grid';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Money } from '@/core/domain/types/value-objects';
import { useQuery } from '@tanstack/react-query';
import { Billing } from '@/domain/billing/models/billing.model';

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
    key: 'billingDate',
    name: 'Fecha Facturación',
    type: 'date',
    sortable: true,
    filterable: true,
    getValue: (row) => formatDate(row.billingDate.value)
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
      <Badge variant={row.status === 'billed' ? 'success' : 'default'}>
        {row.status}
      </Badge>
    )
  }
];

export const BillingList: React.FC = () => {
  const { data: billingData, isLoading } = useQuery({
    queryKey: ['billing'],
    queryFn: async () => ({ data: [] }) // Implement actual billing service
  });

  const mappedData = React.useMemo(() => {
    if (!billingData?.data) return [];
    return billingData.data.map(order => ({
      ...order,
      id: order.id.value
    }));
  }, [billingData?.data]);

  return (
    <DataGrid
      columns={columns}
      data={mappedData}
      loading={isLoading}
      pageSize={10}
    />
  );
};
