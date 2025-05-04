import AntTable from '@/components/AntTable';
import { TreasurysProps } from '@/services/treasurys/treasurys';
import { TableColumnsType } from 'antd';

interface TreasurysTableProps {
  data?: Array<TreasurysProps>; // Hacer data opcional
  loading: boolean;
}

const TreasurysTable = ({ data = [], loading }: TreasurysTableProps) => {
  // Verificación adicional para TypeScript
  const safeData = Array.isArray(data) ? data : [];
  
  const columns: TableColumnsType<TreasurysProps> = [
    { title: 'Código Venta', dataIndex: 'saleCode' },
    { title: 'Razón Social Cliente', dataIndex: 'clientBusinessName' },
    { title: 'RUC Cliente', dataIndex: 'clientRuc' },
    { title: 'RUC Empresa', dataIndex: 'companyRuc' },
    { title: 'Razón Social Empresa', dataIndex: 'companyBusinessName' },
    { title: 'Contacto', dataIndex: 'contact' },
    { title: 'Estado', dataIndex: 'status' }
  ];

  return <AntTable columns={columns} data={safeData} loading={loading} rowKey="id" />;
};

export default TreasurysTable;