
import React, { useState } from 'react';
import { Box, Button, Chip } from '@mui/material';
import { DatePicker, Space, Tooltip } from 'antd';
import { SaleProps, SaleFilter } from '@/services/sales/sales';
import { Delete, Edit, Loop, VisibilityOutlined } from '@mui/icons-material';
import AntTable, { AntColumnType } from '@/components/AntTable';
import dayjs, { Dayjs } from 'dayjs';
import { formatCurrency } from '@/utils/functions';

const { RangePicker } = DatePicker;

interface SalesTableProps {
  data: SaleProps[];
  loading?: boolean;
  onEdit: (sale: SaleProps) => void;
  onRefresh?: () => void;
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

const SalesTable: React.FC<SalesTableProps> = ({ data, loading, onEdit, onRefresh }) => {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [filter, setFilter] = useState<SaleFilter>({});

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (!dates || dates.length < 2) {
      setDateRange([null, null]);
      setFilter({ ...filter, dateFrom: undefined, dateTo: undefined });
      return;
    }
    
    setDateRange(dates);
    setFilter({
      ...filter,
      dateFrom: dates[0]?.format('YYYY-MM-DD'),
      dateTo: dates[1]?.format('YYYY-MM-DD')
    });
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const columns: AntColumnType<SaleProps>[] = [
    {
      title: 'Código Venta',
      dataIndex: 'saleCode',
      key: 'saleCode',
      render: (saleCode: string | undefined, record: SaleProps) => saleCode || record.saleNumber,
      filters: [],
      filterSearch: true,
    },
    {
      title: 'Cliente',
      dataIndex: 'client',
      key: 'client',
      filters: [],
      filterSearch: true,
    },
    {
      title: 'RUC Cliente',
      dataIndex: 'clientRuc',
      key: 'clientRuc',
      filters: [],
      filterSearch: true,
    },
    {
      title: 'Empresa',
      dataIndex: 'companyName',
      key: 'companyName',
      filters: [],
      filterSearch: true,
      render: (companyName: string) => companyName || '-',
    },
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Forma de Pago',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      filters: [
        { text: 'Efectivo', value: 'cash' },
        { text: 'Crédito', value: 'credit' },
        { text: 'Transferencia', value: 'transfer' }
      ],
      onFilter: (value: any, record: SaleProps) => record.paymentMethod === value,
      render: (paymentMethod: string) => {
        switch (paymentMethod) {
          case 'cash': return 'Efectivo';
          case 'credit': return 'Crédito';
          case 'transfer': return 'Transferencia';
          default: return paymentMethod;
        }
      }
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Completado', value: 'completed' },
        { text: 'Pendiente', value: 'pending' },
        { text: 'Reembolsado', value: 'refunded' }
      ],
      onFilter: (value: any, record: SaleProps) => record.status === value,
      render: (status: string) => {
        const statusTranslations: Record<string, string> = {
          completed: 'Completado',
          pending: 'Pendiente',
          refunded: 'Reembolsado'
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
      }
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => a.total - b.total,
      render: (total: number) => formatCurrency(total)
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Ver detalles">
            <Button
              size="small"
              variant="outlined"
              color="info"
              sx={{ minWidth: 'auto', p: 0.75 }}
              onClick={() => {}}
            >
              <VisibilityOutlined fontSize="small" />
            </Button>
          </Tooltip>
          
          <Tooltip title="Editar">
            <Button
              size="small"
              variant="outlined"
              color="primary"
              sx={{ minWidth: 'auto', p: 0.75 }}
              onClick={() => onEdit(record)}
            >
              <Edit fontSize="small" />
            </Button>
          </Tooltip>
          
          <Tooltip title="Eliminar">
            <Button
              size="small"
              variant="outlined"
              color="error"
              sx={{ minWidth: 'auto', p: 0.75 }}
              onClick={() => {}}
            >
              <Delete fontSize="small" />
            </Button>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <RangePicker 
            value={dateRange as any} 
            onChange={(dates) => handleDateRangeChange(dates as any)}
            style={{ marginRight: '1rem' }} 
          />
        </Box>
        
        <Box>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<Loop />} 
            onClick={handleRefresh}
            sx={{ mr: 1 }}
          >
            Actualizar
          </Button>
        </Box>
      </Box>
      
      <AntTable 
        data={data}
        columns={columns as AntColumnType<SaleProps>[]}
        loading={loading}
      />
    </Box>
  );
};

export default SalesTable;
