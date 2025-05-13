
// src/pages/components/TrackingsTable.tsx
import React from 'react';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { TrackingProps } from '@/services/trackings/trackings.d';
import dayjs from 'dayjs';
import { Button, ButtonGroup } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

interface TrackingsTableProps {
  data: TrackingProps[];
  loading: boolean;
  onEdit: (row: TrackingProps) => void;
  onDelete: (row: TrackingProps) => void;
}

const statusLabels: Record<TrackingProps['status'], string> = {
  pending: 'Pendiente',
  in_progress: 'En Progreso',
  delivered: 'Entregado',
  canceled: 'Cancelado',
};

const TrackingsTable: React.FC<TrackingsTableProps> = ({ data, loading, onEdit, onDelete }) => {
  const columns: AntColumnType<TrackingProps>[] = [
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <ButtonGroup size="small">
          <Button color="info" onClick={() => onEdit(record)}>
            <Edit fontSize="small" />
          </Button>
          <Button color="error" onClick={() => onDelete(record)}>
            <Delete fontSize="small" />
          </Button>
        </ButtonGroup>
      ),
    },
    { title: 'ID', dataIndex: 'id', minWidth: 70, filter: true },
    { title: 'ID Venta', dataIndex: 'saleId', minWidth: 100, filter: true },
    { title: 'RUC Cliente', dataIndex: 'clientRuc', minWidth: 120, filter: true },
    { title: 'RUC Empresa', dataIndex: 'companyRuc', minWidth: 120, filter: true },
    { title: 'Razón Social Empresa', dataIndex: 'companyBusinessName', minWidth: 200, filter: true },
    { title: 'Cliente', dataIndex: 'clientName', minWidth: 150, filter: true },

    {
      title: 'Fecha Máx. Entrega',
      dataIndex: 'maxDeliveryDate',
      minWidth: 140,
      render: d => dayjs(d).format('DD/MM/YYYY'),
    },
    {
      title: 'Monto Venta',
      dataIndex: 'saleAmount',
      minWidth: 120,
      render: amt => `S/ ${amt.toFixed(2)}`,
    },
    { title: 'CUE', dataIndex: 'cue', minWidth: 100 },
    { title: 'Departamento', dataIndex: 'department', minWidth: 140 },

    {
      title: 'OCE',
      dataIndex: 'oce',
      minWidth: 120,
      render: url =>
        url ? <a href={url} target="_blank" rel="noopener noreferrer">Descargar OCE</a> : '-',
    },
    {
      title: 'OCF',
      dataIndex: 'ocf',
      minWidth: 120,
      render: url =>
        url ? <a href={url} target="_blank" rel="noopener noreferrer">Descargar OCF</a> : '-',
    },

    {
      title: 'Perú Compras',
      dataIndex: 'peruPurchases',
      minWidth: 140,
      render: url =>
        url ? <a href={url} target="_blank" rel="noopener noreferrer">Descargar Doc</a> : '-',
    },

    { title: 'GRR', dataIndex: 'grr', minWidth: 100 },
    {
      title: 'Factura',
      dataIndex: 'invoiceNumber',
      minWidth: 100,
      render: t => t || '-',
    },
    {
      title: 'Refact',
      dataIndex: 'isRefact',
      minWidth: 90,
      render: v => (v ? 'Sí' : 'No'),
    },
    {
      title: 'Fecha Perú Compras',
      dataIndex: 'peruPurchasesDate',
      minWidth: 160,
      render: d => (d ? dayjs(d).format('DD/MM/YYYY') : '-'),
    },
    {
      title: 'Fecha Entrega OC',
      dataIndex: 'deliveryDateOC',
      minWidth: 150,
      render: d => (d ? dayjs(d).format('DD/MM/YYYY') : '-'),
    },
    {
      title: 'Utilidad (%)',
      dataIndex: 'utility',
      minWidth: 100,
      render: v => (v != null ? `${v}%` : '-'),
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
      scroll={{ x: 2500 }}
    />
  );
};

export default TrackingsTable;
