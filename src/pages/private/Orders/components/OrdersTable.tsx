import AntTable from '@/components/AntTable';
import { OrderProps } from '@/services/orders/orders';
import { TableColumnsType } from 'antd';
import { Button, Space } from 'antd';

interface OrdersTableProps {
  data: OrderProps[];
  loading: boolean;
  onEdit?: (order: OrderProps) => void;
  onRefresh?: () => void;
}

const OrdersTable = ({ data, loading, onEdit, onRefresh }: OrdersTableProps) => {
  const columns: TableColumnsType<OrderProps> = [
    { title: 'N° Orden', dataIndex: 'orderNumber' },
    { title: 'Cliente', dataIndex: 'client' },
    { title: 'Fecha', dataIndex: 'date' },
    { title: 'Estado', dataIndex: 'status' },
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

export default OrdersTable;