import { Empty, message } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import TrackingFormContent from './TrackingFormContent';
import { BlackBarKeyEnum } from '@/types/global.enum';

const TrackingOrderForm = () => {
  const { selectedSale, setSelectedSale, setBlackBarKey } = useGlobalInformation();
  const navigate = useNavigate();

  useEffect(() => {
    setBlackBarKey(BlackBarKeyEnum.SEGUIMIENTO);
    if (!selectedSale) {
      message.error('Venta no seleccionada para seguimiento');
      navigate('/tracking');
      setBlackBarKey(null);
      return;
    }

    return () => {
      setSelectedSale(null);
      setBlackBarKey(null);
    };
  }, [selectedSale, navigate, setSelectedSale, setBlackBarKey]);

  return (
    <Stack direction="column" spacing={2}>
      {selectedSale ? <TrackingFormContent sale={selectedSale} /> : <Empty />}
    </Stack>
  );
};

export default TrackingOrderForm;
