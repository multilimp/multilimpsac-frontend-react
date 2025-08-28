import { Fragment } from 'react';
import { Form, Card, Row, Col, Button as AntButton, Typography as AntTypography } from 'antd';
import { StepItemContent } from './smallcomponents';
import { requiredField } from './InputsFirstStep';
import { Button, FormHelperText, Stack, Typography, Box } from '@mui/material';
import { Add, Inventory } from '@mui/icons-material';
import { DeleteOutlined, ShoppingOutlined, TagOutlined, BarcodeOutlined, NumberOutlined } from '@ant-design/icons';
import InputAntd from '@/components/InputAntd';

const { Text } = AntTypography;

const generateEmptyProductRecord = () => ({
  codigo: '',
  descripcion: '',
  marca: '',
  cantidad: '',
});

const InputsFifthStep = ({ isPrivateSale = false }: { isPrivateSale?: boolean }) => {
  // Reglas condicionales: si es venta privada, ningún campo es obligatorio
  const conditionalRules = isPrivateSale ? [] : [requiredField];

  return (
    <StepItemContent>
      <Box
        sx={{
          backgroundColor: 'white',
          m: -2,
          p: 4,
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" fontWeight={600} component={Stack} direction="row" alignItems="center" spacing={1} mb={2} sx={{ color: '#1f2937' }}>
          <Inventory />
          Productos
        </Typography>

        <Form.List
          name="productos"
          initialValue={[generateEmptyProductRecord()]}
          rules={[
            {
              validator(_, arr) {
                if (!Array.isArray(arr) || !arr.length) {
                  return Promise.reject(new Error('Debe ingresar por lo menos 1 producto para continuar.'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <Fragment>
              <Stack spacing={2} sx={{ mb: 3 }}>
                {fields.map((field) => (
                  <Card
                    key={field.key}
                    style={{
                      borderRadius: 8,
                      border: '1px solid #d9d9d9',
                      background: '#fafafa',
                      padding: '4px',
                    }}
                  >
                    <Row gutter={[16, 16]} align="middle">
                      {/* Código */}
                      <Col span={4}>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong style={{ fontSize: 12, color: '#666' }}>
                            <BarcodeOutlined style={{ marginRight: 4 }} />
                            Código
                          </Text>
                        </div>
                        <Form.Item name={[field.name, 'codigo']} rules={conditionalRules} style={{ marginBottom: 0 }}>
                          <InputAntd
                            placeholder="Código del producto"
                            size="large"
                          />
                        </Form.Item>
                      </Col>

                      {/* Descripción */}
                      <Col span={10}>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong style={{ fontSize: 12, color: '#666' }}>
                            <ShoppingOutlined style={{ marginRight: 4 }} />
                            Descripción
                          </Text>
                        </div>
                        <Form.Item name={[field.name, 'descripcion']} rules={conditionalRules} style={{ marginBottom: 0 }}>
                          <InputAntd
                            placeholder="Descripción detallada del producto"
                            rows={2}
                            size="large"
                          />
                        </Form.Item>
                      </Col>

                      {/* Marca */}
                      <Col span={4}>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong style={{ fontSize: 12, color: '#666' }}>
                            <TagOutlined style={{ marginRight: 4 }} />
                            Marca
                          </Text>
                        </div>
                        <Form.Item name={[field.name, 'marca']} rules={conditionalRules} style={{ marginBottom: 0 }}>
                          <InputAntd
                            placeholder="Marca"
                            size="large"
                          />
                        </Form.Item>
                      </Col>

                      {/* Cantidad */}
                      <Col span={4}>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong style={{ fontSize: 12, color: '#666' }}>
                            <NumberOutlined style={{ marginRight: 4 }} />
                            Cantidad
                          </Text>
                        </div>
                        <Form.Item name={[field.name, 'cantidad']} rules={conditionalRules} style={{ marginBottom: 0 }}>
                          <InputAntd
                            type="number"
                            placeholder="0"
                            size="large"
                          />
                        </Form.Item>
                      </Col>

                      {/* Eliminar */}
                      <Col span={2}>
                        {fields.length > 1 && (
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '100%', paddingTop: '20px' }}>
                            <AntButton
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => remove(field.name)}
                              size="small"
                            />
                          </div>
                        )}
                      </Col>
                    </Row>
                  </Card>
                ))}
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => add(generateEmptyProductRecord())}
                  sx={{
                    backgroundColor: '#1890ff',
                    '&:hover': {
                      backgroundColor: '#40a9ff'
                    }
                  }}
                >
                  Agregar producto
                </Button>
                {errors.length > 0 && (
                  <FormHelperText error>
                    {(errors as Array<string>).join(' - ')}
                  </FormHelperText>
                )}
              </Stack>
            </Fragment>
          )}
        </Form.List>
      </Box>
    </StepItemContent>
  );
};

export default InputsFifthStep;
