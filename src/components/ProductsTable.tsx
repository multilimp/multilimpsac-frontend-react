import React, { Fragment } from 'react';
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
  FormHelperText
} from '@mui/material';
import { Form, Input, InputNumber } from 'antd';
import { Delete, ShoppingCart } from '@mui/icons-material';
import { formatCurrency } from '@/utils/functions';
import { StepItemContent } from '@/pages/private/Sales/SalesPageForm/smallcomponents';

interface ProductsTableProps {
  // Configuración del formulario
  form: any;
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
  cantidad: 0,
  cAlmacen: 0,
  cTotal: 0,
  precioUnitario: 0,
  total: 0
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

  const calculateProductSubTotal = (index: number) => {
    const record = form.getFieldValue([fieldName, index]);
    const sum = (record.cTotal || 0) * (record.precioUnitario || 0);
    form.setFieldValue([fieldName, index, 'total'], sum);
    if (onProductChange) {
      onProductChange(index);
    }
  };

  const validationRules = required ? [
    {
      validator(_: any, arr: any[]) {
        if (!arr || arr.length < minProducts) {
          return Promise.reject(new Error(`Debe ingresar por lo menos ${minProducts} producto(s) para continuar.`));
        }
        return Promise.resolve();
      },
    },
  ] : [];

  const cellStyle = {
    p: compact ? 0.125 : 0.25
  };

  const inputStyle = {
    width: '100%',
    borderRadius: 0,
    borderColor: '#8377a890'
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
              {!readOnly && showDeleteButton && <TableCell sx={{ p: 0, fontSize: 12 }}></TableCell>}
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
                  {fields.map((field) => (
                    <TableRow key={field.name} sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
                      {showFields.codigo && (
                        <TableCell sx={cellStyle}>
                          <Form.Item className="m-0" name={[field.name, 'codigo']} rules={required ? [requiredField] : []}>
                            <Input
                              size="middle"
                              style={inputStyle}
                              readOnly={readOnly}
                              disabled={readOnly}
                            />
                          </Form.Item>
                        </TableCell>
                      )}
                      {showFields.descripcion && (
                        <TableCell sx={cellStyle}>
                          <Form.Item className="m-0" name={[field.name, 'descripcion']} rules={required ? [requiredField] : []}>
                            <Input
                              size="middle"
                              style={inputStyle}
                              readOnly={readOnly}
                              disabled={readOnly}
                            />
                          </Form.Item>
                        </TableCell>
                      )}
                      {showFields.uMedida && (
                        <TableCell sx={cellStyle}>
                          <Form.Item className="m-0" name={[field.name, 'uMedida']} rules={required ? [requiredField] : []}>
                            <Input
                              size="middle"
                              style={inputStyle}
                              readOnly={readOnly}
                              disabled={readOnly}
                            />
                          </Form.Item>
                        </TableCell>
                      )}
                      {showFields.cantidad && (
                        <TableCell sx={cellStyle}>
                          <Form.Item className="m-0" name={[field.name, 'cantidad']} rules={required ? [requiredField] : []}>
                            <InputNumber
                              size="middle"
                              min={0}
                              style={inputStyle}
                              readOnly={readOnly}
                              disabled={readOnly}
                            />
                          </Form.Item>
                        </TableCell>
                      )}
                      {showFields.cAlmacen && (
                        <TableCell sx={cellStyle}>
                          <Form.Item className="m-0" name={[field.name, 'cAlmacen']} rules={required ? [requiredField] : []}>
                            <InputNumber
                              size="middle"
                              min={0}
                              style={inputStyle}
                              readOnly={readOnly}
                              disabled={readOnly}
                            />
                          </Form.Item>
                        </TableCell>
                      )}
                      {showFields.cTotal && (
                        <TableCell sx={cellStyle}>
                          <Form.Item className="m-0" name={[field.name, 'cTotal']} rules={required ? [requiredField] : []}>
                            <InputNumber
                              size="middle"
                              min={0}
                              style={inputStyle}
                              onChange={() => calculateProductSubTotal(field.name)}
                              readOnly={readOnly}
                              disabled={readOnly}
                            />
                          </Form.Item>
                        </TableCell>
                      )}
                      {showFields.precioUnitario && (
                        <TableCell sx={cellStyle}>
                          <Form.Item className="m-0" name={[field.name, 'precioUnitario']} rules={required ? [requiredField] : []}>
                            <InputNumber
                              size="middle"
                              min={0}
                              style={inputStyle}
                              onChange={() => calculateProductSubTotal(field.name)}
                              readOnly={readOnly}
                              disabled={readOnly}
                            />
                          </Form.Item>
                        </TableCell>
                      )}
                      {showFields.total && (
                        <TableCell sx={cellStyle}>
                          <Form.Item className="m-0" name={[field.name, 'total']}>
                            <InputNumber
                              size="middle"
                              min={0}
                              style={inputStyle}
                              readOnly
                              disabled
                            />
                          </Form.Item>
                        </TableCell>
                      )}
                      {!readOnly && showDeleteButton && (
                        <TableCell sx={cellStyle}>
                          <IconButton size="small" color="error" onClick={() => remove(field.name)}>
                            <Delete fontSize="medium" />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                  
                  {(!readOnly || showTotal || showAddButton) && (
                    <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
                      <TableCell colSpan={2}>
                        {errors.length ? <FormHelperText error>{(errors as Array<string>).join(' - ')}</FormHelperText> : null}
                      </TableCell>
                      {!readOnly && showAddButton && (
                        <TableCell colSpan={3} sx={cellStyle}>
                          <Button fullWidth size="small" onClick={() => add(getEmptyProductRecord())} sx={{ borderRadius: 0.75 }}>
                            AÑADIR PRODUCTOS
                          </Button>
                        </TableCell>
                      )}
                      {readOnly && (
                        <TableCell colSpan={3} />
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
                                <Stack
                                  direction="row"
                                  justifyContent="space-between"
                                  bgcolor="secondary.main"
                                  color="#fff"
                                  px={1}
                                  py={0.8}
                                  borderRadius={0.5}
                                >
                                  <Typography component="span" variant="body2" children="Pago Total" />
                                  <Typography component="span" variant="body2" children={formatCurrency(sum)} />
                                </Stack>
                              );
                            }}
                          </Form.Item>
                        </TableCell>
                      )}
                      {!readOnly && showDeleteButton && <TableCell />}
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

  // Si showTitle es true, envolver en StepItemContent
  return (
    <StepItemContent>
      <Typography variant="h5" fontWeight={700} component={Stack} direction="row" alignItems="flex-end" spacing={1} mb={2}>
        <ShoppingCart />
        {title}
      </Typography>
      {content}
    </StepItemContent>
  );
};

export default ProductsTable;
