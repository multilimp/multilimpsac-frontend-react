import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  Card,
  CardHeader,
  CardContent,
  Fab,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Collapse,
  Box,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import { Close, Edit, KeyboardArrowUp, KeyboardArrowDown, PictureAsPdf } from '@mui/icons-material';
import { TrackingProps } from '@/services/trackings/trackings.d';
import { formatCurrency, formattedDate } from '@/utils/functions';

interface TrackingsDetailsProps {
  handleClose: VoidFunction;
  data: TrackingProps;
}

const defaultText = '—';

const statusLabels: Record<TrackingProps['status'], string> = {
  pending: 'Pendiente',
  in_progress: 'En Progreso',
  delivered: 'Entregado',
  canceled: 'Cancelado',
};

const statusColors: Record<TrackingProps['status'], 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  pending: 'warning',
  in_progress: 'info',
  delivered: 'success',
  canceled: 'error',
};

const TrackingsDetails = ({ handleClose, data }: TrackingsDetailsProps) => {
  const navigate = useNavigate();
  
  const handleEditClick = () => {
    navigate(`/tracking/${data.id}`);
  };

  const {
    id,
    saleId,
    clientRuc,
    companyRuc,
    companyBusinessName,
    clientName,
    maxDeliveryDate,
    saleAmount,
    cue,
    department,
    oce,
    ocf,
    peruPurchases,
    grr,
    invoiceNumber,
    isRefact,
    peruPurchasesDate,
    deliveryDateOC,
    utility,
    status,
  } = data;

  return (
    <Drawer anchor="right" open onClose={handleClose}>
      <Card sx={{ borderRadius: 0, width: { xs: '100%', sm: 500 } }} variant="outlined">
        <CardHeader
          title="DETALLE DEL SEGUIMIENTO"
          subheader={`Seguimiento ID: ${id} | OC: ${saleId}`}
          slotProps={{ title: { fontWeight: 700, fontSize: 20 }, subheader: { fontWeight: 600 } }}
          action={
            <Fab color="error" size="small">
              <Close onClick={handleClose} />
            </Fab>
          }
          avatar={
            <Fab color="warning" size="small">
              <Edit onClick={handleEditClick} />
            </Fab>
          }
        />
        <CardContent sx={{ height: 'calc((100vh) - 110px)', overflow: 'auto', pt: 0 }}>
          <Stack spacing={2}>
            {/* Estado del seguimiento */}
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Chip 
                label={statusLabels[status]} 
                color={statusColors[status]}
                variant="filled"
              />
            </Box>

            {/* Información del Cliente */}
            <CardList
              title="Información del Cliente"
              data={[
                { label: 'Razón Social', value: clientName || defaultText },
                { label: 'RUC', value: clientRuc || defaultText },
                { label: 'CUE', value: cue || defaultText },
              ]}
            />

            {/* Información de la Empresa */}
            <CardList
              title="Información de la Empresa"
              data={[
                { label: 'Razón Social', value: companyBusinessName || defaultText },
                { label: 'RUC', value: companyRuc || defaultText },
              ]}
            />

            {/* Información Comercial */}
            <CardList
              title="Información Comercial"
              data={[
                { label: 'Monto de Venta', value: formatCurrency(saleAmount) },
                { label: 'Fecha Máx. Entrega', value: formattedDate(maxDeliveryDate) || defaultText },
                { label: 'Departamento', value: department || defaultText },
                { label: 'Utilidad (%)', value: utility ? `${utility}%` : defaultText },
              ]}
            />

            {/* Documentos */}
            <CardList
              title="Documentos"
              data={[
                { 
                  label: 'OCE', 
                  value: oce ? 'Ver PDF' : defaultText,
                  link: Boolean(oce)
                },
                { 
                  label: 'OCF', 
                  value: ocf ? 'Ver PDF' : defaultText,
                  link: Boolean(ocf)
                },
                { label: 'GRR', value: grr || defaultText },
                { label: 'Número de Factura', value: invoiceNumber || defaultText },
              ]}
            />

            {/* Información de Fechas */}
            <CardList
              title="Fechas Importantes"
              data={[
                { label: 'Fecha Perú Compras', value: peruPurchasesDate ? formattedDate(peruPurchasesDate) : defaultText },
                { label: 'Fecha Entrega OC', value: deliveryDateOC ? formattedDate(deliveryDateOC) : defaultText },
              ]}
            />

            {/* Estados y Validaciones */}
            <CardList
              title="Estados y Validaciones"
              data={[
                { label: 'Perú Compras', value: peruPurchases ? 'Sí' : 'No' },
                { label: 'Refacturación', value: isRefact ? 'Sí' : 'No' },
                { label: 'Estado', value: statusLabels[status] },
              ]}
            />
          </Stack>
        </CardContent>
      </Card>
    </Drawer>
  );
};

export default TrackingsDetails;

const CardList = ({ title, data }: { title: string; data: Array<{ label: string; value: string; link?: boolean }> }) => {
  const [open, setOpen] = useState(true);
  return (
    <Card variant="outlined">
      <CardHeader
        title={title}
        sx={{ pt: 2, borderBottom: open ? '1px solid #ddd' : '' }}
        action={
          <IconButton onClick={() => setOpen(!open)} size="small">
            {open ? <KeyboardArrowUp fontSize="large" /> : <KeyboardArrowDown fontSize="large" />}
          </IconButton>
        }
      />
      <Collapse in={open}>
        <List dense>
          {data.map((item, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={item.label}
                secondary={
                  item.link ? (
                    <Box component="a" href="#" sx={{ color: 'primary.main', textDecoration: 'none' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <PictureAsPdf fontSize="small" />
                        <span>{item.value}</span>
                      </Stack>
                    </Box>
                  ) : (
                    item.value
                  )
                }
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Card>
  );
};
