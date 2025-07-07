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

    // validad el id venta de la url 
    const urlParams = new URLSearchParams(window.location.search);
    const saleId = urlParams.get('saleId');
    if (saleId) {
      // Si hay un saleId en la URL, buscar la venta correspondiente
      // @ts-ignore
      const sale = selectedSale?.id === saleId ? selectedSale : null;
      if (sale) {
        setSelectedSale(sale);
      } else {
        message.error('Venta no encontrada');
        navigate('/billing');
        setBlackBarKey(null);
        return;
      }
    }

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
