import { useState } from 'react';
import PageContent from '@/components/PageContent';
import { SaleProps } from '@/services/sales/sales';
import { ModalStateProps } from '@/types/global';
import ProviderOrdersTable from './components/ProviderOrdersTable';
import { ModalStateEnum } from '@/types/global.enum';
import ProviderOrdersListDrawer from './components/ProviderOrdersListDrawer';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';

const ProviderOrders = () => {
  const { sales, loadingSales } = useGlobalInformation();
  const [modal, setModal] = useState<ModalStateProps<SaleProps>>(null);

  return (
    <PageContent>
      <ProviderOrdersTable loading={loadingSales} data={sales} onRowClick={(sale) => setModal({ mode: ModalStateEnum.BOX, data: sale })} />

      {modal?.mode === ModalStateEnum.BOX && <ProviderOrdersListDrawer handleClose={() => setModal(null)} data={modal.data!} />}
    </PageContent>
  );
};

export default ProviderOrders;
