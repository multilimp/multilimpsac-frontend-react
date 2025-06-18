import { useState } from 'react';
import PageContent from '@/components/PageContent';
import SalesTable from './components/SalesTable';
import { SaleProcessedProps, SaleProps } from '@/services/sales/sales';
import { Button } from '@mui/material';
import { ModalStateEnum } from '@/types/global.enum';
import { Add } from '@mui/icons-material';
import { ModalStateProps } from '@/types/global';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import ConfirmDelete from '@/components/ConfirmDelete';
import SalesDetails from './components/SalesDetails';
import { Link } from 'react-router-dom';

type ModalStateType = ModalStateProps<SaleProps> & { processed?: SaleProcessedProps };

const SalesPage = () => {
  const { sales, obtainSales, loadingSales } = useGlobalInformation();
  const [modal, setModal] = useState<ModalStateType>();

  const closeModal = () => setModal(undefined);

  return (
    <PageContent
      component={
        <Button variant="contained" color="primary" startIcon={<Add />} component={Link} to="/sales/create">
          Agregar Venta
        </Button>
      }
    >
      <SalesTable data={sales} loading={loadingSales} onRecordAction={(mode, data) => setModal({ mode, data })} />

      {modal?.mode === ModalStateEnum.DELETE ? (
        <ConfirmDelete endpoint={`/ventas/${modal.data?.id}`} handleClose={closeModal} handleReload={obtainSales} />
      ) : null}

      {modal?.mode === ModalStateEnum.DETAILS && (
        <SalesDetails data={modal.data!} handleClose={closeModal} />
      )}
    </PageContent>
  );
};

export default SalesPage;
