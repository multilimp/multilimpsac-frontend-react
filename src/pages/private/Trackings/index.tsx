import PageContent from '@/components/PageContent';
import TrackingsTable from './components/TrackingsTable';
import { TrackingProps } from '@/services/trackings/trackings.d';
import { useNavigate } from 'react-router-dom';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';

const TrackingsPage = () => {
  const router = useNavigate();
  const { trackings, loadingTrackings } = useGlobalInformation();

  const onRowClick = (data: TrackingProps) => {
    console.log('Row clicked', data);
    router('/tracking/' + data.id);
  };

  return (
    <PageContent>
      <TrackingsTable data={trackings} loading={loadingTrackings} onRowClick={onRowClick} />
    </PageContent>
  );
};

export default TrackingsPage;
