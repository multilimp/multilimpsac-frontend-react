import { Empty, message } from 'antd';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardHeader, Stack } from '@mui/material';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import ProviderOrderFormContent from './components/ProviderOrderFormContent';

const ProviderOrderForm = () => {
  const { selectedSale, setSelectedSale } = useGlobalInformation();
  const { saleId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedSale) {
      message.error('Venta no seleccionada');
      navigate('/provider-orders');
      return;
    }

    return () => {
      setSelectedSale(null);
    };
  }, [selectedSale]);

  return (
    <Stack direction="column" spacing={2}>
      <Card>
        <CardHeader title={`${saleId ? 'Actualizar' : 'Crear'} Órden de Proveedor`} slotProps={{ title: { fontWeight: 700, fontSize: 24 } }} />
      </Card>

      {selectedSale ? <ProviderOrderFormContent sale={selectedSale} /> : <Empty />}
    </Stack>
  );
};

export default ProviderOrderForm;
