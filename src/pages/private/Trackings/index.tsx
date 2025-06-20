import PageContent from '@/components/PageContent';
import TrackingsTable from './components/TrackingsTable';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';

const TrackingsPage = () => {
  const { sales, loadingSales } = useGlobalInformation();

  return (
    <PageContent
      title="Seguimientos"
      helper="SEGUIMIENTO / ÓRDENES"
    >
      <TrackingsTable 
        data={sales} 
        loading={loadingSales} 
      />
    </PageContent>
  );
};

export default TrackingsPage;
