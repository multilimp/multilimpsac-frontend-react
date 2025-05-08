import React from 'react';
import { Button, Chip } from '@mui/material';
import { Space, Tooltip } from 'antd';
import { SaleProps } from '@/services/sales/sales';
import { Delete, Edit, VisibilityOutlined } from '@mui/icons-material';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { formatCurrency } from '@/utils/functions';

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
      dataIndex: 'saleCode',
      key: 'saleCode',
      filter: true,
      width: 150,
      render: (saleCode: string | undefined, record: SaleProps) => saleCode ?? record.saleNumber,
      // filters: [],
      // filterSearch: true,
    },
    {
      title: 'Cliente',
      dataIndex: 'client',
      key: 'client',
      filter: true,
      width: 125,
      // filters: [],
      // filterSearch: true,
    },
    {
      title: 'RUC Cliente',
      dataIndex: 'clientRuc',
      key: 'clientRuc',
      filter: true,
      width: 150,
      // filters: [],
      // filterSearch: true,
    },
    {
      title: 'Empresa',
      dataIndex: 'companyName',
      key: 'companyName',
      filter: true,
      width: 150,
      // filters: [],
      // filterSearch: true,
      render: (companyName: string) => companyName || '-',
    },
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
      width: 100,
      // sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Forma de Pago',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 150,
      // filters: [
      //   { text: 'Efectivo', value: 'cash' },
      //   { text: 'Crédito', value: 'credit' },
      //   { text: 'Transferencia', value: 'transfer' },
      // ],
      // onFilter: (value: any, record: SaleProps) => record.paymentMethod === value,
      // render: (paymentMethod: string) => {
      //   switch (paymentMethod) {
      //     case 'cash':
      //       return 'Efectivo';
      //     case 'credit':
      //       return 'Crédito';
      //     case 'transfer':
      //       return 'Transferencia';
      //     default:
      //       return paymentMethod;
      //   }
      // },
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      filters: [
        { text: 'Completado', value: 'completed' },
        { text: 'Pendiente', value: 'pending' },
        { text: 'Reembolsado', value: 'refunded' },
      ],
      onFilter: (value: any, record: SaleProps) => record.status === value,
      render: (status: string) => {
        const statusTranslations: Record<string, string> = {
          completed: 'Completado',
          pending: 'Pendiente',
          refunded: 'Reembolsado',
        };

        return (
          <Chip
            label={statusTranslations[status] || status}
            color={getStatusColor(status) as any}
            size="small"
            variant="filled"
            sx={{ fontWeight: 500 }}
          />
        );
      },
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: 150,
      sorter: (a, b) => a.total - b.total,
      render: (total: number) => formatCurrency(total),
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
