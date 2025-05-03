import { Table, Tag, Button, Space } from 'antd';
import { TransportProps } from '@/services/transports/transports';
import { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface TransportsTableProps {
  data: TransportProps[];
  loading: boolean;
  onEdit: (transport: TransportProps) => void;
  onDelete: (transport: TransportProps) => void;
}

const TransportsTable = ({ data, loading, onEdit, onDelete }: TransportsTableProps) => {
  const columns: ColumnsType<TransportProps> = [
    {
      title: 'RUC',
      dataIndex: 'ruc',
      key: 'ruc',
      width: 120,
      fixed: 'left',
    },
    {
      title: 'Razón Social',
      dataIndex: 'socialReason',
      key: 'socialReason',
      width: 200,
    },
    {
      title: 'Contactos',
      dataIndex: 'contacts',
      key: 'contacts',
      render: (contacts: string[]) => (
        <span>{contacts?.join(', ') || '-'}</span>
      ),
    },
    {
      title: 'Cobertura',
      dataIndex: 'coverage',
      key: 'coverage',
      render: (coverage: string[]) => (
        <Space size="small">
          {coverage?.map((item) => (
            <Tag color="blue" key={item}>
              {item}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Departamento',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Provincia',
      dataIndex: 'province',
      key: 'province',
    },
    {
      title: 'Distrito',
      dataIndex: 'district',
      key: 'district',
    },
    {
      title: 'Dirección',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: 'Acciones',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      scroll={{ x: 1500 }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
      }}
      rowKey="id"
    />
  );
};

export default TransportsTable;