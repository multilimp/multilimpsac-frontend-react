import { Fragment } from 'react';
import { Form } from 'antd';
import { StepItemContent } from './smallcomponents';
import { requiredField } from './InputsFirstStep';
import { Button, FormHelperText, Stack, Typography, IconButton } from '@mui/material';
import { Delete, Add, Inventory } from '@mui/icons-material';
import InputAntd from '@/components/InputAntd';

const generateEmptyProductRecord = () => ({
  codigo: '',
  descripcion: '',
  marca: '',
  cantidad: '',
});

const InputsFifthStep = () => {
    // Aquí podrías usar un estado o props para manejar los productos si es necesario
    const productos = Form.useWatch('productos', Form.useFormInstance());

    console.log(productos);

  return (
    <StepItemContent>
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
              // 🔧 Validación robusta para asegurar que arr es un array
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
                spacing={2} 
                alignItems="flex-start"
                sx={{ mb: 2 }}
              >
                <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
                  <div style={{ width: '15%' }}>
                    <Form.Item name={[field.name, 'codigo']} rules={[requiredField]}>
                      <InputAntd label="Código" size="small" />
                    </Form.Item>
                  </div>
                  
                  <div style={{ width: '45%' }}>
                    <Form.Item name={[field.name, 'descripcion']} rules={[requiredField]}>
                      <InputAntd label="Descripción" size="small" />
                    </Form.Item>
                  </div>
                  
                  <div style={{ width: '20%' }}>
                    <Form.Item name={[field.name, 'cantidad']} rules={[requiredField]}>
                      <InputAntd type="number" label="Cantidad" size="small" />
                    </Form.Item>
                  </div>
                  
                  <div style={{ width: '20%' }}>
                    <Form.Item name={[field.name, 'marca']} rules={[requiredField]}>
                      <InputAntd label="Marca" size="small" />
                    </Form.Item>
                  </div>
                </Stack>
                
                {fields.length > 1 && (
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => remove(field.name)}
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
    </StepItemContent>
  );
};

export default InputsFifthStep;
