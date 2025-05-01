import PageContent from '@/components/PageContent';
import CompaniesTable from './components/CompaniesTable';
import { useEffect, useState } from 'react';
import { CompanyProps } from '@/services/companies/company';
import { notification } from 'antd';
import { getCompanies } from '@/services/companies/company.requests';
import { Button } from '@mui/material';
import CompaniesModal from './components/CompaniesModal';
import { ModalStateEnum } from '@/types/global.enum';

type ModalStateType = null | {
  mode: ModalStateEnum;
  data: null | CompanyProps;
};

const Companies = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Array<CompanyProps>>([]);
  const [modal, setModal] = useState<ModalStateType>(null);

  useEffect(() => {
    obtainCompanies();
  }, []);

  const obtainCompanies = async () => {
    try {
      setLoading(true);
      // const res = await getCompanies();
      // setData([...res]);

      setData([
        {
          departamento: 'Huancayo',
          direccion: 'Av Huancavelica nro 438 - El Tambo',
          distrito: 'El Tambo',
          email: 'empresa@empresa.com',
          id: 1,
          logo: 'https://png.pngtree.com/png-clipart/20190613/original/pngtree-instagram-icon-logo-png-image_3560504.jpg',
          provincia: 'Huancayo',
          razon_social: 'Instagram INC',
          ruc: '20243434332',
          telefono: '904023423',
          web: 'https://google.com',
        },
      ]);
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
    <PageContent
      title="Empresas"
      helper="DIRECTORIO / EMPRESAS"
      component={<Button onClick={() => setModal({ data: null, mode: ModalStateEnum.BOX })}>Agregar</Button>}
    >
      <CompaniesTable data={data} loading={loading} />

      {modal?.mode === ModalStateEnum.BOX ? <CompaniesModal data={modal.data} handleClose={() => setModal(null)} /> : null}
    </PageContent>
  );
};

export default Companies;
