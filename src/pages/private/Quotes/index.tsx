import PageContent from '@/components/PageContent';
import { Button, Stack } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { Link } from 'react-router-dom';
import QuotesTable from './components/QuotesTable';

const QuotesPage = () => {
  const { quotes, loadingQuotes, obtainQuotes } = useGlobalInformation();

  return (
    <PageContent
      title="Cotizaciones"
    >
      <Stack direction="row" spacing={1} justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          component={Link}
          to="/quotes/create"
          sx={{
            backgroundColor: '#161e2a',
            '&:hover': {
              backgroundColor: '#1e2936'
            }
          }}
        >
          Nueva Cotización
        </Button>
      </Stack>
      <QuotesTable data={quotes || []} loading={loadingQuotes} onReload={obtainQuotes} />
    </PageContent>
  );
};

export default QuotesPage;