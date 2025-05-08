import AntTable from '@/components/AntTable';
import { QuoteProps } from '@/services/quotes/quotes';
import { TableColumnsType } from 'antd';
import { Button, Space } from 'antd';
import { Edit } from '@mui/icons-material';
import { Box } from '@mui/material';
import { formatCurrency } from '@/utils/functions';

interface QuotesTableProps {
  data: QuoteProps[];
  loading: boolean;
  onEdit: (quote: QuoteProps) => void;
}

const QuotesTable = ({ data, loading, onEdit }: QuotesTableProps) => {
  const columns: TableColumnsType<QuoteProps> = [
    { title: 'Código', dataIndex: 'quoteNumber', sorter: (a, b) => a.quoteNumber.localeCompare(b.quoteNumber) },
    { title: 'RUC Cliente', dataIndex: 'ruc' },
    { title: 'Razón Social', dataIndex: 'razonSocial', sorter: (a, b) => a.razonSocial.localeCompare(b.razonSocial) },
    { title: 'Departamento', dataIndex: 'departamento' },
    { 
      title: 'Monto', 
      dataIndex: 'total',
      sorter: (a, b) => a.total - b.total,
      render: v => <strong>{formatCurrency(v)}</strong>
    },
    { title: 'Plaza de Entrega', dataIndex: 'plazaEntrega' },
    { title: 'Fecha', dataIndex: 'date', sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() },
    { title: 'Estado', dataIndex: 'status' },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" icon={<Edit />} onClick={() => onEdit(record)}>
            Editar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Box position="relative">
      <AntTable<QuoteProps>
        columns={columns}
        data={data}
        loading={loading}
        rowKey="id"
      />
    </Box>
  );
};

export default QuotesTable;
