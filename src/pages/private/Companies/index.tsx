import PageContent from '@/components/PageContent';
import CompaniesTable from './components/CompaniesTable';
import { useEffect, useState } from 'react';
import { CompanyProps } from '@/services/companies/company';
import { notification } from 'antd';
import { getCompanies } from '@/services/companies/company.requests';
import { Button } from '@mui/material';
import CompaniesModal from './components/CompaniesModal';
import { ModalStateEnum } from '@/types/global.enum';
import { ModalStateProps } from '@/types/global';
import ConfirmDelete from '@/components/ConfirmDelete';

const Companies = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Array<CompanyProps>>([]);
  const [modal, setModal] = useState<ModalStateProps<CompanyProps>>(null);

  useEffect(() => {
    obtainData();
  }, []);

  const obtainData = async () => {
    try {
      setLoading(true);
      // const res = await getCompanies();
      // setData([...res]);

      const generatedData = Array.from(Array(500).keys()).map((id) => ({
        id,
        departamento: '04',
        direccion: 'Av Tacna nro 438',
        distrito: '040504',
        email: 'empresa@empresa.com',
        logo: 'https://png.pngtree.com/png-clipart/20190613/original/pngtree-instagram-icon-logo-png-image_3560504.jpg',
        provincia: '0405',
        razon_social: `Instagram INC ${id}`,
        ruc: '20243434332',
        telefono: '904023423',
        web: 'https://google.com',
      }));

      setData([...generatedData]);
    } catch (error) {
      notification.error({
        message: 'Ocurrió un error inesperado',
        description: `No se pudo obtener el listado de empresas. ${String(error)}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContent component={<Button onClick={() => setModal({ mode: ModalStateEnum.BOX })}>Agregar</Button>}>
      <CompaniesTable data={data} loading={loading} onRecordAction={(mode, data) => setModal({ mode, data })} />

      {modal?.mode === ModalStateEnum.BOX ? <CompaniesModal data={modal.data} handleReload={obtainData} handleClose={() => setModal(null)} /> : null}

      {modal?.mode === ModalStateEnum.DELETE ? (
        <ConfirmDelete endpoint={`/companies/${modal.data?.id}`} handleClose={() => setModal(null)} handleReload={obtainData} />
      ) : null}
    </PageContent>
  );
};

export default Companies;
