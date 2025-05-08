// src/pages/components/BillingsTable.tsx
import React from 'react';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { BillingProps } from '@/services/billings/billings.d';
import dayjs from 'dayjs';

interface BillingsTableProps {
  data: BillingProps[];
  loading: boolean;
}

const statusMap: Record<BillingProps['status'], string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  canceled: 'Cancelado',
  processing: 'Procesando',
};

const BillingsTable: React.FC<BillingsTableProps> = ({ data, loading }) => {
  const columns: AntColumnType<BillingProps>[] = [
    { title: 'ID', dataIndex: 'id', width: 60 },

    { title: 'ID Venta', dataIndex: 'saleId', width: 100 },

    { title: 'Razón Social Cliente', dataIndex: 'clientBusinessName', width: 200 },
    { title: 'RUC Cliente', dataIndex: 'clientRuc', width: 120 },

    { title: 'RUC Empresa', dataIndex: 'companyRuc', width: 120 },
    { title: 'Razón Social Empresa', dataIndex: 'companyBusinessName', width: 200 },

    { title: 'Cliente', dataIndex: 'contact', width: 150 },

    {
      title: 'Fecha Registro',
      dataIndex: 'registerDate',
      render: (d: string) => dayjs(d).format('DD/MM/YYYY'),
      width: 120,
    },
    {
      title: 'Fecha Máx. Ent',
      dataIndex: 'maxDeliveryDate',
      render: (d: string) => dayjs(d).format('DD/MM/YYYY'),
      width: 120,
    },
    {
      title: 'Fecha Entrega OC',
      dataIndex: 'deliveryDateOC',
      render: (d: string) => dayjs(d).format('DD/MM/YYYY'),
      width: 120,
    },

    {
      title: 'Monto Venta',
      dataIndex: 'saleAmount',
      render: (amt: number) => `S/ ${amt.toFixed(2)}`,
      width: 120,
    },

    { title: 'OCE', dataIndex: 'oce', width: 100 },
    { title: 'OCF', dataIndex: 'ocf', width: 100 },

    {
      title: 'Fecha Recepción',
      dataIndex: 'receptionDate',
      render: (d: string) => dayjs(d).format('DD/MM/YYYY'),
      width: 120,
    },
    {
      title: 'Fecha Programación',
      dataIndex: 'programmingDate',
      render: (d: string) => dayjs(d).format('DD/MM/YYYY'),
      width: 120,
    },

    {
      title: 'Factura',
      dataIndex: 'invoiceNumber',
      render: (inv?: string) => inv || '-',
      width: 100,
    },
    {
      title: 'Fecha Factura',
      dataIndex: 'invoiceDate',
      render: (d?: string) => (d ? dayjs(d).format('DD/MM/YYYY') : '-'),
      width: 120,
    },

    { title: 'GRR', dataIndex: 'grr', width: 100 },

    {
      title: 'Refact',
      dataIndex: 'isRefact',
      render: (v: boolean) => (v ? 'Sí' : 'No'),
      width: 80,
    },

    {
      title: 'Estado',
      dataIndex: 'status',
      render: (_: any, record: BillingProps) => statusMap[record.status],
      width: 120,
    },
  ];

  return (
    <AntTable
      columns={columns}
      data={data}
      loading={loading}
      rowKey="id"
      scroll={{ x: 2400 }}
    />
  );
};

export default BillingsTable;
