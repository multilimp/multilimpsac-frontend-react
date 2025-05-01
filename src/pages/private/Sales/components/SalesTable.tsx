import AntTable from '@/components/AntTable';
import { SaleProps } from '@/services/sales/sales';
import { TableColumnsType } from 'antd';
import { Button, Space } from 'antd';

interface SalesTableProps {
  data: SaleProps[];
  loading: boolean;
  onEdit?: (sale: SaleProps) => void;
  onRefresh?: () => void;
}

const SalesTable = ({ data, loading, onEdit, onRefresh }: SalesTableProps) => {
  const columns: TableColumnsType<SaleProps> = [
    { title: 'N° Venta', dataIndex: 'saleNumber' },
    { title: 'Cliente', dataIndex: 'client' },
    { title: 'Fecha', dataIndex: 'date' },
    { title: 'Total', dataIndex: 'total' },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => onEdit?.(record)}>
            Editar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {onRefresh && (
        <Button style={{ marginBottom: 16 }} onClick={onRefresh}>
          Actualizar
        </Button>
      )}
      <AntTable columns={columns} data={data} loading={loading} />
    </div>
  );
};

export default SalesTable;