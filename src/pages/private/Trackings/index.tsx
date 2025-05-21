import PageContent from '@/components/PageContent';
import TrackingsTable from './components/TrackingsTable';
import { SaleProps } from '@/services/sales/sales';
import { useNavigate } from 'react-router-dom';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';

const TrackingsPage = () => {
  const router = useNavigate();
  const { sales, loadingSales } = useGlobalInformation();

  const onRowClick = (data: SaleProps) => {
    console.log('Row clicked', data);
    router('/tracking/' + data.id);
  };

  return (
    <PageContent>
      <TrackingsTable data={sales} loading={loadingSales} onRowClick={onRowClick} />
    </PageContent>
  );
};

export default TrackingsPage;
