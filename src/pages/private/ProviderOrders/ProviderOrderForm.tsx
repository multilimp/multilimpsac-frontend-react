import { Empty, message } from 'antd';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import ProviderOrderFormContent from './components/ProviderOrderFormContent';
import { BlackBarKeyEnum } from '@/types/global.enum';

const ProviderOrderForm = () => {
  const { selectedSale, setSelectedSale, setBlackBarKey } = useGlobalInformation();
  const { saleId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setBlackBarKey(BlackBarKeyEnum.OP);
    if (!selectedSale) {
      message.error('Venta no seleccionada');
      navigate('/provider-orders');
      setBlackBarKey(null);
      return;
    }

    return () => {
      setSelectedSale(null);
      setBlackBarKey(null);
    };
  }, [selectedSale]);

  return (
    <Stack direction="column" spacing={2}>
      {selectedSale ? <ProviderOrderFormContent sale={selectedSale} /> : <Empty />}
    </Stack>
  );
};

export default ProviderOrderForm;
