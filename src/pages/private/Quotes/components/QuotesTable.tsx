
import AntTable from '@/components/AntTable';
import { QuoteProps } from '@/services/quotes/quotes';
import { TableColumnsType } from 'antd';
import { Button, Space } from 'antd';

interface QuotesTableProps {
  data?: QuoteProps[];
  loading: boolean;
  onEdit?: (quote: QuoteProps) => void;
  onRefresh?: () => void;
}

const QuotesTable = ({ data = [], loading, onEdit }: QuotesTableProps) => {
  const columns: TableColumnsType<QuoteProps> = [
    { title: 'N° Cotización', dataIndex: 'quoteNumber' },
    { title: 'Cliente', dataIndex: 'client' },
    { title: 'Fecha', dataIndex: 'date' },
    { title: 'Total', dataIndex: 'total' },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => onEdit?.(record)} disabled={!record?.id}>
            Editar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <AntTable columns={columns} data={data} loading={loading} rowKey="id" />
    </div>
  );
};

export default QuotesTable;
