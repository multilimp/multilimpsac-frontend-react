import PageContent from '@/components/PageContent';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import BillingsTable from './components/BillingsTable';

const TrackingsPage = () => {
  const { sales, loadingSales } = useGlobalInformation();

  return (
    <PageContent
      title="Facturaciones"
      helper="GESTIÓN DE FACTURAS"
    >
      <BillingsTable 
        data={sales} 
        loading={loadingSales} 
      />
    </PageContent>
  );
};

export default TrackingsPage;
