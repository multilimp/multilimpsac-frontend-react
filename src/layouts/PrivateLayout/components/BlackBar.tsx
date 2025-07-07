import { Fragment, ReactNode, useState, useMemo, memo } from 'react';
import { Dropdown } from 'antd';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, List, ListItem, ListItemText, Stack, Typography, Checkbox, Skeleton } from '@mui/material';
import SelectCompanies from '@/components/selects/SelectCompanies';
import SelectGeneric from '@/components/selects/SelectGeneric';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { BlackBarKeyEnum } from '@/types/global.enum';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { ExpandMore, Visibility } from '@mui/icons-material';
import Scrollbar from '@/components/Scrollbar';

const saleTypeOptions = [
  { label: 'Venta al Estado', value: 'directa' },
  { label: 'Venta Privada', value: 'privada' },
];

const BlackBar = memo(() => {
  const { saleInputValues, setSaleInputValues, blackBarKey, selectedSale } = useGlobalInformation();
  const [openDD, setOpenDD] = useState(false);
  const [tempFile, setTempFile] = useState<File>();
  const [completedProducts, setCompletedProducts] = useState<string[]>([]);

  const documentosConfig = [
    {
      label: 'OCE (Orden de Compra Electrónica)',
      field: 'documentoOce',
      value: selectedSale?.documentoOce,
    },
    {
      label: 'OCF (Orden de Compra Física)',
      field: 'documentoOcf',
      value: selectedSale?.documentoOcf,
    },
    {
      label: 'PeruCompras',
      field: 'documentoPeruCompras',
      value: selectedSale?.documentoPeruCompras,
    },
    // Agrega aquí otros documentos si existen en tu modelo
  ];

  const totalDocs = documentosConfig.length;
  const docsPresentes = documentosConfig.filter(doc => !!doc.value).length;


  const handleClear = () => {
    setOpenDD(false);
    setTempFile(undefined);
  };

  const handleToggleProduct = (codigo: string) => {
    setCompletedProducts((prev) =>
      prev.includes(codigo)
        ? prev.filter((c) => c !== codigo)
        : [...prev, codigo]
    );
  };

  // ✅ OPTIMIZACIÓN: Memoizar el parseo de productos con validación robusta
  const parsedProductos = useMemo(() => {
    try {
      if (!selectedSale?.productos) return [];

      let productos = selectedSale.productos;

      // Si es string, parsearlo
      if (typeof productos === 'string') {
        productos = JSON.parse(productos);
      }

      // Verificar que sea array y tenga elementos válidos
      if (Array.isArray(productos)) {
        return productos.filter(item => item && typeof item === 'object');
      }

      return [];
    } catch (error) {
      console.error('🚨 Error parsing productos:', error);
      return [];
    }
  }, [selectedSale?.productos]);

  // ✅ OPTIMIZACIÓN: Memoizar componentes pesados
  const components = useMemo(() => ({
    [BlackBarKeyEnum.OC]: (
      <Stack direction="column" spacing={3}>
        <Box
          sx={{
            '& .ant-select-single .ant-select-selector': {
              backgroundColor: '#306df7 !important',
              borderColor: '#306df7 !important',
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
              borderColor: '#306df7 !important',
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
            sx={{ border: '2px solid #9e31f4', color: '#9e31f4', borderRadius: 0.75, position: 'relative' }}
            color="secondary"
            variant="outlined"
          >
            <img src="/images/book_ai.png" alt="book ai icon" width={28} />
            <input
              type="file"
              key={`file-input-${saleInputValues.enterprise?.id || 'default'}`} // 🔧 Key único para reiniciar el input
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0, cursor: 'pointer' }}
              onChange={(event) => {
                console.log('🔍 File input onChange triggered:', {
                  file: event.target.files?.[0]?.name,
                  blackBarKey,
                  currentContext: 'PDF_UPLOAD'
                });

                const file = event.target.files?.[0];
                if (file && file.type === 'application/pdf') {
                  setTempFile(file);
                  setOpenDD(true);
                } else if (file) {
                  console.warn('⚠️ Archivo no válido - debe ser PDF');
                  // Limpiar el input
                  event.target.value = '';
                }
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
              <Typography sx={{ fontWeight: 600, fontSize: '16px', color: '#eaebee' }}>Órden de Compra</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '30px' }}>{selectedSale.codigoVenta}</Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '16px', color: '#eaebee' }}>Fecha {formattedDate(selectedSale.createdAt)}</Typography>
            </Stack>

            <Divider sx={{ borderBottomColor: '#3c4351' }} />

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
                sx={{ borderBottomColor: '#57c98d', py: 1 }}
              >
                <ListItemText primary="OC Importe Total:" />
              </ListItem>
            </List>
            <Divider sx={{ borderBottomColor: '#3c4351', my: 0 }} />

            <AccordionStyled title="Datos generales">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime, error quaerat aliquam nesciunt cum totam odit, illum possimus ea iusto
              ducimus voluptatum nostrum nam. Corporis fuga ea totam quos illum.
            </AccordionStyled>
            <Divider sx={{ borderBottomColor: '#3c4351', my: 0, py: 0 }} />

            <AccordionStyled title={`Documentos  ${docsPresentes}/${totalDocs}`}>
              <Stack direction="column" spacing={2}>
                {documentosConfig
                  .filter(doc => !!doc.value)
                  .map((doc, idx) => (
                    <Box key={doc.field} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                      <Typography sx={{ fontSize: '14px', color: '#eaebee' }} variant="body2" fontWeight={400}>
                        {doc.label}
                      </Typography>
                      <a
                        href={doc.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          color: '#1890ff',
                          marginLeft: 8,
                        }}
                        title="Ver documento"
                      >
                        <Visibility fontSize="small" />
                      </a>
                    </Box>
                  ))}
                {/* Si no hay documentos */}
                {![selectedSale?.documentoOce, selectedSale?.documentoOcf, selectedSale?.documentoPeruCompras].some(Boolean) && (
                  <Typography variant="body2" color="#bababa">
                    No hay documentos registrados para esta orden de compra.
                  </Typography>
                )}
              </Stack>
            </AccordionStyled>
            <Divider sx={{ borderBottomColor: '#3c4351', my: 0 }} />

            <AccordionStyled title="Entrega">
              <Stack direction="column" spacing={2}>
                {[
                  { label: 'C - Dirección', value: selectedSale.direccionEntrega.toUpperCase() },
                  { label: 'C - Distrito', value: selectedSale.distritoEntrega ?? '-' },
                  { label: 'C - Provincia', value: selectedSale.provinciaEntrega ?? '-' },
                  { label: 'C - Departamento', value: selectedSale.departamentoEntrega ?? '-' },
                  { label: 'C - Referencia', value: selectedSale.referenciaEntrega ?? '-' },
                ].map((item, index) => (
                  <Box key={index + 1}>
                    <Typography variant="body2" fontWeight={600} children={item.label} />
                    <Typography variant="body2" color="#bababa" children={item.value} />
                  </Box>
                ))}
              </Stack>
            </AccordionStyled>
            <Divider sx={{ borderBottomColor: '#3c4351', my: 0 }} />

            <AccordionStyled title="Productos">
              <Stack direction="column" spacing={3}>
                {parsedProductos.map((item: any, index: number) => {
                  const isCompleted = completedProducts.includes(item.codigo);
                  return (
                    <Box
                      key={item.codigo || index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        cursor: 'pointer',
                        opacity: isCompleted ? 0.5 : 1,
                        transition: 'opacity 0.2s',
                        userSelect: 'none',
                      }}
                      onClick={() => handleToggleProduct(item.codigo)}
                    >
                      <Checkbox
                        checked={isCompleted}
                        onChange={() => handleToggleProduct(item.codigo)}
                        sx={{ p: 0, mr: 1 }}
                        color="success"
                        onClick={e => e.stopPropagation()}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: isCompleted ? 'line-through' : 'none',
                            color: isCompleted ? '#bababa' : '#fff',
                            fontWeight: 600,
                          }}
                        >
                          Código: <b>{item.codigo}</b>
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: isCompleted ? 'line-through' : 'none',
                            color: isCompleted ? '#bababa' : '#fff',
                          }}
                        >
                          Cantidad: <b>{item.cantidad}</b>
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: isCompleted ? 'line-through' : 'none',
                            color: isCompleted ? '#bababa' : '#fff',
                          }}
                        >
                          Marca: <b>{item.marca}</b>
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: isCompleted ? 'line-through' : 'none',
                            color: isCompleted ? '#bababa' : '#fff',
                          }}
                        >
                          {item.descripcion}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </AccordionStyled>
          </Stack>
        ) : (
          <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ minHeight: 220 }}>
            {[1, 2, 3].map((_, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  width: '100%',
                  bgcolor: 'rgba(255,255,255,0.02)',
                  borderRadius: 2,
                  p: 2,
                  mb: 1,
                  boxShadow: '0 1px 8px 0 rgba(24,144,255,0.03)'
                }}
              >
                <Skeleton variant="circular" width={32} height={32} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="40%" height={22} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="60%" height={18} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="30%" height={18} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="80%" height={18} />
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </Fragment>
    ),
  }), [
    selectedSale?.id,
    selectedSale?.codigoVenta,
    selectedSale?.montoVenta,
    selectedSale?.productos,
    saleInputValues.enterprise?.id,
    saleInputValues.tipoVenta,
    saleInputValues.file?.name,
    completedProducts, // importante para re-render
  ]);

  return (
    <Fragment>
      {blackBarKey ? (
        <Box
          width={350}
          bgcolor="#161e2a"
          color="#ffffff"
          p={4}
          sx={
            {
              position: 'sticky',
              top: 0,
              height: '100vh',
              maxHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 10,
              boxShadow: '2px 0 20px rgba(0,0,0,0.12)',
              overflow: 'hidden',
            }
          }
        >
          <Scrollbar
            sx={{
              flex: 1,
              minHeight: 0,
              maxHeight: '100%',
            }}
          >
            <div className="hero-scrollbar" style={{ height: '100%', overflowY: 'auto' }}>
              {components[blackBarKey]}
            </div>
          </Scrollbar>
        </Box>
      ) : null}
    </Fragment>
  );
});

BlackBar.displayName = 'BlackBar';

export default BlackBar;

const AccordionStyled = ({ title, children }: { title: ReactNode; children: ReactNode }) => (
  <Accordion
    sx={{
      bgcolor: 'transparent',
      color: 'white',
      '&:before': { display: 'none' },
      '&.Mui-expanded': { margin: 0 },
      // border: '1px solid #3c4351',
    }}
  >
    <AccordionSummary sx={{ px: 0, fontWeight: 600, fontSize: '15px' }} expandIcon={<ExpandMore fontSize="large" sx={{ color: '#306df7' }} />}>{title}</AccordionSummary>
    <AccordionDetails sx={{ pt: 0 }}>{children}</AccordionDetails>
  </Accordion>
);
