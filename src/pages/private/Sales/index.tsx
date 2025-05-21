import { useState } from 'react';
import PageContent from '@/components/PageContent';
import SalesTable from './components/SalesTable';
import { SaleProcessedProps, SaleProps } from '@/services/sales/sales';
import { Box, Button, Card, CardHeader, Grid, Stack, TextField, Typography } from '@mui/material';
import SalesModal from './components/SalesModal';
import OcrSalesModal from './components/OcrSalesModal';
import { ModalStateEnum } from '@/types/global.enum';
import { Add, Loop, SmartToy } from '@mui/icons-material';
import { ModalStateProps } from '@/types/global';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';

type ModalStateType = ModalStateProps<SaleProps> & { processed?: SaleProcessedProps };

const SalesPage = () => {
  const { sales, obtainSales, resumeSalesData, loadingSales } = useGlobalInformation();
  const [modal, setModal] = useState<ModalStateType>();

  const handleEdit = (sale: SaleProps) => {
    setModal({ mode: ModalStateEnum.BOX, data: sale });
  };

  return (
    <PageContent
      component={
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => setModal({ mode: ModalStateEnum.BOX })}>
            Agregar Venta
          </Button>
          <Button variant="outlined" color="secondary" startIcon={<SmartToy />} onClick={() => setModal({ mode: ModalStateEnum.SECOND_BOX })}>
            Agregar OC con IA
          </Button>
        </Stack>
      }
    >
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <TextField label="Buscar..." variant="filled" sx={{ minWidth: 400 }} />

          <Button variant="outlined" color="primary" startIcon={<Loop />} onClick={obtainSales}>
            Actualizar
          </Button>
        </Stack>
        {/* <Grid container spacing={2}>
          <Grid>
            <TextField label="Buscar..." variant="filled" sx={{ minWidth: 400 }} />
          </Grid>
          <Grid>
            <Button variant="outlined" color="primary" startIcon={<Loop />} onClick={obtainSales}>
              Actualizar
            </Button>
          </Grid>
        </Grid> */}

        <Grid container spacing={2}>
          {resumeSalesData.map((item) => (
            <Grid key={item.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardHeader
                  title={item.value}
                  subheader={item.label}
                  slotProps={{ title: { color: '#fff', fontSize: 18, fontWeight: 700 }, subheader: { color: '#fff' } }}
                  sx={{ bgcolor: item.color, pt: 2 }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <SalesTable data={sales} loading={loadingSales} onEdit={handleEdit} />

      {modal?.mode === ModalStateEnum.BOX && (
        <SalesModal data={modal.data} processed={modal.processed} handleClose={() => setModal(undefined)} handleReload={obtainSales} />
      )}

      {modal?.mode === ModalStateEnum.SECOND_BOX && (
        <OcrSalesModal onClose={() => setModal(undefined)} onSuccess={(aux) => setModal({ mode: ModalStateEnum.BOX, processed: aux })} />
      )}
    </PageContent>
  );
};

export default SalesPage;
