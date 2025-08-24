import PageContent from '@/components/PageContent';
import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { Link } from 'react-router-dom';
import QuotesTable from './components/QuotesTable';

const QuotesPage = () => {
  const { quotes, loadingQuotes, obtainQuotes } = useGlobalInformation();

  return (
    <PageContent
      component={
        <Button variant="contained" color="primary" startIcon={<Add />} component={Link} to="/quotes/create">
          Nueva Cotización
        </Button>
      }
    >
      <QuotesTable data={quotes || []} loading={loadingQuotes} onReload={obtainQuotes} />
    </PageContent>
  );
};

export default QuotesPage;