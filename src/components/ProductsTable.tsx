import React, { Fragment, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Stack,
  Typography,
  FormHelperText,
  Box,
  Tooltip,
  Chip
} from '@mui/material';
import { Form, Input, InputNumber, FormInstance } from 'antd';
import { Delete, ShoppingCart, Calculate, Visibility } from '@mui/icons-material';
import { formatCurrency } from '@/utils/functions';

interface ProductDetail {
  cantidad: number;
  precioUnitario: number;
  total: number;
  hasData: boolean;
}

interface ProductsTableProps {
  // Configuración del formulario
  form: FormInstance;
  fieldName?: string;
  title?: string;
  showTitle?: boolean;
  // Configuración de comportamiento
  readOnly?: boolean;
  showAddButton?: boolean;
  showDeleteButton?: boolean;
  showTotal?: boolean;
  showNote?: boolean;
  noteFieldName?: string;
  noteLabel?: string;
  // Configuración de campos
  showFields?: {
    codigo?: boolean;
    descripcion?: boolean;
    uMedida?: boolean;
    cantidad?: boolean;
    cAlmacen?: boolean;
    cTotal?: boolean;
    precioUnitario?: boolean;
    total?: boolean;
  };
  // Configuración de validación
  required?: boolean;
  minProducts?: number;
  // Callbacks
  onProductChange?: (index: number) => void;
  // Configuración de estilo
  compact?: boolean;
  headerColor?: string;
}

const defaultShowFields = {
  codigo: true,
  descripcion: true,
  uMedida: true,
  cantidad: true,
  cAlmacen: true,
  cTotal: true,
  precioUnitario: true,
  total: true
};

const getEmptyProductRecord = () => ({
  codigo: '',
  descripcion: '',
  uMedida: '',
  cantidad: '',
  cAlmacen: '',
  cTotal: '',
  precioUnitario: '',
  total: ''
});

const ProductsTable: React.FC<ProductsTableProps> = ({
  form,
  fieldName = 'productos',
  title = 'PRODUCTOS',
  showTitle = true,
  readOnly = false,
  showAddButton = true,
  showDeleteButton = true,
  showTotal = true,
  showNote = false,
  noteFieldName = 'productosNota',
  noteLabel = 'Nota',
  showFields = defaultShowFields,
  required = true,
  minProducts = 1,
  onProductChange,
  compact = false,
  headerColor = 'red'
}) => {
  const requiredField = { required: true, message: 'Campo requerido' };
  const [isCalculating, setIsCalculating] = useState<number | null>(null);
  const [productDetails, setProductDetails] = useState<Record<number, ProductDetail>>({});

  // Función mejorada para calcular el subtotal de un producto
  const calculateProductSubTotal = (index: number) => {
    try {
      setIsCalculating(index);
      
      const record = form.getFieldValue([fieldName, index]);
      if (!record) return;

      // Para OP usamos cantidad (no cTotal)
      const cantidad = Number(record.cantidad) || 0;
      const precioUnitario = Number(record.precioUnitario) || 0;
      const total = cantidad * precioUnitario;

      // Actualizar el total del producto
      form.setFieldValue([fieldName, index, 'total'], total);

      // Actualizar detalles del producto para visualización
      setProductDetails(prev => ({
        ...prev,
        [index]: {
          cantidad,
          precioUnitario,
          total,
          hasData: Boolean(record.codigo || record.descripcion)
        }
      }));

      // Llamar al callback si existe
      if (onProductChange) {
        onProductChange(index);
      }

      // Forzar actualización de detalles
      setTimeout(() => updateProductDetails(), 10);

      console.log(`✅ Producto ${index} calculado:`, { cantidad, precioUnitario, total });
    } catch (error) {
      console.error(`❌ Error calculando producto ${index}:`, error);
    } finally {
      setIsCalculating(null);
    }
  };

  // Hook personalizado para manejar cambios del formulario
  const useFormWatch = () => {
    const [watchedValues, setWatchedValues] = useState({});
    
    useEffect(() => {
      const interval = setInterval(() => {
        const currentValues = form.getFieldValue(fieldName);
        if (JSON.stringify(currentValues) !== JSON.stringify(watchedValues)) {
          setWatchedValues(currentValues);
          updateProductDetails();
        }
      }, 200);
      
      return () => clearInterval(interval);
    }, [watchedValues]);
    
    return watchedValues;
  };

  // Usar el hook para monitorear cambios
  useFormWatch();

  // Actualizar detalles cuando cambian los productos
  const updateProductDetails = () => {
    const productos = form.getFieldValue(fieldName) || [];
    const newDetails: Record<number, ProductDetail> = {};
    
    productos.forEach((producto: Record<string, unknown>, index: number) => {
      const cantidad = Number(producto.cantidad) || 0;
      const precioUnitario = Number(producto.precioUnitario) || 0;
      const total = cantidad * precioUnitario;
      
      newDetails[index] = {
        cantidad,
        precioUnitario,
        total,
        hasData: Boolean(producto.codigo || producto.descripcion)
      };
    });
    
    setProductDetails(newDetails);
  };

  const validationRules = required ? [
    {
      validator(_: unknown, arr: unknown[]) {
        if (!arr || (arr as unknown[]).length < minProducts) {
          return Promise.reject(new Error(`Debe ingresar por lo menos ${minProducts} producto(s) para continuar.`));
        }
        return Promise.resolve();
      },
    },
  ] : [];

  const cellStyle = {
    p: compact ? 0.125 : 0.25
  };

  const content = (
    <>
      <TableContainer sx={{ mb: 3 }}>
        <Table size={compact ? "small" : "medium"}>
          <TableHead sx={{ bgcolor: `${headerColor} !important` }}>
            <TableRow sx={{ bgcolor: `${headerColor} !important` }}>
              {showFields.codigo && <TableCell sx={{ p: 0, fontSize: 12 }}>COD.</TableCell>}
              {showFields.descripcion && <TableCell sx={{ p: 0, fontSize: 12 }}>Descripción</TableCell>}
              {showFields.uMedida && <TableCell sx={{ p: 0, fontSize: 12 }}>U.Medida</TableCell>}
              {showFields.cantidad && <TableCell sx={{ p: 0, fontSize: 12 }}>Cantidad</TableCell>}
              {showFields.cAlmacen && <TableCell sx={{ p: 0, fontSize: 12 }}>C.Almacen</TableCell>}
              {showFields.cTotal && <TableCell sx={{ p: 0, fontSize: 12 }}>C.Total</TableCell>}
              {showFields.precioUnitario && <TableCell sx={{ p: 0, fontSize: 12 }}>Precio U.</TableCell>}
              {showFields.total && <TableCell sx={{ p: 0, fontSize: 12 }}>Total</TableCell>}
              {!readOnly && <TableCell sx={{ p: 0, fontSize: 12 }}>Acciones</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            <Form.List
              name={fieldName}
              initialValue={[getEmptyProductRecord()]}
              rules={validationRules}
            >
              {(fields, { add, remove }, { errors }) => (
                <Fragment>
                  {fields.map((field) => {
                    const productDetail = productDetails[field.name];
                    const hasData = productDetail?.hasData;
                    
                    return (
                      <TableRow 
                        key={field.name} 
                        sx={{ 
                          '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.04) !important' },
                          bgcolor: hasData ? 'rgba(76, 175, 80, 0.04)' : 'transparent'
                        }}
                      >
                        {showFields.codigo && (
                          <TableCell sx={cellStyle}>
                            <Form.Item className="m-0" name={[field.name, 'codigo']} rules={required ? [requiredField] : []}>
                              <Box sx={{
                                bgcolor: '#f3f6f9',
                                borderRadius: 2,
                                height: 48,
                                display: 'flex',
                                alignItems: 'center',
                                px: 2,
                              }}>
                                <Input
                                  placeholder="Código"
                                  size="small"
                                  style={{
                                    width: '100%',
                                    border: 'none',
                                    background: 'transparent',
                                    color: 'black',
                                    fontWeight: 600,
                                  }}
                                  onChange={() => calculateProductSubTotal(field.name)}
                                  readOnly={readOnly}
                                  disabled={readOnly}
                                />
                              </Box>
                            </Form.Item>
                          </TableCell>
                        )}
                        {showFields.descripcion && (
                          <TableCell sx={cellStyle}>
                            <Form.Item className="m-0" name={[field.name, 'descripcion']} rules={required ? [requiredField] : []}>
                              <Box sx={{
                                bgcolor: '#f3f6f9',
                                borderRadius: 2,
                                height: 48,
                                display: 'flex',
                                alignItems: 'center',
                                px: 2,
                              }}>
                                <Input
                                  placeholder="Descripción"
                                  size="small"
                                  style={{
                                    width: '100%',
                                    border: 'none',
                                    background: 'transparent',
                                    color: 'black',
                                    fontWeight: 600,
                                  }}
                                  onChange={() => calculateProductSubTotal(field.name)}
                                  readOnly={readOnly}
                                  disabled={readOnly}
                                />
                              </Box>
                            </Form.Item>
                          </TableCell>
                        )}
                        {showFields.uMedida && (
                          <TableCell sx={cellStyle}>
                            <Form.Item className="m-0" name={[field.name, 'uMedida']} rules={required ? [requiredField] : []}>
                              <Box sx={{
                                bgcolor: '#f3f6f9',
                                borderRadius: 2,
                                height: 48,
                                display: 'flex',
                                alignItems: 'center',
                                px: 2,
                              }}>
                                <Input
                                  placeholder="U.Medida"
                                  size="small"
                                  style={{
                                    width: '100%',
                                    border: 'none',
                                    background: 'transparent',
                                    color: 'black',
                                    fontWeight: 600,
                                  }}
                                  onChange={() => calculateProductSubTotal(field.name)}
                                  readOnly={readOnly}
                                  disabled={readOnly}
                                />
                              </Box>
                            </Form.Item>
                          </TableCell>
                        )}
                        {showFields.cantidad && (
                          <TableCell sx={cellStyle}>
                            <Form.Item className="m-0" name={[field.name, 'cantidad']} rules={required ? [requiredField] : []}>
                              <Box sx={{
                                bgcolor: '#f3f6f9',
                                borderRadius: 2,
                                height: 48,
                                display: 'flex',
                                alignItems: 'center',
                                px: 2,
                              }}>
                                <InputNumber
                                  placeholder="0"
                                  size="small"
                                  min={0}
                                  style={{
                                    width: '100%',
                                    border: 'none',
                                    background: 'transparent',
                                    color: 'black',
                                    fontWeight: 600,
                                  }}
                                  onChange={() => calculateProductSubTotal(field.name)}
                                  readOnly={readOnly}
                                  disabled={readOnly}
                                />
                              </Box>
                            </Form.Item>
                          </TableCell>
                        )}
                        {showFields.cAlmacen && (
                          <TableCell sx={cellStyle}>
                            <Form.Item className="m-0" name={[field.name, 'cAlmacen']} rules={required ? [requiredField] : []}>
                              <Box sx={{
                                bgcolor: '#f3f6f9',
                                borderRadius: 2,
                                height: 48,
                                display: 'flex',
                                alignItems: 'center',
                                px: 2,
                              }}>
                                <InputNumber
                                  placeholder="0"
                                  size="small"
                                  min={0}
                                  style={{
                                    width: '100%',
                                    border: 'none',
                                    background: 'transparent',
                                    color: 'black',
                                    fontWeight: 600,
                                  }}
                                  onChange={() => calculateProductSubTotal(field.name)}
                                  readOnly={readOnly}
                                  disabled={readOnly}
                                />
                              </Box>
                            </Form.Item>
                          </TableCell>
                        )}
                        {showFields.cTotal && (
                          <TableCell sx={cellStyle}>
                            <Form.Item className="m-0" name={[field.name, 'cTotal']} rules={required ? [requiredField] : []}>
                              <Box sx={{
                                bgcolor: '#f3f6f9',
                                borderRadius: 2,
                                height: 48,
                                display: 'flex',
                                alignItems: 'center',
                                px: 2,
                              }}>
                                <InputNumber
                                  placeholder="0"
                                  size="small"
                                  min={0}
                                  style={{
                                    width: '100%',
                                    border: 'none',
                                    background: 'transparent',
                                    color: 'black',
                                    fontWeight: 600,
                                  }}
                                  onChange={() => calculateProductSubTotal(field.name)}
                                  readOnly={readOnly}
                                  disabled={readOnly}
                                />
                              </Box>
                            </Form.Item>
                          </TableCell>
                        )}
                        {showFields.precioUnitario && (
                          <TableCell sx={cellStyle}>
                            <Form.Item className="m-0" name={[field.name, 'precioUnitario']} rules={required ? [requiredField] : []}>
                              <Box sx={{
                                bgcolor: '#f3f6f9',
                                borderRadius: 2,
                                height: 48,
                                display: 'flex',
                                alignItems: 'center',
                                px: 2,
                              }}>
                                <InputNumber
                                  placeholder="0.00"
                                  size="small"
                                  min={0}
                                  style={{
                                    width: '100%',
                                    border: 'none',
                                    background: 'transparent',
                                    color: 'black',
                                    fontWeight: 600,
                                  }}
                                  onChange={() => calculateProductSubTotal(field.name)}
                                  readOnly={readOnly}
                                  disabled={readOnly}
                                />
                              </Box>
                            </Form.Item>
                          </TableCell>
                        )}
                        {showFields.total && (
                          <TableCell sx={cellStyle}>
                            <Form.Item className="m-0" name={[field.name, 'total']}>
                              <Box sx={{
                                bgcolor: '#f3f6f9',
                                borderRadius: 2,
                                height: 48,
                                display: 'flex',
                                alignItems: 'center',
                                px: 2,
                                position: 'relative',
                              }}>
                                {isCalculating === field.name && (
                                  <Box sx={{
                                    position: 'absolute',
                                    right: 8,
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}>
                                    <Calculate sx={{ fontSize: 16, color: '#1976d2' }} />
                                  </Box>
                                )}
                                {/* Mostrar siempre el valor del total, aunque sea 0 */}
                                {!isCalculating && (
                                    <Chip 
                                      label={formatCurrency(productDetail?.total || 0)}
                                      size="small"
                                      sx={{ 
                                        fontSize: '0.7rem',
                                        height: 20,
                                        bgcolor: productDetail?.total > 0 ? '#e3f2fd' : '#f5f5f5',
                                        color: productDetail?.total > 0 ? '#1976d2' : '#666666'
                                      }}
                                    />
                                )}
                                {/* Debug: mostrar detalles del producto */}
                                {process.env.NODE_ENV === 'development' && (
                                  <Box sx={{ 
                                    position: 'absolute', 
                                    bottom: -20, 
                                    fontSize: '10px', 
                                    color: 'red' 
                                  }}>
                                    {JSON.stringify({
                                      index: field.name,
                                      hasDetail: !!productDetail,
                                      total: productDetail?.total,
                                      calculating: isCalculating === field.name
                                    })}
                                  </Box>
                                )}
                              </Box>
                            </Form.Item>
                          </TableCell>
                        )}
                        {!readOnly && (
                          <TableCell sx={cellStyle}>
                            <Box sx={{
                              bgcolor: '#f3f6f9',
                              borderRadius: 2,
                              height: 48,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 1,
                            }}>
                              {showDeleteButton && (
                                <Tooltip title="Eliminar producto">
                                  <IconButton 
                                    size="small" 
                                    color="error" 
                                    onClick={() => remove(field.name)}
                                    sx={{
                                      color: '#dc2626',
                                      '&:hover': {
                                        bgcolor: 'rgba(220, 38, 38, 0.1)'
                                      }
                                    }}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                  
                  {(!readOnly || showTotal || showAddButton) && (
                    <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
                      <TableCell colSpan={2}>
                        {errors.length ? <FormHelperText error>{(errors as Array<string>).join(' - ')}</FormHelperText> : null}
                      </TableCell>
                      {!readOnly && showAddButton && (
                        <TableCell colSpan={3} sx={cellStyle}>
                          <Stack direction="row" spacing={1}>
                            <Button 
                              fullWidth 
                              size="large" 
                              onClick={() => add(getEmptyProductRecord())} 
                              style={{
                                background: '#1777ff',
                                borderColor: '#f3f6f9',
                                color: 'white',
                                fontWeight: 700,
                                borderRadius: 8,
                                height: 48,
                                fontSize: 14,
                              }}
                            >
                              AÑADIR PRODUCTOS
                            </Button>
                          </Stack>
                        </TableCell>
                      )}
                      {showTotal && (
                        <TableCell sx={{ p: 0 }} align="right" colSpan={3}>
                          <Form.Item noStyle shouldUpdate>
                            {() => {
                              const arr = form.getFieldValue(fieldName) || [];
                              const sum: number = arr.reduce(
                                (acum: number, next: Record<string, string>) => (acum += parseInt(next.total || '0', 10)),
                                0
                              );
                              return (
                                <Box sx={{
                                  bgcolor: '#f3f6f9',
                                  borderRadius: 2,
                                  height: 48,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'flex-end',
                                  px: 2,
                                }}>
                                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1777ff' }}>
                                    Total: {formatCurrency(sum)}
                                  </Typography>
                                </Box>
                              );
                            }}
                          </Form.Item>
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </Fragment>
              )}
            </Form.List>
          </TableBody>
        </Table>
      </TableContainer>
      
      {showNote && (
        <Form.Item name={noteFieldName} rules={required ? [requiredField] : []}>
          <Input.TextArea 
            placeholder={noteLabel}
            rows={3}
            style={{ borderRadius: 4 }}
            readOnly={readOnly}
            disabled={readOnly}
          />
        </Form.Item>
      )}
    </>
  );

  // Si showTitle es false, devolver solo el contenido sin wrapper
  if (!showTitle) {
    return <>{content}</>;
  }

  // Si showTitle es true
  return (
    <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 4 }}>
      <Typography variant="h5" fontWeight={700} component={Stack} direction="row" alignItems="flex-end" spacing={1} mb={2}>
        <ShoppingCart />
        {title}
      </Typography>
      {content}
    </Box>
  );
};

export default ProductsTable;
