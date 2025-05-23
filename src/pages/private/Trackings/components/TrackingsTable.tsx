// src/components/TrackingsTable.tsx
import React from 'react';
import AntTable, { AntColumnType } from '@/components/AntTable';
import dayjs from 'dayjs';
import { Fab } from '@mui/material';
import { PictureAsPdf } from '@mui/icons-material';
import { TrackingProps } from '@/services/trackings/trackings.d';

interface TrackingsTableProps {
  data: TrackingProps[];
  loading: boolean;
  onRowClick: (row: TrackingProps) => void;
}

const statusLabels: Record<TrackingProps['status'], string> = {
  pending: 'Pendiente',
  in_progress: 'En Progreso',
  delivered: 'Entregado',
  canceled: 'Cancelado',
};

const TrackingsTable: React.FC<TrackingsTableProps> = ({ data, loading, onRowClick }) => {
  const columns: AntColumnType<TrackingProps>[] = [
    { title: 'ID', dataIndex: 'id', minWidth: 80 },
    { title: 'ID Venta', dataIndex: 'saleId', minWidth: 100 },
    { title: 'Razón Social Cliente', dataIndex: 'clientName', minWidth: 200 },
    { title: 'RUC Cliente', dataIndex: 'clientRuc', minWidth: 140 },
    { title: 'RUC Empresa', dataIndex: 'companyRuc', minWidth: 140 },
    { title: 'Razón Social Empresa', dataIndex: 'companyBusinessName', minWidth: 200 },
    {
      title: 'Fecha Máx. Ent.',
      dataIndex: 'maxDeliveryDate',
      minWidth: 140,
      render: (d: string) => dayjs(d).format('DD/MM/YYYY'),
    },
    {
      title: 'Monto Venta',
      dataIndex: 'saleAmount',
      minWidth: 120,
      render: (amt: number) => `S/ ${amt}`,
    },
    { title: 'CUE', dataIndex: 'cue', minWidth: 100 },
    { title: 'Departamento', dataIndex: 'department', minWidth: 120 },
    {
      title: 'OCE (PDF)',
      dataIndex: 'oce',
      minWidth: 75,
      render: (_, record) =>
        record.oce ? (
          <Fab size="small" component="a" href={record.oce} target="_blank" title="Descargar PDF OCE">
            <PictureAsPdf />
          </Fab>
        ) : (
          '-'
        ),
    },
    {
      title: 'OCF (PDF)',
      dataIndex: 'ocf',
      minWidth: 75,
      render: (_, record) =>
        record.ocf ? (
          <Fab size="small" component="a" href={record.ocf} target="_blank" title="Descargar PDF OCF">
            <PictureAsPdf />
          </Fab>
        ) : (
          '-'
        ),
    },
    {
      title: 'Peru Compras',
      dataIndex: 'peruPurchases',
      minWidth: 120,
      render: (val: boolean) => (val ? 'Sí' : 'No'),
    },
    { title: 'GRR', dataIndex: 'grr', minWidth: 100 },
    { title: 'Factura', dataIndex: 'invoiceNumber', minWidth: 120 },
    {
      title: 'Refact',
      dataIndex: 'isRefact',
      minWidth: 80,
      render: (val: boolean) => (val ? 'Sí' : 'No'),
    },
    {
      title: 'Fecha Peru Compras',
      dataIndex: 'peruPurchasesDate',
      minWidth: 150,
      render: (d?: string) => (d ? dayjs(d).format('DD/MM/YYYY') : '-'),
    },
    {
      title: 'Fecha Entrega OC',
      dataIndex: 'deliveryDateOC',
      minWidth: 150,
      render: (d?: string) => (d ? dayjs(d).format('DD/MM/YYYY') : '-'),
    },
    {
      title: 'Utilidad (%)',
      dataIndex: 'utility',
      minWidth: 100,
      render: (v?: number) => (v != null ? `${v}%` : '-'),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      minWidth: 120,
      render: (_, record) => statusLabels[record.status],
    },
  ];

  return (
    <AntTable
      columns={columns}
      data={data}
      loading={loading}
      rowKey="id"
      scroll={{ x: 'max-content' }}
      onRow={(record) => ({
        onClick: () => onRowClick(record),
        style: { cursor: 'pointer' },
      })}
    />
  );
};

export default TrackingsTable;
