import PageContent from '@/components/PageContent';
import QuotesTable from './components/QuotesTable';
import { useEffect, useState } from 'react';
import { QuoteProps } from '@/services/quotes/quotes';
import { notification } from 'antd';
import { getQuotes } from '@/services/quotes/quotes.request';
import { Button } from '@mui/material';
import QuotesModal from './components/QuotesModal';
import { ModalStateEnum } from '@/types/global.enum';

type ModalStateType = null | {
  mode: ModalStateEnum;
  data: null | QuoteProps;
};

const QuotesPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Array<QuoteProps>>([]);
  const [modal, setModal] = useState<ModalStateType>(null);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await getQuotes();
      setData(response ?? []);
    } catch (error) {
      notification.error({
        message: 'Error al obtener cotizaciones',
        description: `Detalles: ${error instanceof Error ? error.message : String(error)}`,
      });
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
        <Button 
          variant="contained" 
          onClick={() => setModal({ mode: ModalStateEnum.BOX, data: null })}
        >
          Nueva Cotización
        </Button>
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