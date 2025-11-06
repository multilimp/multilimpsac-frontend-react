import { useState } from 'react';
import { Button, Stack } from '@mui/material';
import PageContent from '@/components/PageContent';
import CompaniesTable from './components/CompaniesTable';
import { CompanyProps } from '@/services/companies/company';
import CompaniesModal from './components/CompaniesModal';
import { ModalStateEnum } from '@/types/global.enum';
import { ModalStateProps } from '@/types/global';
import ConfirmDelete from '@/components/ConfirmDelete';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import CompanyCatalogDrawer from './components/CompanyCatalogDrawer';

const Companies = () => {
  const { companies, loadingCompanies, obtainCompanies } = useGlobalInformation();
  const [modal, setModal] = useState<ModalStateProps<CompanyProps>>(null);

  const handleRecordAction = (mode: ModalStateEnum, data: CompanyProps) => {
    setModal({ mode, data });
  };

  return (
    <PageContent
    >
      <Stack direction="row" spacing={1} justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          onClick={() => setModal({ mode: ModalStateEnum.BOX })}
          sx={{
            backgroundColor: '#161e2a',
            '&:hover': {
              backgroundColor: '#1e2936'
            }
          }}
        >
          Agregar Empresa
        </Button>
      </Stack>
      <CompaniesTable data={companies} loading={loadingCompanies} onRecordAction={handleRecordAction} onReload={obtainCompanies} />

      {modal?.mode === ModalStateEnum.BOX ? (
        <CompaniesModal data={modal.data} handleReload={obtainCompanies} handleClose={() => setModal(null)} />
      ) : null}

      {modal?.mode === ModalStateEnum.DELETE ? (
        <ConfirmDelete endpoint={`/companies/${modal.data?.id}`} handleClose={() => setModal(null)} handleReload={obtainCompanies} />
      ) : null}

      {modal?.mode === ModalStateEnum.DRAWER ? (
        <>
          <CompanyCatalogDrawer handleClose={() => setModal(null)} data={modal.data!} />
        </>
      ) : null}
    </PageContent>
  );
};

export default Companies;
