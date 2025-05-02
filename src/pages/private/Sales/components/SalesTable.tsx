
import { SaleProps } from '@/services/sales/sales';
import { useState } from 'react';
import AntTable from '@/components/AntTable';
import { Button, Tooltip } from '@mui/material';
import { generateInvoice } from '@/services/sales/sales.request';
import { notification } from 'antd';
import { formatCurrency } from '@/utils/functions';
import { Receipt as ReceiptIcon, Edit as EditIcon } from '@mui/icons-material';

interface SalesTableProps {
  data: SaleProps[];
  loading: boolean;
  onEdit: (sale: SaleProps) => void;
  onRefresh: () => void;
}

const SalesTable = ({ data, loading, onEdit, onRefresh }: SalesTableProps) => {
  const [generatingInvoice, setGeneratingInvoice] = useState<string | null>(null);

  const handleGenerateInvoice = async (saleId: string) => {
    try {
      setGeneratingInvoice(saleId);
      const response = await generateInvoice(saleId);
      
      if (response && response.pdfUrl) {
        // Open PDF in new tab
        window.open(response.pdfUrl, '_blank');
      }
      
      notification.success({
        message: 'Éxito',
        description: 'La factura ha sido generada correctamente'
      });
    } catch (error) {
      console.error('Error generating invoice:', error);
      notification.error({
        message: 'Error',
        description: 'No se pudo generar la factura'
      });
    } finally {
      setGeneratingInvoice(null);
    }
  };

  const columns = [
    {
      title: 'Número',
      dataIndex: 'saleNumber',
      key: 'saleNumber',
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
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: SaleProps, b: SaleProps) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Método de Pago',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      filters: [
        { text: 'Efectivo', value: 'cash' },
        { text: 'Crédito', value: 'credit' },
        { text: 'Transferencia', value: 'transfer' },
      ],
      onFilter: (value: string, record: SaleProps) => record.paymentMethod === value,
      render: (paymentMethod: string) => {
        const methods: Record<string, string> = {
          cash: 'Efectivo',
          credit: 'Crédito',
          transfer: 'Transferencia'
        };
        return methods[paymentMethod] || paymentMethod;
      }
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Completado', value: 'completed' },
        { text: 'Pendiente', value: 'pending' },
        { text: 'Reembolsado', value: 'refunded' },
      ],
      onFilter: (value: string, record: SaleProps) => record.status === value,
      render: (status: string) => {
        const statusColors: Record<string, string> = {
          completed: '#04BA6B',
          pending: '#fb9c0c',
          refunded: '#f04438'
        };
        const statusLabels: Record<string, string> = {
          completed: 'Completado',
          pending: 'Pendiente',
          refunded: 'Reembolsado'
        };
        return (
          <div style={{ 
            backgroundColor: `${statusColors[status]}20`, 
            color: statusColors[status],
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'inline-block',
            fontWeight: 500,
            fontSize: '0.85rem',
            border: `1px solid ${statusColors[status]}40`
          }}>
            {statusLabels[status] || status}
          </div>
        );
      }
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      sorter: (a: SaleProps, b: SaleProps) => a.total - b.total,
      render: (total: number) => formatCurrency(total)
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: SaleProps) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Tooltip title="Editar">
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => onEdit(record)}
              sx={{ minWidth: 'unset', p: '4px' }}
            >
              <EditIcon fontSize="small" />
            </Button>
          </Tooltip>
          <Tooltip title="Generar factura">
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={() => handleGenerateInvoice(record.id.toString())}
              disabled={generatingInvoice === record.id.toString()}
              sx={{ minWidth: 'unset', p: '4px' }}
            >
              <ReceiptIcon fontSize="small" />
            </Button>
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <AntTable 
      columns={columns}
      data={data}
      loading={loading}
    />
  );
};

export default SalesTable;
