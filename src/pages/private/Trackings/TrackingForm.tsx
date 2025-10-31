import { Empty, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import TrackingFormContent from './components/TrackingFormContent';
import { BlackBarKeyEnum } from '@/types/global.enum';
import { getSaleById } from '@/services/sales/sales.request';
import { SaleProps } from '@/services/sales/sales';
import { Spin } from 'antd/lib';

const TrackingForm = () => {
  const { setBlackBarKey, setSelectedSale } = useGlobalInformation();
  const navigate = useNavigate();
  const { trackingId } = useParams<{ trackingId: string }>();
  const [sale, setSale] = useState<SaleProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Activar BlackBar inmediatamente al cargar el componente
    setBlackBarKey(BlackBarKeyEnum.OP);

    const loadSale = async () => {
      if (!trackingId) {
        navigate('/tracking');
        return;
      }

      try {
        setLoading(true);
        const saleData = await getSaleById(parseInt(trackingId));

        if (saleData) {
          setSale(saleData);
          setSelectedSale(saleData);
        } else {
          message.error('No se encontró la venta');
          navigate('/tracking');
        }
      } catch (error) {
        console.error('Error loading sale:', error);
        message.error('No se pudo cargar la venta');
        navigate('/tracking');
      } finally {
        setLoading(false);
      }
    };

    loadSale();

    return () => {
      setBlackBarKey(null);
      setSelectedSale(null);
    };
  }, [trackingId, navigate, setBlackBarKey, setSelectedSale]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Stack direction="column" spacing={2}>
      {sale ? (
        <TrackingFormContent sale={sale} />
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
