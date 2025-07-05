import { useState } from 'react';
import PageContent from '@/components/PageContent';
import { SaleProps } from '@/services/sales/sales';
import { ModalStateProps } from '@/types/global';
import { ModalStateEnum } from '@/types/global.enum';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import TreasurysTable from './components/TreasurysTable';
import ProviderOrdersListDrawer from '../ProviderOrders/components/ProviderOrdersListDrawer';

const Treasury = () => {
  const { sales, loadingSales } = useGlobalInformation();
  const [modal, setModal] = useState<ModalStateProps<SaleProps>>(null);

  return (
    <PageContent>
      <TreasurysTable loading={loadingSales} data={sales} onRowClick={(sale) => setModal({ mode: ModalStateEnum.BOX, data: sale })} />

      {modal?.mode === ModalStateEnum.BOX && <ProviderOrdersListDrawer handleClose={() => setModal(null)} data={modal.data!} />}
    </PageContent>
  );
};

export default Treasury;
