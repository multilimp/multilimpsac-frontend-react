import AntTable from '@/components/AntTable';
import { CompanyProps } from '@/services/companies/company';
import { TableColumnsType } from 'antd';

interface CompaniesTableProps {
  data: Array<CompanyProps>;
  loading: boolean;
}

const CompaniesTable = ({ data, loading }: CompaniesTableProps) => {
  const columns: TableColumnsType<CompanyProps> = [
    { title: 'Nombre', dataIndex: 'tite' },
    { title: 'RUC', dataIndex: '2' },
    { title: 'Dirección', dataIndex: '33' },
    { title: 'Acciones', dataIndex: '33' },
  ];

  return <AntTable columns={columns} data={data} loading={loading} />;
};

export default CompaniesTable;
