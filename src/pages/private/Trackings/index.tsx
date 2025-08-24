import PageContent from '@/components/PageContent';
import TrackingsTable from './components/TrackingsTable';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';

const TrackingsPage = () => {
  const { sales, loadingSales, obtainSales } = useGlobalInformation();

  return (
    <PageContent
      title="Seguimientos"
    >
      <TrackingsTable
        data={sales}
        loading={loadingSales}
        onReload={obtainSales}
      />
    </PageContent>
  );
};

export default TrackingsPage;
