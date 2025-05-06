
import PageContent from '@/components/PageContent';
import SalesTable from './components/SalesTable';
import { useEffect, useState } from 'react';
import { SaleProps } from '@/services/sales/sales';
import { notification } from 'antd';
import { getSales } from '@/services/sales/sales.request';
import { Box, Button, Typography } from '@mui/material';
import SalesModal from './components/SalesModal';
import OcrSalesModal from './components/OcrSalesModal';
import { ModalStateEnum } from '@/types/global.enum';
import { Add, SmartToy } from '@mui/icons-material';

type ModalStateType = null | {
  mode: ModalStateEnum;
  data: null | SaleProps;
};

const SalesPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SaleProps[]>([]);
  const [modal, setModal] = useState<ModalStateType>(null);
  const [ocrModal, setOcrModal] = useState(false);
  const [ocrData, setOcrData] = useState<Partial<SaleProps> | undefined>(undefined);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await getSales();
      // Verificar que la respuesta sea un array antes de asignarla
      if (Array.isArray(response)) {
        setData(response);
      } else {
        console.error('La respuesta de getSales no es un array:', response);
        setData([]);
        notification.error({
          message: 'Error al obtener ventas',
          description: 'El formato de datos recibido no es válido.',
        });
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
      notification.error({
        message: 'Error al obtener ventas',
        description: `Detalles: ${error instanceof Error ? error.message : String(error)}`,
      });
      setData([]); // Garantizar que data siempre sea un array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleRefresh = () => {
    fetchSales();
  };

  const handleEdit = (sale: SaleProps) => {
    setModal({ mode: ModalStateEnum.BOX, data: sale });
  };
  
  const handleOcrSuccess = (extractedData: Partial<SaleProps>) => {
    setOcrModal(false);
    setOcrData(extractedData);
    // Abre el modal de ventas con los datos pre-cargados
    setModal({ mode: ModalStateEnum.BOX, data: null });
  };
  
  const handleCloseModal = () => {
    setModal(null);
    // También limpia los datos de OCR cuando cerramos el modal
    setOcrData(undefined);
  };

  return (
    <PageContent
      title="Gestión de Ventas"
      helper="DIRECTORIO / VENTAS"
      component={
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<Add />}
            onClick={() => {
              setOcrData(undefined);
              setModal({ mode: ModalStateEnum.BOX, data: null });
            }}
            sx={{
              px: 3,
              py: 1.25,
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            Agregar Venta
          </Button>
          <Button 
            variant="outlined" 
            color="secondary"
            startIcon={<SmartToy />}
            onClick={() => setOcrModal(true)}
            sx={{
              px: 3,
              py: 1.25,
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            Agregar OC con IA
          </Button>
        </Box>
      }
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600} color="primary.main" sx={{ mb: 1 }}>
          Dashboard de Ventas
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
          <Box sx={{ bgcolor: 'primary.light', p: 2, borderRadius: 2, color: 'white' }}>
            <Typography variant="h5" fontWeight={700}>
              {data.length}
            </Typography>
            <Typography variant="body2">Total de Ventas</Typography>
          </Box>
          <Box sx={{ bgcolor: 'secondary.main', p: 2, borderRadius: 2, color: 'white' }}>
            <Typography variant="h5" fontWeight={700}>
              {formatCurrency(data.reduce((sum, sale) => sum + sale.total, 0))}
            </Typography>
            <Typography variant="body2">Monto Total</Typography>
          </Box>
          <Box sx={{ bgcolor: '#fb9c0c', p: 2, borderRadius: 2, color: 'white' }}>
            <Typography variant="h5" fontWeight={700}>
              {data.filter(sale => sale.status === 'pending').length}
            </Typography>
            <Typography variant="body2">Ventas Pendientes</Typography>
          </Box>
          <Box sx={{ bgcolor: '#04BA6B', p: 2, borderRadius: 2, color: 'white' }}>
            <Typography variant="h5" fontWeight={700}>
              {data.filter(sale => sale.status === 'completed').length}
            </Typography>
            <Typography variant="body2">Ventas Completadas</Typography>
          </Box>
        </Box>
      </Box>

      <SalesTable 
        data={data} 
        loading={loading} 
        onEdit={handleEdit}
        onRefresh={handleRefresh}
      />

      {modal?.mode === ModalStateEnum.BOX && (
        <SalesModal 
          data={modal.data} 
          open={true}
          onClose={handleCloseModal}
          onSuccess={handleRefresh}
          initialData={ocrData}
        />
      )}
      
      <OcrSalesModal
        open={ocrModal}
        onClose={() => setOcrModal(false)}
        onSuccess={handleOcrSuccess}
      />
    </PageContent>
  );
};

// Helper function to format currency (in case it's not imported)
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(amount);
};

export default SalesPage;
