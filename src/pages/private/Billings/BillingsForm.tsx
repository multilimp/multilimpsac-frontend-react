import { Empty, message, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { BlackBarKeyEnum } from '@/types/global.enum';
import BillingFormContent from './components/BillingFormContent';
import { getSaleById } from '@/services/sales/sales.request';

const BillingsForm = () => {
  const { selectedSale, setSelectedSale, setBlackBarKey } = useGlobalInformation();
  const navigate = useNavigate();
  const { saleId } = useParams<{ saleId: string }>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBlackBarKey(BlackBarKeyEnum.OP);

    const loadSale = async () => {
      // Si hay un ID en la ruta, obtener la venta correspondiente
      if (saleId) {
        setLoading(true);
        try {
          const sale = await getSaleById(parseInt(saleId));
          setSelectedSale(sale);
          console.log('Facturación cargada para venta:', sale.codigoVenta);
        } catch (error) {
          message.error('Venta no encontrada');
          navigate('/billing');
          return;
        } finally {
          setLoading(false);
        }
      }
    };

    loadSale();

    return () => {
      setSelectedSale(null);
      setBlackBarKey(null);
    };
  }, [saleId]); // Solo dependemos de saleId para evitar bucles

  // Efecto separado para validar venta cuando no hay saleId
  useEffect(() => {
    if (!saleId && !selectedSale) {
      message.error('Venta no seleccionada para facturación');
      navigate('/billing');
    }
  }, [saleId, selectedSale, navigate]);

  return (
    <Stack direction="column" spacing={2}>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <Spin size="large" tip="Cargando venta..." />
        </div>
      ) : selectedSale ? (
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
