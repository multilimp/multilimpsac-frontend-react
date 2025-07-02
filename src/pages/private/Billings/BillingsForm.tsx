import { Empty, message } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { BlackBarKeyEnum } from '@/types/global.enum';
import BillingFormContent from './components/BillingFormContent';

const BillingsForm = () => {
  const { selectedSale, setSelectedSale, setBlackBarKey } = useGlobalInformation();
  const navigate = useNavigate();

  useEffect(() => {
    setBlackBarKey(BlackBarKeyEnum.OP);
    if (!selectedSale) {
      message.error('Venta no seleccionada para facturación');
      navigate('/billing');
      setBlackBarKey(null);
      return;
    }

    console.log('Facturación cargada para venta:', selectedSale.codigoVenta);

    return () => {
      setSelectedSale(null);
      setBlackBarKey(null);
    };
  }, [selectedSale, navigate, setSelectedSale, setBlackBarKey]);

  return (
    <Stack direction="column" spacing={2}>
      {selectedSale ? (
        <BillingFormContent sale={selectedSale} />
      ) : (
        <Empty 
          description="No hay datos de facturación disponibles"
          style={{ marginTop: '2rem' }}
        />
      )}
    </Stack>
  );
};

export default BillingsForm;
