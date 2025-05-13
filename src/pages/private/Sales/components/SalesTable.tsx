import React from 'react';
import { Button, Chip } from '@mui/material';
import { Space, Tooltip } from 'antd';
import { SaleProps } from '@/services/sales/sales';
import { Delete, Edit, VisibilityOutlined } from '@mui/icons-material';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { formatCurrency } from '@/utils/functions';
import dayjs from 'dayjs';

interface SalesTableProps {
  data: SaleProps[];
  loading: boolean;
  onEdit: (sale: SaleProps) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'refunded':
      return 'error';
    default:
      return 'default';
  }
};

const SalesTable: React.FC<SalesTableProps> = ({ data, loading, onEdit }) => {
  const columns: AntColumnType<SaleProps>[] = [
    {
      title: 'Código Venta',
      dataIndex: 'codigoVenta',
      key: 'codigoVenta',
      filter: true,
      width: 150,
    },
    {
      title: 'Cliente',
      dataIndex: 'cliente',
      key: 'cliente',
      width: 125,
      render: (_, record) => record.cliente?.razonSocial ?? '-',
    },
    {
      title: 'RUC Cliente',
      dataIndex: 'cliente',
      key: 'cliente',
      width: 150,
      render: (_, record) => record.cliente?.ruc ?? '-',
    },
    {
      title: 'Empresa',
      dataIndex: 'empresa',
      key: 'empresa',
      width: 150,
      render: (_, record) => record.empresa?.razonSocial ?? '-',
    },
    {
      title: 'Fecha de emisión',
      dataIndex: 'fechaEmision',
      key: 'fechaEmision',
      width: 150,
      render: (value) => (value ? dayjs(value).format('DD/MM/YYYY') : ''),
    },
    {
      title: 'Estado',
      dataIndex: 'etapaSiaf',
      key: 'etapaSiaf',
      width: 150,
      filters: [
        { text: 'Completado', value: 'completed' },
        { text: 'Pendiente', value: 'pending' },
        { text: 'Reembolsado', value: 'refunded' },
      ],
      onFilter: (value: any, record: SaleProps) => record.etapaSiaf === value,
      render: (etapaSiaf: string) => {
        const statusTranslations: Record<string, string> = {
          completed: 'Completado',
          pending: 'Pendiente',
          refunded: 'Reembolsado',
        };

        return (
          <Chip
            label={statusTranslations[etapaSiaf] || etapaSiaf}
            color={getStatusColor(etapaSiaf) as any}
            size="small"
            variant="filled"
            sx={{ fontWeight: 500 }}
          />
        );
      },
    },
    {
      title: 'Total',
      dataIndex: 'montoVenta',
      key: 'montoVenta',
      width: 150,
      render: (montoVenta: number) => formatCurrency(montoVenta),
    },
    {
      title: 'Acciones',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Ver detalles">
            <Button size="small" variant="outlined" color="info" sx={{ minWidth: 'auto', p: 0.75 }} onClick={() => {}}>
              <VisibilityOutlined fontSize="small" />
            </Button>
          </Tooltip>

          <Tooltip title="Editar">
            <Button size="small" variant="outlined" color="primary" sx={{ minWidth: 'auto', p: 0.75 }} onClick={() => onEdit(record)}>
              <Edit fontSize="small" />
            </Button>
          </Tooltip>

          <Tooltip title="Eliminar">
            <Button size="small" variant="outlined" color="error" sx={{ minWidth: 'auto', p: 0.75 }} onClick={() => {}}>
              <Delete fontSize="small" />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return <AntTable data={data} columns={columns} loading={loading} />;
};

export default SalesTable;
