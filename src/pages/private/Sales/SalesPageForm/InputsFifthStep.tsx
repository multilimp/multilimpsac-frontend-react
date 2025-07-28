import { Fragment } from 'react';
import { Form } from 'antd';
import { StepItemContent } from './smallcomponents';
import { requiredField } from './InputsFirstStep';
import { Button, FormHelperText, Stack, Typography, IconButton, Box } from '@mui/material';
import { Delete, Add, Inventory } from '@mui/icons-material';
import InputAntd from '@/components/InputAntd';

const generateEmptyProductRecord = () => ({
  codigo: '',
  descripcion: '',
  marca: '',
  cantidad: '',
});

const InputsFifthStep = () => {
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
      <Typography variant="h6" component={Stack} direction="row" alignItems="center" spacing={1} mb={2}>
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
            {fields.map((field) => (
              <Stack
                key={field.name}
                direction="row"
                alignItems="stretch"
                spacing={2}
                sx={{
                  mb: 2,
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  background: '#f8fafc',
                  boxShadow: '0 1px 4px rgba(49,138,248,0.04)',
                  flexWrap: { xs: 'wrap', md: 'nowrap' },
                }}
              >
                <Box sx={{ minWidth: 100, flex: 1, display: 'flex', alignItems: 'stretch' }}>
                  <Form.Item name={[field.name, 'codigo']} rules={[requiredField]} style={{ marginBottom: 0, width: '100%' }}>
                    <InputAntd
                      label="Código"
                      size="small"
                      style={{
                        minHeight: 64,
                        maxHeight: 64,
                        fontSize: 16,
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    />
                  </Form.Item>
                </Box>
                <Box sx={{ minWidth: 200, flex: 3, display: 'flex', alignItems: 'stretch' }}>
                  <Form.Item name={[field.name, 'descripcion']} rules={[requiredField]} style={{ marginBottom: 0, width: '100%' }}>
                    <InputAntd
                      label="Descripción"
                      size="small"
                      type="textarea"
                      rows={2}
                      style={{
                        resize: 'none',
                        minHeight: 64,
                        maxHeight: 64,
                        fontSize: 16,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    />
                  </Form.Item>
                </Box>
                <Box sx={{ minWidth: 100, flex: 1, display: 'flex', alignItems: 'stretch' }}>
                  <Form.Item name={[field.name, 'marca']} rules={[requiredField]} style={{ marginBottom: 0, width: '100%' }}>
                    <InputAntd
                      label="Marca"
                      size="small"
                      style={{
                        minHeight: 64,
                        maxHeight: 64,
                        fontSize: 16,
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    />
                  </Form.Item>
                </Box>
                <Box sx={{ minWidth: 100, flex: 1, display: 'flex', alignItems: 'stretch' }}>
                  <Form.Item name={[field.name, 'cantidad']} rules={[requiredField]} style={{ marginBottom: 0, width: '100%' }}>
                    <InputAntd
                      type="number"
                      label="Cantidad"
                      size="small"
                      style={{
                        minHeight: 64,
                        maxHeight: 64,
                        fontSize: 16,
                        fontWeight: 600,
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    />
                  </Form.Item>
                </Box>
                {fields.length > 1 && (
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => remove(field.name)}
                    sx={{ ml: 1, mt: { xs: 1, md: 0 }, alignSelf: 'center' }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                )}
              </Stack>
            ))}

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => add(generateEmptyProductRecord())}
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
