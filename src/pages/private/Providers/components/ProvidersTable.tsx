// src/pages/providers/components/ProvidersTable.tsx
import AntTable from '@/components/AntTable';
import { ProviderProps } from '@/services/providers/providers';
import { TableColumnsType } from 'antd';
import { Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import React from 'react';

interface ProvidersTableProps {
  data?: ProviderProps[] | null;
  loading?: boolean;
  onEdit?: (provider: ProviderProps) => void;
  onDelete?: (provider: ProviderProps) => void;
  onView?: (provider: ProviderProps) => void;
}

const ProvidersTable: React.FC<ProvidersTableProps> = ({ 
  data = [], 
  loading = false,
  onEdit,
  onDelete,
  onView
}) => {
  const columns: TableColumnsType<ProviderProps> = [
    {
      title: 'RUC',
      dataIndex: 'ruc',
      key: 'ruc',
      width: 120,
      fixed: 'left',
      sorter: (a, b) => a.ruc.localeCompare(b.ruc),
    },
    {
      title: 'Razón Social',
      dataIndex: 'socialReason',
      key: 'socialReason',
      width: 200,
      sorter: (a, b) => a.socialReason.localeCompare(b.socialReason),
    },
    {
      title: 'Contactos',
      dataIndex: 'contacts',
      key: 'contacts',
      render: (contacts: string[]) => contacts?.join(', ') || '-',
      width: 180,
    },
    {
      title: 'Departamento',
      dataIndex: 'department',
      key: 'department',
      width: 150,
      filters: [
        { text: 'Lima', value: 'Lima' },
        { text: 'Arequipa', value: 'Arequipa' },
        // Agrega más filtros según necesites
      ],
      onFilter: (value, record) => record.department === value,
    },
    {
      title: 'Provincia',
      dataIndex: 'province',
      key: 'province',
      width: 150,
    },
    {
      title: 'Distrito',
      dataIndex: 'district',
      key: 'district',
      width: 150,
    },
    {
      title: 'Dirección',
      dataIndex: 'address',
      key: 'address',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Acciones',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          {onView && (
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => onView(record)}
              aria-label="Ver"
            />
          )}
          {onEdit && (
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => onEdit(record)}
              aria-label="Editar"
            />
          )}
          {onDelete && (
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => onDelete(record)}
              aria-label="Eliminar"
            />
          )}
        </Space>
      ),
    },
  ];

  // Normalización de datos
  const normalizedData = React.useMemo(() => {
    if (!data) return [];
    if (!Array.isArray(data)) return [];
    return data.map(item => ({
      ...item,
      key: item.id || Math.random().toString(36).substr(2, 9)
    }));
  }, [data]);

  return (
    <AntTable 
      data={normalizedData}
      columns={columns}
      loading={loading}
      scroll={{ x: 1500 }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total) => `Total: ${total} proveedores`,
      }}
      locale={{
        emptyText: 'No hay proveedores registrados',
      }}
    />
  );
};

export default ProvidersTable;