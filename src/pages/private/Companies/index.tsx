import { useState } from 'react';
import { Box, Tab, Tabs, Button } from '@mui/material';
import PageContent from '@/components/PageContent';
import CompaniesTable from './components/CompaniesTable';
import { CompanyProps } from '@/services/companies/company';
import CompaniesModal from './components/CompaniesModal';
import { ModalStateEnum } from '@/types/global.enum';
import { ModalStateProps } from '@/types/global';
import ConfirmDelete from '@/components/ConfirmDelete';
// import CatalogsTab from '@/components/tabs/CatalogsTab';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`company-tabpanel-${index}`} aria-labelledby={`company-tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Companies = () => {
  const { companies, loadingCompanies, obtainCompanies } = useGlobalInformation();
  const [modal, setModal] = useState<ModalStateProps<CompanyProps>>(null);
  const [selectedCompany, setSelectedCompany] = useState<CompanyProps | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCompanySelect = (company: CompanyProps) => {
    setSelectedCompany(company);
    setTabValue(1); // Switch to catalogs tab when company is selected
  };

  return (
    <PageContent component={<Button onClick={() => setModal({ mode: ModalStateEnum.BOX })}>Agregar Empresa</Button>}>
      {selectedCompany ? (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleChangeTab}>
              <Tab label="Volver a Empresas" />
              <Tab label="Catálogos" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <CompaniesTable
              data={companies}
              loading={loadingCompanies}
              onRecordAction={(mode, data) => setModal({ mode, data })}
              onSelectCompany={handleCompanySelect}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 3 }}>
              <h2>{selectedCompany.razonSocial}</h2>
              <p>RUC: {selectedCompany.ruc}</p>
            </Box>
            {/* <CatalogsTab companyId={selectedCompany.id} /> */}
          </TabPanel>
        </>
      ) : (
        <CompaniesTable
          data={companies}
          loading={loadingCompanies}
          onRecordAction={(mode, data) => setModal({ mode, data })}
          onSelectCompany={handleCompanySelect}
        />
      )}

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
