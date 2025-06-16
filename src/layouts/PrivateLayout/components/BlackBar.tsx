import { Fragment, ReactNode, useState } from 'react';
import { Dropdown } from 'antd';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import SelectCompanies from '@/components/selects/SelectCompanies';
import SelectGeneric from '@/components/selects/SelectGeneric';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { BlackBarKeyEnum } from '@/types/global.enum';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { ExpandMore } from '@mui/icons-material';

const saleTypeOptions = [
  { label: 'Venta al Estado', value: 'directa' },
  { label: 'Venta Privada', value: 'privada' },
];

const BlackBar = () => {
  const { saleInputValues, setSaleInputValues, blackBarKey, selectedSale } = useGlobalInformation();
  const [openDD, setOpenDD] = useState(false);
  const [tempFile, setTempFile] = useState<File>();

  const handleClear = () => {
    setOpenDD(false);
    setTempFile(undefined);
  };

  console.log(selectedSale?.productos);

  const components = {
    [BlackBarKeyEnum.OC]: (
      <Stack direction="column" spacing={3}>
        <Box
          sx={{
            '& .ant-select-single .ant-select-selector': {
              backgroundColor: '#4F46E5 !important',
              borderColor: '#4F46E5 !important',
              color: '#ffffff !important',
              borderRadius: '8px !important',
              height: '50px !important',
              display: 'flex !important',
              alignItems: 'center !important',
              minHeight: '50px !important',
            },
            '& .ant-select-arrow': {
              color: '#ffffff !important',
            },
            '& .float-label label': {
              display: 'none !important', // Oculta el label flotante
            },
          }}
        >
          <SelectCompanies
            label="Selecciona una empresa"
            value={saleInputValues.enterprise?.id}
            onChange={(_, option: any) => setSaleInputValues({ ...saleInputValues, enterprise: option?.optiondata })}
          />
        </Box>

        <Box
          sx={{
            '& .ant-select-single .ant-select-selector': {
              backgroundColor: 'transparent !important',
              borderColor: '#4F46E5 !important',
              color: '#ffffff !important',
              borderRadius: '8px !important',
              height: '50px !important',
              display: 'flex !important',
              alignItems: 'center !important',
              minHeight: '50px !important',
            },
            '& .ant-select-selection-placeholder': {
              color: '#ffffff !important',
              opacity: 0.8,
              lineHeight: '46px !important',
            },
            '& .ant-select-selection-item': {
              color: '#ffffff !important',
              lineHeight: '46px !important',
            },
            '& .ant-select-arrow': {
              color: '#ffffff !important',
            },
            '& .float-label label': {
              display: 'none !important', // Oculta el label flotante
            },
          }}
        >
          <SelectGeneric
            label="Tipo de venta"
            options={saleTypeOptions}
            value={saleInputValues.tipoVenta}
            onChange={(tipoVenta) => setSaleInputValues({ ...saleInputValues, tipoVenta })}
          />
        </Box>

        <Divider />

        <Dropdown
          placement="bottom"
          trigger={['click']}
          open={openDD}
          dropdownRender={() => (
            <Stack direction="column" spacing={2} bgcolor="#fff" p={2} borderRadius={2} boxShadow="0 5px 50px -5px rgba(0,0,0,0.75);" width={250}>
              <Typography textAlign="center" color="textSecondary" fontWeight={600}>
                ¿Desear cargar este archivo para ser analizado?
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button onClick={handleClear} color="error" variant="outlined" size="small" fullWidth>
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    setSaleInputValues({ ...saleInputValues, file: tempFile! });
                    handleClear();
                  }}
                  size="small"
                  fullWidth
                  color="secondary"
                >
                  Confirmar
                </Button>
              </Stack>
            </Stack>
          )}
        >
          <Button
            sx={{ border: '2px solid #9932CC', color: '#9932CC', borderRadius: 0.75, position: 'relative' }}
            color="secondary"
            variant="outlined"
          >
            <img src="/images/book_ai.png" alt="book ai icon" width={28} />
            <input
              type="file"
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0, cursor: 'pointer' }}
              onChange={(event) => {
                setTempFile(event.target.files?.[0]);
                setOpenDD(true);
              }}
              accept="application/pdf"
            />
            {saleInputValues.file?.name ?? 'Cargar PDF'}
          </Button>
        </Dropdown>
      </Stack>
    ),
    [BlackBarKeyEnum.OP]: (
      <Fragment>
        {selectedSale ? (
          <Stack direction="column" spacing={3}>
            <Stack spacing={0.5}>
              <Typography variant="body1">Órden de Compra</Typography>
              <Typography variant="h5">{selectedSale.codigoVenta}</Typography>
              <Typography variant="body2">Fecha {formattedDate(selectedSale.createdAt)}</Typography>
            </Stack>

            <Divider />

            <List>
              <ListItem
                divider
                disablePadding
                secondaryAction={formattedDate(selectedSale.fechaMaxForm, undefined, '-')}
                sx={{ borderBottomColor: 'red', py: 1 }}
              >
                <ListItemText primary="F. Máxima:" />
              </ListItem>
              <ListItem divider disablePadding secondaryAction={formatCurrency(0)} sx={{ borderBottomColor: 'red', py: 1 }}>
                <ListItemText primary="OP Importe Total:" />
              </ListItem>
              <ListItem
                divider
                disablePadding
                secondaryAction={formatCurrency(Number(selectedSale.montoVenta))}
                sx={{ borderBottomColor: 'green', py: 1 }}
              >
                <ListItemText primary="OC Importe Total:" />
              </ListItem>
            </List>

            <AccordionStyled title="Datos generales">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime, error quaerat aliquam nesciunt cum totam odit, illum possimus ea iusto
              ducimus voluptatum nostrum nam. Corporis fuga ea totam quos illum.
            </AccordionStyled>

            <AccordionStyled title="Documentos 2/4">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime, error quaerat aliquam nesciunt cum totam odit, illum possimus ea iusto
              ducimus voluptatum nostrum nam. Corporis fuga ea totam quos illum.
            </AccordionStyled>

            <AccordionStyled title="Entrega">
              <Stack direction="column" spacing={2}>
                {[
                  { label: 'C - Dirección', value: selectedSale.direccionEntrega.toUpperCase() },
                  { label: 'C - Distrito', value: selectedSale.distritoEntrega?.name ?? '-' },
                  { label: 'C - Provincia', value: selectedSale.provinciaEntrega?.name ?? '-' },
                  { label: 'C - Departamento', value: selectedSale.departamentoEntrega?.name ?? '-' },
                  { label: 'C - Referencia', value: selectedSale.referenciaEntrega ?? '-' },
                ].map((item, index) => (
                  <Box key={index + 1}>
                    <Typography variant="body2" fontWeight={600} children={item.label} />
                    <Typography variant="body2" color="#bababa" children={item.value} />
                  </Box>
                ))}
              </Stack>
            </AccordionStyled>

            <AccordionStyled title="Productos">
              <Stack direction="column" spacing={3}>
                {selectedSale.productos.map((item, index) => (
                  <Box key={index + 1}>
                    <Typography variant="body2">
                      Código: <b>{item.codigo}</b>
                    </Typography>
                    <Typography variant="body2">
                      Cantidad: <b>{item.cantidad}</b>
                    </Typography>
                    <Typography variant="body2">
                      Marca: <b>{item.marca}</b>
                    </Typography>
                    <Typography variant="body2">{item.descripcion}</Typography>
                  </Box>
                ))}
              </Stack>
            </AccordionStyled>
          </Stack>
        ) : (
          <Typography color="textSecondary" textAlign="center" children="Venta no fue seleccionada" />
        )}
      </Fragment>
    ),
  };

  return (
    <Fragment>
      {blackBarKey ? (
        <Box 
          width={300} 
          bgcolor="#111827" 
          color="#ffffff" 
          px={2} 
          py={3} 
        >
          {components[blackBarKey]}
        </Box>
      ) : null}
    </Fragment>
  );
};

export default BlackBar;

const AccordionStyled = ({ title, children }: { title: ReactNode; children: ReactNode }) => (
  <Accordion
    sx={{
      bgcolor: 'transparent',
      color: 'white',
      '&:before': { display: 'none' },
      '&.Mui-expanded': { margin: 0 },
      // border: '1px solid red',
    }}
    defaultExpanded
  >
    <AccordionSummary expandIcon={<ExpandMore fontSize="large" sx={{ color: 'blue' }} />}>{title}</AccordionSummary>
    <AccordionDetails sx={{ pt: 0 }}>{children}</AccordionDetails>
  </Accordion>
);
