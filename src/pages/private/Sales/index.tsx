import { useEffect, useState } from 'react';
import PageContent from '@/components/PageContent';
import SalesTable from './components/SalesTable';
import { SaleProcessedProps, SaleProps } from '@/services/sales/sales';
import { Box, Button, Card, CardHeader, Grid, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import SalesModal from './components/SalesModal';
import OcrSalesModal from './components/OcrSalesModal';
import { ModalStateEnum } from '@/types/global.enum';
import { Add, Close, Loop, SmartToy } from '@mui/icons-material';
import { ModalStateProps } from '@/types/global';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import ConfirmDelete from '@/components/ConfirmDelete';
import SalesDetails from './components/SalesDetails';

type ModalStateType = ModalStateProps<SaleProps> & { processed?: SaleProcessedProps };

const SalesPage = () => {
  const { sales, obtainSales, resumeSalesData, loadingSales } = useGlobalInformation();
  const [backup, setBackup] = useState<Array<SaleProps>>([]);
  const [modal, setModal] = useState<ModalStateType>();
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    setBackup([...sales]);
  }, [sales]);

  const closeModal = () => setModal(undefined);

  const normalize = (val: string | number) => val.toString().toLowerCase();

  const handleFilter = (raw: string) => {
    setValue(raw);
    const val = normalize(raw);

    const filteredSales = sales.filter((sale) => {
      const finder =
        normalize(sale.codigoVenta).includes(val) ||
        normalize(sale.cliente.razonSocial).includes(val) ||
        normalize(sale.cliente.ruc).includes(val) ||
        normalize(sale.empresa.razonSocial).includes(val) ||
        normalize(sale.empresa.ruc).includes(val) ||
        normalize(sale.siaf).includes(val);
      return finder;
    });

    setBackup([...filteredSales]);
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
        <Grid container spacing={2} my={2} justifyContent="space-between">
          <Grid>
            <TextField
              value={value}
              onChange={(event) => handleFilter(event.target.value)}
              label="Buscar..."
              variant="filled"
              sx={{ minWidth: 400 }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton color="error" onClick={() => handleFilter('')}>
                        <Close />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid>
            <Button variant="outlined" color="primary" startIcon={<Loop />} onClick={obtainSales}>
              Actualizar
            </Button>
          </Grid>
        </Grid>

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

      <SalesTable data={backup} loading={loadingSales} onRecordAction={(mode, data) => setModal({ mode, data })} />

      {modal?.mode === ModalStateEnum.BOX && (
        <SalesModal data={modal.data} processed={modal.processed} handleClose={closeModal} handleReload={obtainSales} />
      )}

      {modal?.mode === ModalStateEnum.SECOND_BOX && (
        <OcrSalesModal onClose={closeModal} onSuccess={(aux) => setModal({ mode: ModalStateEnum.BOX, processed: aux })} />
      )}

      {modal?.mode === ModalStateEnum.DELETE ? (
        <ConfirmDelete endpoint={`/ventas/${modal.data?.id}`} handleClose={closeModal} handleReload={obtainSales} />
      ) : null}

      {modal?.mode === ModalStateEnum.DETAILS && (
        <SalesDetails data={modal.data!} handleClose={closeModal} handleEdit={(data) => setModal({ mode: ModalStateEnum.BOX, data })} />
      )}
    </PageContent>
  );
};

export default SalesPage;
