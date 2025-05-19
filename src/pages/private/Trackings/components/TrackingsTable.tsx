// src/pages/private/Trackings/components/TrackingsTable.tsx
import React, { Fragment } from 'react';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { TrackingProps } from '@/services/trackings/trackings.d';
import dayjs from 'dayjs';
import { Fab } from '@mui/material';
import { PictureAsPdf } from '@mui/icons-material';

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
    { title: 'ID Venta', dataIndex: 'saleId', minWidth: 100 },
    {
      title: 'Cliente',
      align: 'center',
      children: [
        { title: 'RUC', dataIndex: 'clientRuc', minWidth: 120 },
        { title: 'Nombre', dataIndex: 'clientName', minWidth: 150 },
      ],
    },
    {
      title: 'Empresa',
      align: 'center',
      children: [
        { title: 'RUC', dataIndex: 'companyRuc', minWidth: 120 },
        { title: 'Razón social', dataIndex: 'companyBusinessName', minWidth: 200 },
      ],
    },
    { title: 'CUE', dataIndex: 'cue', minWidth: 100 },
    {
      title: 'Documentos',
      align: 'center',
      children: [
        {
          title: 'OCE',
          dataIndex: 'oce',
          minWidth: 75,
          render: (_, record) =>
            record.oce
              ? <Fab size="small" component="a" href={record.oce} target="_blank"><PictureAsPdf /></Fab>
              : '-',
        },
        {
          title: 'OCF',
          dataIndex: 'ocf',
          minWidth: 75,
          render: (_, record) =>
            record.ocf
              ? <Fab size="small" component="a" href={record.ocf} target="_blank"><PictureAsPdf /></Fab>
              : '-',
        },
      ],
    },
    {
      title: 'Fechas',
      align: 'center',
      children: [
        {
          title: 'Máx. entrega',
          dataIndex: 'maxDeliveryDate',
          minWidth: 140,
          render: d => dayjs(d).format('DD/MM/YYYY'),
        },
        {
          title: 'Perú Compras',
          dataIndex: 'peruPurchasesDate',
          minWidth: 160,
          render: d => d ? dayjs(d).format('DD/MM/YYYY') : '-',
        },
        {
          title: 'Entrega OC',
          dataIndex: 'deliveryDateOC',
          minWidth: 150,
          render: d => d ? dayjs(d).format('DD/MM/YYYY') : '-',
        },
      ],
    },
    {
      title: 'Financiero',
      align: 'center',
      children: [
        {
          title: 'Monto Venta',
          dataIndex: 'saleAmount',
          minWidth: 120,
          render: amt => `S/ ${amt.toFixed(2)}`,
        },
        {
          title: 'Utilidad (%)',
          dataIndex: 'utility',
          minWidth: 100,
          render: v => v != null ? `${v}%` : '-',
        },
      ],
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      minWidth: 120,
      render: (_, rec) => statusLabels[rec.status],
    },
  ];

  return (
    <AntTable
      columns={columns}
      data={data}
      loading={loading}
      rowKey="id"
      scroll={{ x: 'max-content' }}
      onRow={record => ({
        onClick: () => onRowClick(record),
        style: { cursor: 'pointer' },
      })}
    />
  );
};

export default TrackingsTable;
