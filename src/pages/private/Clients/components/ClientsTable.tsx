
import AntTable from '@/components/AntTable';
import { ClientProps } from '@/services/clients/clients';
import { TableColumnsType } from 'antd';
import React from 'react';

// Define a new interface that extends ClientProps with the key property
interface ClientTableProps extends ClientProps {
  key: string | number;
}

interface ClientsTableProps {
  data?: ClientProps[] | null; // Acepta undefined o null
  loading?: boolean;
}

const ClientsTable: React.FC<ClientsTableProps> = ({ 
  data = [], 
  loading = false 
}) => {
  // Columnas configuradas
  const columns: TableColumnsType<ClientTableProps> = [
    { title: 'RUC', dataIndex: 'ruc', key: 'ruc' },
    { title: 'Razón Social', dataIndex: 'socialReason', key: 'socialReason' },
    { title: 'Código Unidad', dataIndex: 'unitCode', key: 'unitCode', render: (text) => text || '-' },
    { title: 'Contactos', dataIndex: 'contacts', key: 'contacts', render: (contacts) => contacts?.join(', ') || '-' },
    { title: 'Departamento', dataIndex: 'department', key: 'department' },
    { title: 'Provincia', dataIndex: 'province', key: 'province' },
    { title: 'Distrito', dataIndex: 'district', key: 'district' },
    { title: 'Dirección', dataIndex: 'address', key: 'address', ellipsis: true },
    { title: 'Acciones', key: 'actions' }
  ];

  // Normalización de datos
  const normalizedData = React.useMemo(() => {
    if (!data) return [];
    if (!Array.isArray(data)) return [];
    return data.map(item => ({
      ...item,
      key: item.id || item.ruc || Math.random().toString(36).substr(2, 9)
    })) as ClientTableProps[];
  }, [data]);

  return (
    <AntTable 
      data={normalizedData} // Datos normalizados
      columns={columns}
      loading={loading}
      rowKey={(record) => String(record.key)}
    />
  );
};

export default ClientsTable;
