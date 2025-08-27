import { Fragment, ReactNode, useState, useMemo, memo, useEffect } from 'react';
import { Dropdown } from 'antd';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, List, ListItem, ListItemText, Stack, Typography, Checkbox, Skeleton, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import SelectCompanies from '@/components/selects/SelectCompanies';
import SelectGeneric from '@/components/selects/SelectGeneric';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { BlackBarKeyEnum } from '@/types/global.enum';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { ExpandMore, Visibility, ContentCopy, Close, Upload, CheckCircle, PlayArrow } from '@mui/icons-material';
import Scrollbar from '@/components/Scrollbar';
import ClipboardJS from 'clipboard';
import { notification } from 'antd';
import { validateOcamPdf } from '@/utils/pdfValidation';
import { patchSale } from '@/services/sales/sales.request';

interface Producto {
  codigo: string;
  cantidad: number;
  marca: string;
  descripcion: string;
  precioUnitario?: number;
  total?: number;
  unidadMedida?: string;
  isCompleted?: boolean; // Agregamos el campo isCompleted
}

const saleTypeOptions = [
  { label: 'Venta al Estado', value: 'directa' },
  { label: 'Venta Privada', value: 'privada' },
];

const BlackBar = memo(() => {
  const { saleInputValues, setSaleInputValues, blackBarKey, selectedSale, setSelectedSale } = useGlobalInformation();
  const [openDD, setOpenDD] = useState(false);
  const [tempFile, setTempFile] = useState<File>();
  const [completedProducts, setCompletedProducts] = useState<string[]>([]);
  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Inicializar completedProducts basado en los datos del backend
  useEffect(() => {
    if (selectedSale?.productos && Array.isArray(selectedSale.productos)) {
      const completed = selectedSale.productos
        .filter((producto: Producto) => producto.isCompleted === true)
        .map((producto: Producto) => producto.codigo);
      setCompletedProducts(completed);
    } else if (selectedSale?.productos && typeof selectedSale.productos === 'string') {
      try {
        const parsedProducts = JSON.parse(selectedSale.productos);
        if (Array.isArray(parsedProducts)) {
          const completed = parsedProducts
            .filter((producto: Producto) => producto.isCompleted === true)
            .map((producto: Producto) => producto.codigo);
          setCompletedProducts(completed);
        }
      } catch (error) {
        console.error('Error parsing productos:', error);
        setCompletedProducts([]);
      }
    } else {
      setCompletedProducts([]);
    }
  }, [selectedSale?.id, selectedSale?.productos]);

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

  const handleOpenModal = () => {
    setOpenUploadModal(true);
    setUploadedFile(null);
  };

  const handleCloseModal = () => {
    setOpenUploadModal(false);
    setUploadedFile(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validation = validateOcamPdf(file);

      if (validation.isValid) {
        setUploadedFile(file);
      } else {
        console.warn('⚠️ Archivo no válido:', validation.message);
        notification.error({
          message: 'Archivo no válido',
          description: validation.message,
          placement: 'topRight',
          duration: 4,
        });
        // Limpiar el input
        event.target.value = '';
      }
    }
  };

  const handleAnalyzeFile = () => {
    if (uploadedFile) {
      setSaleInputValues({ ...saleInputValues, file: uploadedFile });
      handleCloseModal();
      notification.info({
        message: 'Analizando archivo',
        description: 'El archivo será analizado por IA',
        placement: 'topRight',
      });
    }
  };

  const handleToggleProduct = async (codigo: string) => {
    if (!selectedSale?.id || isUpdatingProduct) return;

    try {
      setIsUpdatingProduct(true);

      // Actualizar estado local inmediatamente para UI responsiva
      const isCurrentlyCompleted = completedProducts.includes(codigo);
      const newCompletedProducts = isCurrentlyCompleted
        ? completedProducts.filter((c) => c !== codigo)
        : [...completedProducts, codigo];

      setCompletedProducts(newCompletedProducts);

      // Obtener los productos actuales
      let currentProducts = selectedSale.productos;
      if (typeof currentProducts === 'string') {
        currentProducts = JSON.parse(currentProducts);
      }

      // Actualizar el producto específico
      const updatedProducts = currentProducts.map((producto: Producto) =>
        producto.codigo === codigo
          ? { ...producto, isCompleted: !isCurrentlyCompleted }
          : producto
      );

      // Persistir en backend
      const updatedSale = await patchSale(selectedSale.id, {
        productos: updatedProducts
      });

      // Actualizar el selectedSale con los datos del backend
      setSelectedSale(updatedSale);

      // Mostrar notificación de éxito
      notification.success({
        message: 'Producto actualizado',
        description: `Producto ${isCurrentlyCompleted ? 'marcado como pendiente' : 'completado'} exitosamente`,
        placement: 'topRight',
        duration: 2,
      });

    } catch (error) {
      console.error('Error updating product:', error);

      // Revertir el estado local en caso de error
      setCompletedProducts((prev) =>
        prev.includes(codigo)
          ? prev.filter((c) => c !== codigo)
          : [...prev, codigo]
      );

      notification.error({
        message: 'Error al actualizar producto',
        description: 'No se pudo actualizar el estado del producto. Inténtalo de nuevo.',
        placement: 'topRight',
        duration: 3,
      });
    } finally {
      setIsUpdatingProduct(false);
    }
  };

  const handleCopyDescription = (descripcion: string) => {
    // Crear un elemento temporal para clipboard.js
    const tempElement = document.createElement('button');
    tempElement.setAttribute('data-clipboard-text', descripcion);
    tempElement.style.position = 'absolute';
    tempElement.style.left = '-9999px';
    document.body.appendChild(tempElement);

    // Inicializar clipboard.js en el elemento temporal
    const clipboard = new ClipboardJS(tempElement);

    clipboard.on('success', () => {
      // Mostrar notificación de éxito usando antd notification
      import('antd').then(({ notification }) => {
        notification.success({
          message: 'Descripción copiada',
          description: 'La descripción del producto se ha copiado al portapapeles',
          placement: 'topRight',
          duration: 2,
        });
      });

      // Limpiar
      clipboard.destroy();
      document.body.removeChild(tempElement);
    });

    clipboard.on('error', (e) => {
      console.error('Error al copiar al portapapeles:', e);

      // Fallback manual
      try {
        const textArea = document.createElement('textarea');
        textArea.value = descripcion;
        textArea.style.position = 'absolute';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        import('antd').then(({ notification }) => {
          notification.success({
            message: 'Descripción copiada',
            description: 'La descripción del producto se ha copiado al portapapeles (fallback)',
            placement: 'topRight',
            duration: 2,
          });
        });
      } catch (fallbackError) {
        console.error('Error en fallback:', fallbackError);
        import('antd').then(({ notification }) => {
          notification.error({
            message: 'Error al copiar',
            description: 'No se pudo copiar la descripción al portapapeles',
            placement: 'topRight',
            duration: 3,
          });
        });
      }

      // Limpiar
      clipboard.destroy();
      document.body.removeChild(tempElement);
    });

    // Ejecutar el copiado
    tempElement.click();
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
              backgroundColor: '#1890ff !important', /* ✅ Azul */
              borderColor: '#1890ff !important',
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
              borderColor: '#1890ff !important', /* ✅ Azul */
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

        <Button
          sx={{ border: '2px solid #9e31f4', color: '#9e31f4', borderRadius: 0.75 }}
          color="secondary"
          variant="outlined"
          onClick={handleOpenModal}
          startIcon={<img src="/images/book_ai.png" alt="book ai icon" width={28} />}
        >
          {saleInputValues.file?.name ?? 'Cargar PDF'}
        </Button>
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
                  .map((doc, _) => (
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

            <AccordionStyled title={`Productos (${parsedProductos.length})`}>
              <Stack direction="column" spacing={2}>
                {parsedProductos.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body2" color="#bababa">
                      No hay productos registrados en esta orden de compra.
                    </Typography>
                  </Box>
                ) : (
                  parsedProductos.map((item: Producto, index: number) => {
                    // Priorizar el campo isCompleted del backend sobre el estado local
                    const isCompleted = item.isCompleted !== undefined
                      ? item.isCompleted
                      : completedProducts.includes(item.codigo);
                    return (
                      <Box
                        key={item.codigo || index}
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 2,
                          cursor: 'pointer',
                          opacity: isCompleted ? 0.6 : 1,
                          transition: 'all 0.2s',
                          userSelect: 'none',
                          border: '1px solid rgba(255,255,255,0.15)',
                          borderRadius: 2,
                          p: 2.5,
                          bgcolor: isCompleted ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                          '&:hover': {
                            bgcolor: isCompleted ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)',
                            borderColor: 'rgba(255,255,255,0.25)',
                          }
                        }}
                        onClick={() => handleToggleProduct(item.codigo)}
                      >
                        <Checkbox
                          checked={isCompleted}
                          onChange={() => handleToggleProduct(item.codigo)}
                          sx={{
                            p: 0,
                            mr: 1,
                            mt: 0.5,
                            '&.Mui-checked': {
                              color: '#57c98d',
                            }
                          }}
                          color="success"
                          onClick={e => e.stopPropagation()}
                        />

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          {/* Header con código y cantidad */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: isCompleted ? 'line-through' : 'none',
                                color: isCompleted ? '#bababa' : '#fff',
                                fontWeight: 700,
                                fontSize: '14px',
                              }}
                            >
                              {item.codigo}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: isCompleted ? '#bababa' : '#57c98d',
                                  fontWeight: 600,
                                  bgcolor: isCompleted ? 'rgba(186,186,186,0.1)' : 'rgba(87,201,141,0.1)',
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1,
                                  fontSize: '11px',
                                }}
                              >
                                {item.cantidad} {item.unidadMedida || 'unid.'}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Marca */}
                          {item.marca && (
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: isCompleted ? 'line-through' : 'none',
                                color: isCompleted ? '#bababa' : '#1890ff',
                                fontWeight: 600,
                                fontSize: '12px',
                                mb: 1,
                              }}
                            >
                              Marca: {item.marca}
                            </Typography>
                          )}

                          {/* Descripción */}
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: isCompleted ? 'line-through' : 'none',
                                color: isCompleted ? '#bababa' : '#eaebee',
                                flex: 1,
                                lineHeight: 1.5,
                                fontSize: '13px',
                              }}
                            >
                              {item.descripcion}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyDescription(item.descripcion);
                              }}
                              sx={{
                                color: '#1890ff',
                                bgcolor: 'rgba(24, 144, 255, 0.1)',
                                '&:hover': {
                                  bgcolor: 'rgba(24, 144, 255, 0.2)',
                                },
                                width: 28,
                                height: 28,
                                mt: -0.5,
                              }}
                              title="Copiar descripción"
                            >
                              <ContentCopy sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>

                          {/* Precios si están disponibles */}
                          {(item.precioUnitario || item.total) && (
                            <Box sx={{ display: 'flex', gap: 2, mt: 1, pt: 1, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                              {item.precioUnitario && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: isCompleted ? '#bababa' : '#eaebee',
                                    fontSize: '11px',
                                  }}
                                >
                                  Precio: S/ {item.precioUnitario.toFixed(2)}
                                </Typography>
                              )}
                              {item.total && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: isCompleted ? '#bababa' : '#57c98d',
                                    fontWeight: 600,
                                    fontSize: '11px',
                                  }}
                                >
                                  Total: S/ {item.total.toFixed(2)}
                                </Typography>
                              )}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    );
                  })
                )}
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
              {blackBarKey && components[blackBarKey as keyof typeof components]}
            </div>
          </Scrollbar>
        </Box>
      ) : null}

      {/* Modal de carga de archivos */}
      <Dialog
        open={openUploadModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={600}>
              Cargar archivo PDF
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={3} alignItems="center">
            {/* Área de carga de archivos */}
            <Box
              sx={{
                border: '2px dashed #e0e0e0',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                width: '100%',
                bgcolor: uploadedFile ? '#f8f9fa' : 'transparent',
                borderColor: uploadedFile ? '#28a745' : '#e0e0e0',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: '#1890ff',
                  bgcolor: '#f0f8ff',
                }
              }}
              onClick={() => document.getElementById('file-upload-input')?.click()}
            >
              <input
                id="file-upload-input"
                type="file"
                accept="application/pdf"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />

              {uploadedFile ? (
                <Stack spacing={2} alignItems="center">
                  <CheckCircle sx={{ fontSize: 48, color: '#28a745' }} />
                  <Typography variant="h6" fontWeight={600}>
                    Archivo cargado correctamente
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {uploadedFile.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Tamaño: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </Stack>
              ) : (
                <Stack spacing={2} alignItems="center">
                  <Upload sx={{ fontSize: 48, color: '#9e31f4' }} />
                  <Typography variant="h6" fontWeight={600}>
                    Subir archivo PDF
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Haz clic aquí o arrastra tu archivo PDF
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Solo archivos PDF que comiencen con "OCAM"
                  </Typography>
                </Stack>
              )}
            </Box>

            {/* Información del archivo */}
            {uploadedFile && (
              <Box sx={{
                bgcolor: '#e8f5e8',
                p: 2,
                borderRadius: 1,
                width: '100%',
                border: '1px solid #d4edda'
              }}>
                <Typography variant="body2" color="#155724">
                  <strong>Archivo listo para procesar:</strong> El archivo ha sido validado y está listo para ser analizado por IA o confirmado para uso manual.
                </Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Stack direction="row" spacing={2} width="100%">
            <Button
              onClick={handleCloseModal}
              variant="outlined"
              color="inherit"
              fullWidth
            >
              Cancelar
            </Button>

            {uploadedFile && (
              <Button
                onClick={handleAnalyzeFile}
                variant="contained"
                color="secondary"
                fullWidth
                startIcon={<PlayArrow />}
                sx={{
                  bgcolor: '#9e31f4',
                  '&:hover': {
                    bgcolor: '#8028d4',
                  }
                }}
              >
                Analizar con IA
              </Button>
            )}
          </Stack>
        </DialogActions>
      </Dialog>
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
    <AccordionSummary sx={{ px: 0, fontWeight: 600, fontSize: '15px' }} expandIcon={<ExpandMore fontSize="large" sx={{ color: '#1890ff' }} />}>{title}</AccordionSummary>
    <AccordionDetails sx={{ pt: 0, px: 0 }}>{children}</AccordionDetails>
  </Accordion>
);
