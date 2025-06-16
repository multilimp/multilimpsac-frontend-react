import { Fragment } from 'react';
import { Form } from 'antd';
import { StepItemContent } from './smallcomponents';
import { requiredField } from './InputsFirstStep';
import { Button, FormHelperText, Stack, Paper, Typography, Box, IconButton, Grid } from '@mui/material';
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
      <Typography variant="h5" fontWeight={700} component={Stack} direction="row" alignItems="flex-end" spacing={1} mb={2}>
        <Inventory />
        Productos
      </Typography>

      <Form.List
        name="productos"
        initialValue={[generateEmptyProductRecord()]}
        rules={[
          {
            validator(_, arr) {
              if (!arr.length) {
                return Promise.reject(new Error('Debe ingresar por lo menos 1 producto para continuar.'));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <Fragment>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {fields.map((field) => (
                <Paper
                  key={field.name}
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: '#ffffff',
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    position: 'relative',
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" spacing={1}>
                        <Box sx={{ width: '15%' }}>
                          <Form.Item name={[field.name, 'codigo']} rules={[requiredField]}>
                            <InputAntd label="Código" size="small" />
                          </Form.Item>
                        </Box>
                        
                        <Box sx={{ width: '45%' }}>
                          <Form.Item name={[field.name, 'descripcion']} rules={[requiredField]}>
                            <InputAntd label="Descripción" size="small" />
                          </Form.Item>
                        </Box>
                        
                        <Box sx={{ width: '20%' }}>
                          <Form.Item name={[field.name, 'cantidad']} rules={[requiredField]}>
                            <InputAntd type="number" label="Cantidad" size="small" />
                          </Form.Item>
                        </Box>
                        
                        <Box sx={{ width: '20%' }}>
                          <Form.Item name={[field.name, 'marca']} rules={[requiredField]}>
                            <InputAntd label="Marca" size="small" />
                          </Form.Item>
                        </Box>
                      </Stack>
                    </Box>
                    {fields.length > 1 && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => remove(field.name)}
                        sx={{
                          mt: 3,
                          bgcolor: '#fff5f5',
                          border: '1px solid #fed7d7',
                          '&:hover': {
                            bgcolor: '#fed7d7',
                          },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>
                </Paper>
              ))}
            </Box>

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
              <Button
                size="medium"
                variant="outlined"
                startIcon={<Add />}
                onClick={() => add(generateEmptyProductRecord())}
                sx={{
                  borderColor: '#006DFA',
                  color: '#006DFA',
                  '&:hover': {
                    borderColor: '#111826',
                    bgcolor: '#006DFA',
                    color: 'white',
                  },
                }}
              >
                AGREGAR PRODUCTO
              </Button>
              {errors.length ? (
                <FormHelperText error sx={{ fontSize: '0.875rem' }}>
                  {(errors as Array<string>).join(' - ')}
                </FormHelperText>
              ) : null}
            </Stack>
          </Fragment>
        )}
      </Form.List>
    </StepItemContent>
  );
};

export default InputsFifthStep;
