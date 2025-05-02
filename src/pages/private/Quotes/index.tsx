
import PageContent from '@/components/PageContent';
import QuotesTable from './components/QuotesTable';
import { useEffect, useState } from 'react';
import { QuoteProps } from '@/services/quotes/quotes';
import { notification } from 'antd';
import { getQuotes } from '@/services/quotes/quotes.request';
import { Button, Box } from '@mui/material';
import QuotesModal from './components/QuotesModal';
import { ModalStateEnum } from '@/types/global.enum';
import { Add, Refresh } from '@mui/icons-material';

type ModalStateType = null | {
  mode: ModalStateEnum;
  data: null | QuoteProps;
};

const QuotesPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<QuoteProps[]>([]);
  const [modal, setModal] = useState<ModalStateType>(null);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await getQuotes();
      // Verificar que la respuesta sea un array antes de asignarla
      if (Array.isArray(response)) {
        setData(response);
      } else {
        console.error('La respuesta de getQuotes no es un array:', response);
        setData([]);
        notification.error({
          message: 'Error al obtener cotizaciones',
          description: 'El formato de datos recibido no es válido.',
        });
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
      notification.error({
        message: 'Error al obtener cotizaciones',
        description: `Detalles: ${error instanceof Error ? error.message : String(error)}`,
      });
      setData([]); // Garantizar que data siempre sea un array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleRefresh = () => {
    fetchQuotes();
  };

  const handleEdit = (quote: QuoteProps) => {
    setModal({ mode: ModalStateEnum.BOX, data: quote });
  };

  return (
    <PageContent
      title="Gestión de Cotizaciones"
      helper="DIRECTORIO / COTIZACIONES"
      component={
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<Add />}
            onClick={() => setModal({ mode: ModalStateEnum.BOX, data: null })}
            sx={{
              px: 3,
              py: 1.25,
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            Nueva Cotización
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            sx={{ borderRadius: 2 }}
          >
            Actualizar
          </Button>
        </Box>
      }
    >
      <QuotesTable 
        data={data} 
        loading={loading} 
        onEdit={handleEdit}
        onRefresh={handleRefresh}
      />

      {modal?.mode === ModalStateEnum.BOX && (
        <QuotesModal 
          data={modal.data} 
          open={true}
          onClose={() => setModal(null)}
          onSuccess={handleRefresh}
        />
      )}
    </PageContent>
  );
};

export default QuotesPage;
