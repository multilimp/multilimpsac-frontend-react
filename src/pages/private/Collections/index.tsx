import PageContent from '@/components/PageContent';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { useNavigate } from 'react-router-dom';
import CollectionsTable from './components/CollectionsTable';

const CollectionsPage = () => {
  const { sales, loadingSales, obtainSales } = useGlobalInformation();
  const navigate = useNavigate();

  return (
    <PageContent
      title="Cobranzas"
    >
      <CollectionsTable
        data={sales}
        loading={loadingSales}
        onRecordAction={
          (action, data) => {
            if (action === 'DETAILS') {
              // Navegar correctamente usando React Router
              navigate(`/collections/${data.id}`);
            }
          }
        }
        onReload={obtainSales}
      />
    </PageContent>
  );
};

export default CollectionsPage;
