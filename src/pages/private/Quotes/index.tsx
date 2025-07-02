// src/pages/Quotes/QuotesPage.tsx
import PageContent from '@/components/PageContent';
import QuotesTable from './components/QuotesTable';
import QuotesModal from './components/QuotesModal';
import { useEffect, useState } from 'react';
import { CotizacionProps } from '@/types/cotizacion.types';
import { getCotizaciones } from '@/services/quotes/quotes.request';
import { notification } from 'antd';
import { Box, Button } from '@mui/material';
import { ModalStateEnum } from '@/types/global.enum';
import { Add, Refresh } from '@mui/icons-material';

type ModalStateType = { mode: ModalStateEnum; data: CotizacionProps | null } | null;

const QuotesPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CotizacionProps[]>([]);
  const [modal, setModal] = useState<ModalStateType>(null);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const res = await getCotizaciones();
      setData(res);
    } catch (error) {
      notification.error({
        message: 'Error al obtener cotizaciones',
        description: String(error),
      });
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  return (
    <PageContent
      title="Gestión de Cotizaciones"
      helper="DIRECTORIO / COTIZACIONES"
      component={
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setModal({ mode: ModalStateEnum.BOX, data: null })}
          >
            Nueva Cotización
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchQuotes}
          >
            Actualizar
          </Button>
        </Box>
      }
    >
      <QuotesTable
        data={data}
        loading={loading}
        onEdit={(quote) => setModal({ mode: ModalStateEnum.BOX, data: quote })}
      />

      {modal?.mode === ModalStateEnum.BOX && (
        <QuotesModal
          data={modal.data}
          open
          onClose={() => setModal(null)}
          onSuccess={fetchQuotes}
        />
      )}
    </PageContent>
  );
};

export default QuotesPage;
