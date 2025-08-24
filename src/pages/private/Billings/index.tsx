import PageContent from '@/components/PageContent';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import BillingsTable from './components/BillingsTable';

const TrackingsPage = () => {
  const { sales, loadingSales, obtainSales } = useGlobalInformation();

  return (
    <PageContent
      title="Facturaciones"
      helper="GESTIÓN DE FACTURAS"
    >
      <BillingsTable
        data={sales}
        loading={loadingSales}
        onReload={obtainSales}
      />
    </PageContent>
  );
};

export default TrackingsPage;
