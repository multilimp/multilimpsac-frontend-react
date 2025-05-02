
import AntTable from '@/components/AntTable';
import { QuoteProps } from '@/services/quotes/quotes';
import { TableColumnsType } from 'antd';
import { Button, Space } from 'antd';
import { Edit, Refresh } from '@mui/icons-material';
import { Box } from '@mui/material';
import { formatCurrency } from '@/utils/functions';

interface QuotesTableProps {
  data?: QuoteProps[];
  loading: boolean;
  onEdit?: (quote: QuoteProps) => void;
  onRefresh?: () => void;
}

const QuotesTable = ({ data = [], loading, onEdit, onRefresh }: QuotesTableProps) => {
  const columns: TableColumnsType<QuoteProps> = [
    { 
      title: 'N° Cotización', 
      dataIndex: 'quoteNumber',
      filters: [], // Changed from filter: true
      filterSearch: true,
      sorter: (a, b) => a.quoteNumber.localeCompare(b.quoteNumber),
    },
    { 
      title: 'Cliente', 
      dataIndex: 'client',
      filters: [], // Changed from filter: true
      filterSearch: true,
      sorter: (a, b) => a.client.localeCompare(b.client),
    },
    { 
      title: 'Fecha', 
      dataIndex: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    { 
      title: 'Total', 
      dataIndex: 'total',
      sorter: (a, b) => a.total - b.total,
      render: (value) => (
        <span style={{ fontWeight: 500 }}>
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: '15%',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            onClick={() => onEdit?.(record)} 
            disabled={!record?.id}
            icon={<Edit sx={{ fontSize: '1rem' }} />}
          >
            Editar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Box sx={{ position: 'relative' }}>
      {onRefresh && (
        <Button 
          type="text"
          icon={<Refresh />}
          onClick={onRefresh}
          style={{ 
            position: 'absolute', 
            top: -48, 
            right: 0,
            zIndex: 1
          }}
        >
          Actualizar
        </Button>
      )}
      <AntTable 
        columns={columns} 
        data={data} 
        loading={loading} 
        rowKey="id" 
      />
    </Box>
  );
};

export default QuotesTable;
