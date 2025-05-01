import AntTable from '@/components/AntTable';
import PageContent from '@/components/PageContent';
import { Button } from '@mui/material';

const Dashboard = () => {
  return (
    <PageContent title="Empresas" helper="DIRECTORIO > EMPRESAS" component={<Button>AGREGAR</Button>}>
      <AntTable
        columns={[
          { title: 'FIRST', dataIndex: 'tite' },
          { title: 'SECOND', dataIndex: '2' },
          { title: 'THIRD', dataIndex: '33' },
        ]}
        data={[{ tite: 'ASD', ot: 'sadd' }]}
      />
    </PageContent>
  );
};

export default Dashboard;
