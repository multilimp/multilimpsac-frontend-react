
import PageContent from '@/components/PageContent';
import SalesTable from './components/SalesTable';
import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { Link } from 'react-router-dom';

const SalesPage = () => {
  const { sales, loadingSales, obtainSales } = useGlobalInformation();

  return (
    <PageContent
      component={
        <Button variant="contained" color="primary" startIcon={<Add />} component={Link} to="/sales/create">
          Agregar Venta
        </Button>
      }
    >
      <SalesTable data={sales} loading={loadingSales} onReload={obtainSales} />
    </PageContent>
  );
};

export default SalesPage;
