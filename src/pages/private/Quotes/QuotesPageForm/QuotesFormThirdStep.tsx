import { Form, FormInstance, Input, InputNumber, Select } from 'antd';
import { 
  Grid, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton, 
  Button,
  Card,
  CardHeader,
  CardContent
} from '@mui/material';
import { StepItemContent } from '../../Sales/SalesPageForm/smallcomponents';
import { ShoppingCart, Add, Delete } from '@mui/icons-material';
import TextArea from 'antd/lib/input/TextArea';
import InputAntd from '@/components/InputAntd';
import SelectGeneric from '@/components/selects/SelectGeneric';
import InputNumberAntd from '@/components/InputNumberAntd';

const { Option } = Select;

type ProductoRecord = {
  codigo: string;
  descripcion: string;
  unidadMedida: string;
  cantidad: string;
  cantidadAlmacen: string;
  precioUnitario: string;
  total: string;
};

const getEmptyProductRecord = (): ProductoRecord => ({
  codigo: '',
  descripcion: '',
  unidadMedida: '',
  cantidad: '',
  cantidadAlmacen: '',
  precioUnitario: '',
  total: '',
});

const QuotesFormThirdStep = ({ form }: { form: FormInstance }) => {
  const unidadesMedida = [
    'UND', 'KG', 'MT', 'LT', 'M2', 'M3', 'PAR', 'DOC', 'CJA', 'PAQ'
  ];

  const tipoPagoOptions = [
    { label: 'Contado', value: 'CONTADO' },
    { label: 'Crédito', value: 'CREDITO' },
    { label: 'Anticipado', value: 'ANTICIPADO' },
    { label: 'Otros', value: 'OTROS' },
  ];

  return (
    <>
      {/* Tabla de productos editable */}
      <Card>
        <CardHeader
          title={
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShoppingCart color="primary" />
              Productos de la Cotización
            </Typography>
          }
          sx={{ pb: 1 }}
        />
        <CardContent>
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Código</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Descripción</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>U. Medida</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Cantidad</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>En Almacén</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Precio Unit.</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 12, width: 80 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <Form.List
                  name="productos"
                  initialValue={[getEmptyProductRecord()]}
                  rules={[
                    {
                      validator(_, arr) {
                        if (!arr || arr.length < 1) {
                          return Promise.reject(new Error('Debe ingresar al menos 1 producto'));
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field) => (
                        <TableRow key={field.name} sx={{ '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.04)' } }}>
                          <TableCell sx={{ p: 1 }}>
                            <Form.Item
                              name={[field.name, 'codigo']}
                              rules={[{ required: true, message: 'Requerido' }]}
                              style={{ margin: 0 }}
                            >
                              <InputAntd
                                placeholder="Código"
                              />
                            </Form.Item>
                          </TableCell>
                          <TableCell sx={{ p: 1 }}>
                            <Form.Item
                              name={[field.name, 'descripcion']}
                              rules={[{ required: true, message: 'Requerido' }]}
                              style={{ margin: 0 }}
                            >
                              <InputAntd
                                placeholder="Descripción"
                              />
                            </Form.Item>
                          </TableCell>
                          <TableCell sx={{ p: 1 }}>
                            <Form.Item
                              name={[field.name, 'unidadMedida']}
                              style={{ margin: 0 }}
                            >
                              <SelectGeneric
                                size="large"
                                style={{ width: '100%' }}
                                defaultValue="und"
                              >
                                {unidadesMedida.map(unidad => (
                                  <Option key={unidad} value={unidad}>{unidad}</Option>
                                ))}
                              </SelectGeneric>
                            </Form.Item>
                          </TableCell>
                          <TableCell sx={{ p: 1 }}>
                            <Form.Item
                              name={[field.name, 'cantidad']}
                              rules={[{ required: true, message: 'Requerido' }]}
                              style={{ margin: 0 }}
                            >
                              <InputNumberAntd
                                placeholder="0"
                                size="small"
                                min={0}
                                style={{
                                  width: '100%',
                                  borderRadius: 4,
                                }}
                                onChange={() => {
                                  setTimeout(() => {
                                    const productos = form.getFieldValue('productos') || [];
                                    const producto = productos[field.name];
                                    if (producto) {
                                      const cantidad = Number(producto.cantidad) || 0;
                                      const precioUnitario = Number(producto.precioUnitario) || 0;
                                      const total = cantidad * precioUnitario;
                                      form.setFieldValue(['productos', field.name, 'total'], total);
                                    }
                                  }, 100);
                                }}
                              />
                            </Form.Item>
                          </TableCell>
                          <TableCell sx={{ p: 1 }}>
                            <Form.Item
                              name={[field.name, 'cantidadAlmacen']}
                              style={{ margin: 0 }}
                            >
                              <InputNumberAntd
                                placeholder="0"
                                size="small"
                                min={0}
                                style={{
                                  width: '100%',
                                  borderRadius: 4,
                                }}
                              />
                            </Form.Item>
                          </TableCell>
                          <TableCell sx={{ p: 1 }}>
                            <Form.Item
                              name={[field.name, 'precioUnitario']}
                              rules={[{ required: true, message: 'Requerido' }]}
                              style={{ margin: 0 }}
                            >
                              <InputNumberAntd
                                placeholder="0.00"
                                size="small"
                                min={0}
                                step={0.01}
                                isCurrency
                                style={{
                                  width: '100%',
                                  borderRadius: 4,
                                }}
                                onChange={() => {
                                  setTimeout(() => {
                                    const productos = form.getFieldValue('productos') || [];
                                    const producto = productos[field.name];
                                    if (producto) {
                                      const cantidad = Number(producto.cantidad) || 0;
                                      const precioUnitario = Number(producto.precioUnitario) || 0;
                                      const total = cantidad * precioUnitario;
                                      form.setFieldValue(['productos', field.name, 'total'], total);
                                    }
                                  }, 100);
                                }}
                              />
                            </Form.Item>
                          </TableCell>
                          <TableCell sx={{ p: 1 }}>
                            <Form.Item
                              name={[field.name, 'total']}
                              style={{ margin: 0 }}
                            >
                              <InputNumberAntd
                                placeholder="0.00"
                                size="small"
                                disabled
                                isCurrency
                                style={{
                                  width: '100%',
                                  borderRadius: 4,
                                  backgroundColor: '#f5f5f5',
                                }}
                              />
                            </Form.Item>
                          </TableCell>
                          <TableCell sx={{ p: 1 }}>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => remove(field.name)}
                              sx={{ fontSize: 14 }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: 'right' }}>
                          <Button
                            onClick={() => add(getEmptyProductRecord())}
                            startIcon={<Add />}
                            variant="outlined"
                            size="small"
                            sx={{
                              width: 'auto',
                              py: 1,
                              bgcolor: '#189dff',
                              color: 'white',
                              borderColor: '#1890ff'
                            }}
                          >
                            Agregar Producto
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Form.Item noStyle shouldUpdate>
                            {() => {
                              const productos = form.getFieldValue('productos') || [];
                              const total = productos.reduce((sum: number, prod: ProductoRecord) =>
                                sum + (Number(prod?.total) || 0), 0
                              );
                              return (
                                <Typography
                                  variant="body2"
                                  fontWeight={700}
                                  color="primary"
                                  sx={{ textAlign: 'center' }}
                                >
                                  S/ {total.toFixed(2)}
                                </Typography>
                              );
                            }}
                          </Form.Item>
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </Form.List>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Sección de pago y notas reorganizada */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title={
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" color="primary">
                💳
              </Typography>
              Información de Pago y Notas
            </Typography>
          }
          sx={{ pb: 1 }}
        />
        <CardContent>
          <Grid container columnSpacing={2} rowSpacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Form.Item 
                name="tipoPago"
                label="Tipo de Pago"
                rules={[{ required: true, message: 'Seleccione el tipo de pago' }]}
                initialValue="CONTADO"
              >
                <Select placeholder="Seleccione tipo de pago" size="large">
                  {tipoPagoOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Form.Item 
                name="notaPago"
                label="Nota de Pago"
              >
                <TextArea
                  placeholder="Nota de pago (opcional)"
                  rows={2}
                  maxLength={500}
                  showCount
                  style={{ resize: 'none' }}
                />
              </Form.Item>
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <Form.Item 
                name="notaPedido"
                label="Nota del Pedido"
              >
                <TextArea
                  placeholder="Nota del pedido (opcional)"
                  rows={3}
                  maxLength={500}
                  showCount
                  style={{ resize: 'none' }}
                />
              </Form.Item>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default QuotesFormThirdStep;

