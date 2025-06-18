import { useState } from 'react';
import { SaleProps } from '@/services/sales/sales';
import { Close, Edit, KeyboardArrowDown, KeyboardArrowUp, OpenInNew } from '@mui/icons-material';
import { Card, CardContent, CardHeader, Collapse, Drawer, Fab, IconButton, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { formatCurrency } from '@/utils/functions';
import { useNavigate } from 'react-router-dom';

interface SalesDetailsProps {
  handleClose: VoidFunction;
  data: SaleProps;
}

const defaultText = '—';

const SalesDetails = ({ handleClose, data }: SalesDetailsProps) => {
  const navigate = useNavigate();
  
  const handleEditClick = () => {
    navigate(`/sales/${data.id}/edit`);
  };
  const {
    catalogoEmpresa,
    cliente,
    codigoVenta,
    contactoCliente,
    // createdAt,
    direccionEntrega,
    documentoOce,
    documentoOcf,
    empresa,
    // estadoActivo,
    // etapaActual,
    etapaSiaf,
    // fechaEmision,
    fechaEntrega,
    fechaForm,
    fechaMaxForm,
    // fechaSiaf,
    montoVenta,
    // ordenesProveedor,
    productos,
    referenciaEntrega,
    siaf,
    // updatedAt,
    // ventaPrivada,
    // archivoOc,
    departamentoEntrega,
    distritoEntrega,
    // documentoPeruCompras,
    // estadoCobranza,
    fechaEntregaOc,
    // fechaEstadoCobranza,
    // fechaPeruCompras,
    // fechaProximaGestion,
    // netoCobrado,
    // penalidad,
    provinciaEntrega,
  } = data;

  return (
    <Drawer anchor="right" open onClose={handleClose}>
      <Card sx={{ borderRadius: 0, width: { xs: '100%', sm: 500 } }} variant="outlined">
        <CardHeader
          title="DETALLE DE LA VENTA"
          subheader={`Código de venta: ${codigoVenta}`}
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
          <Stack direction="column" spacing={2}>
            <CardList
              title="CLIENTE"
              data={[
                { label: 'RUC', value: cliente.ruc },
                { label: 'Razón social', value: cliente.razonSocial },
                { label: 'Código unidad ejecutora', value: cliente.codigoUnidadEjecutora },
                { label: 'Dirección', value: cliente.direccion },
                { label: 'Teléfono', value: cliente.telefono ?? defaultText },
                { label: 'Email', value: cliente.email ?? defaultText },
              ]}
            />

            <CardList
              title="EMPRESA"
              data={[
                { label: 'RUC', value: empresa?.ruc },
                { label: 'Razón social', value: empresa.razonSocial },
                { label: 'Dirección', value: empresa.direccion },
                { label: 'Teléfono', value: empresa.telefono ?? defaultText },
                { label: 'Email', value: empresa.email ?? defaultText },
                { label: 'Web', value: empresa.web ?? defaultText },
              ]}
            />

            <CardList
              title="ENTREGA"
              data={[
                { label: 'Dirección', value: direccionEntrega },
                { label: defaultText, value: `${departamentoEntrega?.name} - ${provinciaEntrega?.name} - ${distritoEntrega?.name}` },
                { label: 'Referencia', value: referenciaEntrega },
                { label: 'Fecha de entrega', value: fechaEntrega ? dayjs(fechaEntrega).format('DD/MM/YYYY') : defaultText },
                { label: 'Fecha de entrega OC', value: fechaEntregaOc ? dayjs(fechaEntregaOc).format('DD/MM/YYYY') : defaultText },
              ]}
            />

            <CardList
              title="INFORMACIÓN GENERAL"
              data={[
                { label: 'Catálogo', value: catalogoEmpresa.nombre },
                { label: defaultText, value: catalogoEmpresa.descripcion },
                { label: 'Fecha formalización', value: fechaForm ? dayjs(fechaForm).format('DD/MM/YYYY') : defaultText },
                { label: 'Fecha máxima de entrega', value: fechaMaxForm ? dayjs(fechaMaxForm).format('DD/MM/YYYY') : defaultText },
                { label: 'Monto de venta', value: formatCurrency(Number(montoVenta)) },
                { label: 'Número SIAF', value: siaf },
                { label: 'Etapa SIAF', value: etapaSiaf },
                { label: 'Órden de compra electrónica', value: documentoOce, link: true },
                { label: 'Órden de compra física', value: documentoOcf, link: true },
              ]}
            />

            <CardList
              title="CONTACTO CLIENTE"
              data={[
                { label: 'Cargo', value: contactoCliente.cargo },
                { label: 'Correo', value: contactoCliente.email ?? defaultText },
                { label: 'Nombre', value: contactoCliente.nombre },
                { label: 'Teléfono', value: contactoCliente.telefono ?? defaultText },
              ]}
            />

            <CardList title="PRODUCTOS" data={productos.map((producto) => ({ label: producto.descripcion, value: `Código: ${producto.codigo} | Marca: ${producto.marca} | Cantidad: ${producto.cantidad}` }))} />
          </Stack>
        </CardContent>
      </Card>
    </Drawer>
  );
};

export default SalesDetails;

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
            <ListItem
              key={index + 1}
              divider={index + 1 !== data.length}
              secondaryAction={
                item.link ? (
                  <IconButton component="a" href={item.value} target="_blank" rel="noopener noreferrer" size="small">
                    <OpenInNew />
                  </IconButton>
                ) : (
                  <Typography color="textSecondary" variant="caption" component="span">
                    {item.value}
                  </Typography>
                )
              }
            >
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Card>
  );
};
