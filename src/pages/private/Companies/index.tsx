import { useState } from 'react';
import PageContent from '@/components/PageContent';
import CompaniesTable from './components/CompaniesTable';
import { CompanyProps } from '@/services/companies/company';
import { Button } from '@mui/material';
import CompaniesModal from './components/CompaniesModal';
import { ModalStateEnum } from '@/types/global.enum';
import { ModalStateProps } from '@/types/global';
import ConfirmDelete from '@/components/ConfirmDelete';
import useCompanies from '@/hooks/useCompanies';

const Companies = () => {
  const { companies, loadingCompanies, obtainCompanies } = useCompanies();
  const [modal, setModal] = useState<ModalStateProps<CompanyProps>>(null);

  return (
    <PageContent component={<Button onClick={() => setModal({ mode: ModalStateEnum.BOX })}>Agregar</Button>}>
      <CompaniesTable data={companies} loading={loadingCompanies} onRecordAction={(mode, data) => setModal({ mode, data })} />

      {modal?.mode === ModalStateEnum.BOX ? (
        <CompaniesModal data={modal.data} handleReload={obtainCompanies} handleClose={() => setModal(null)} />
      ) : null}

      {modal?.mode === ModalStateEnum.DELETE ? (
        <ConfirmDelete endpoint={`/companies/${modal.data?.id}`} handleClose={() => setModal(null)} handleReload={obtainCompanies} />
      ) : null}
    </PageContent>
  );
};

export default Companies;
