import { Form, FormInstance, Input, Select, Button, Table, Card, Row, Col, Typography, InputNumber } from 'antd';
import { ShoppingCartOutlined, PlusOutlined, DeleteOutlined, CreditCardOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import InputAntd from '@/components/InputAntd';
import SelectGeneric from '@/components/selects/SelectGeneric';
import InputNumberAntd from '@/components/InputNumberAntd';

const { Option } = Select;
const { Text, Title } = Typography;

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
  unidadMedida: 'UND',
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

  // Columns definition for AntD Table
  const getColumns = (remove: (index: number | number[]) => void) => [
    {
      title: '',
      width: 50,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: 'Código',
      dataIndex: 'codigo',
      render: (_: unknown, field: { name: number }) => (
        <Form.Item
          name={[field.name, 'codigo']}
          rules={[{ required: true, message: 'Requerido' }]}
          style={{ margin: 0 }}
        >
          <InputAntd placeholder="Código" />
        </Form.Item>
      ),
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      render: (_: unknown, field: { name: number }) => (
        <Form.Item
          name={[field.name, 'descripcion']}
          rules={[{ required: true, message: 'Requerido' }]}
          style={{ margin: 0 }}
        >
          <InputAntd placeholder="Descripción" />
        </Form.Item>
      ),
    },
    {
      title: 'U. Medida',
      dataIndex: 'unidadMedida',
      render: (_: unknown, field: { name: number }) => (
        <Form.Item
          name={[field.name, 'unidadMedida']}
          style={{ margin: 0 }}
        >
          <SelectGeneric
            size="large"
            style={{ width: '100%' }}
          >
            {unidadesMedida.map(unidad => (
              <Option key={unidad} value={unidad}>{unidad}</Option>
            ))}
          </SelectGeneric>
        </Form.Item>
      ),
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      render: (_: unknown, field: { name: number }) => (
        <Form.Item
          name={[field.name, 'cantidad']}
          rules={[{ required: true, message: 'Requerido' }]}
          style={{ margin: 0 }}
        >
          <InputNumberAntd
            placeholder="0"
            size="small"
            min={0}
            style={{ width: '100%', borderRadius: 4 }}
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
      ),
    },
    {
      title: 'En Almacén',
      dataIndex: 'cantidadAlmacen',
      render: (_: unknown, field: { name: number }) => (
        <Form.Item
          name={[field.name, 'cantidadAlmacen']}
          style={{ margin: 0 }}
        >
          <InputNumberAntd
            placeholder="0"
            size="small"
            min={0}
            style={{ width: '100%', borderRadius: 4 }}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Precio Unit.',
      dataIndex: 'precioUnitario',
      render: (_: unknown, field: { name: number }) => (
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
            style={{ width: '100%', borderRadius: 4 }}
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
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      render: (_: unknown, field: { name: number }) => (
        <Form.Item
          name={[field.name, 'total']}
          style={{ margin: 0 }}
        >
          <InputNumberAntd
            placeholder="0.00"
            size="small"
            disabled
            isCurrency
            style={{ width: '100%', borderRadius: 4, backgroundColor: '#f5f5f5' }}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Acciones',
      width: 80,
      render: (_: unknown, field: { name: number }) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => remove(field.name)}
        />
      ),
    },
  ];

  return (
    <>
      {/* Tabla de productos editable */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingCartOutlined style={{ color: '#1890ff', fontSize: 20 }} />
            <span>Productos de la Cotización</span>
          </div>
        }
        style={{ marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        <Form.List
          name="productos"
          initialValue={[getEmptyProductRecord()]}
          rules={[
            {
              validator: async (_, arr) => {
                if (!arr || arr.length < 1) {
                  return Promise.reject(new Error('Debe ingresar al menos 1 producto'));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }) => (
            <Table
              dataSource={fields}
              columns={getColumns(remove)}
              pagination={false}
              rowKey="key"
              footer={() => (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button
                    onClick={() => add(getEmptyProductRecord())}
                    color="primary"
                    icon={<PlusOutlined />}
                  >
                    Agregar Producto
                  </Button>
                  <Form.Item noStyle shouldUpdate>
                    {() => {
                      const productos = form.getFieldValue('productos') || [];
                      const total = productos.reduce((sum: number, prod: ProductoRecord) =>
                        sum + (Number(prod?.total) || 0), 0
                      );
                      return (
                        <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                          Total: S/ {total.toFixed(2)}
                        </Text>
                      );
                    }}
                  </Form.Item>
                </div>
              )}
            />
          )}
        </Form.List>
      </Card>

      {/* Sección de pago y notas */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CreditCardOutlined style={{ color: '#1890ff', fontSize: 20 }} />
            <span>Información de Pago y Notas</span>
          </div>
        }
        style={{ marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
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
          </Col>

          <Col xs={24} md={12}>
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
          </Col>

          <Col xs={24}>
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
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default QuotesFormThirdStep;
