import { Empty, message } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import TrackingFormContent from './components/TrackingFormContent';
import { BlackBarKeyEnum } from '@/types/global.enum';

const TrackingForm = () => {
  const { selectedSale, setSelectedSale, setBlackBarKey } = useGlobalInformation();
  const navigate = useNavigate();

  useEffect(() => {
    setBlackBarKey(BlackBarKeyEnum.OP);
    if (!selectedSale) {
      message.error('Venta no seleccionada para seguimiento');
      navigate('/tracking');
      setBlackBarKey(null);
      return;
    }

    console.log('Seguimiento cargado para venta:', selectedSale.codigoVenta);

    return () => {
      setSelectedSale(null);
      setBlackBarKey(null);
    };
  }, [selectedSale, navigate, setSelectedSale, setBlackBarKey]);

  return (
    <Stack direction="column" spacing={2}>
      {selectedSale ? (
        <TrackingFormContent sale={selectedSale} />
      ) : (
        <Empty 
          description="No hay datos de seguimiento disponibles"
          style={{ marginTop: '2rem' }}
        />
      )}
    </Stack>
  );
};

export default TrackingForm;
