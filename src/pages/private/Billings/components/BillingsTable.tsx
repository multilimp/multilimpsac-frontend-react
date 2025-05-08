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
    { title: 'ID', dataIndex: 'id', minWidth: 60, filter: true },
    { title: 'ID Venta', dataIndex: 'saleId', minWidth: 100, filter: true },
    { title: 'Razón Social Cliente', dataIndex: 'clientBusinessName', minWidth: 200, filter: true },
    { title: 'RUC Cliente', dataIndex: 'clientRuc', minWidth: 120, filter: true },
    { title: 'RUC Empresa', dataIndex: 'companyRuc', minWidth: 120, filter: true },
    { title: 'Razón Social Empresa', dataIndex: 'companyBusinessName', minWidth: 200, filter: true },
    { title: 'Contacto', dataIndex: 'contact', minWidth: 150, filter: true },

    {
      title: 'Fecha Registro',
      dataIndex: 'registerDate',
      minWidth: 120,
      render: (d: string) => dayjs(d).format('DD/MM/YYYY'),
    },
    {
      title: 'Fecha Máx. Entrega',
      dataIndex: 'maxDeliveryDate',
      minWidth: 120,
      render: (d: string) => dayjs(d).format('DD/MM/YYYY'),
    },
    {
      title: 'Fecha Entrega OC',
      dataIndex: 'deliveryDateOC',
      minWidth: 120,
      render: (d: string) => dayjs(d).format('DD/MM/YYYY'),
    },

    {
      title: 'Monto Venta',
      dataIndex: 'saleAmount',
      minWidth: 120,
      render: (amt: number) => `S/ ${amt.toFixed(2)}`,
    },

    {
      title: 'OCE',
      dataIndex: 'oce',
      minWidth: 120,
      render: (url?: string) =>
        url ? <a href={url} target="_blank" rel="noopener noreferrer">Descargar OCE</a> : '-',
    },
    {
      title: 'OCF',
      dataIndex: 'ocf',
      minWidth: 120,
      render: (url?: string) =>
        url ? <a href={url} target="_blank" rel="noopener noreferrer">Descargar OCF</a> : '-',
    },

    {
      title: 'Fecha Recepción',
      dataIndex: 'receptionDate',
      minWidth: 120,
      render: (d: string) => dayjs(d).format('DD/MM/YYYY'),
    },
    {
      title: 'Fecha Programación',
      dataIndex: 'programmingDate',
      minWidth: 120,
      render: (d: string) => dayjs(d).format('DD/MM/YYYY'),
    },

    {
      title: 'N° Factura',
      dataIndex: 'invoiceNumber',
      minWidth: 100,
      render: inv => inv || '-',
    },
    {
      title: 'Fecha Factura',
      dataIndex: 'invoiceDate',
      minWidth: 120,
      render: d => (d ? dayjs(d).format('DD/MM/YYYY') : '-'),
    },

    { title: 'GRR', dataIndex: 'grr', minWidth: 100, filter: true },
    {
      title: 'Refact',
      dataIndex: 'isRefact',
      minWidth: 80,
      render: v => (v ? 'Sí' : 'No'),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      minWidth: 120,
      render: (_, rec) => statusMap[rec.status],
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
