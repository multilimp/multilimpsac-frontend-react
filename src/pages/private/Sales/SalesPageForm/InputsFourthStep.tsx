import { Box, Grid, Stack, Typography } from '@mui/material';
import { Form, FormInstance } from 'antd';
import { StepItemContent } from './smallcomponents';
import { requiredField } from './InputsFirstStep';
import InputAntd from '@/components/InputAntd';
import SelectContactsByClient from '@/components/selects/SelectContactsByClient';
import { Person } from '@mui/icons-material';

interface InputsFourthStepProps {
  form: FormInstance;
  isPrivateSale?: boolean;
}

const InputsFourthStep = ({ form, isPrivateSale = false }: InputsFourthStepProps) => {
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
        <Typography variant="h6" fontWeight={600} component={Stack} direction="row" alignItems="flex-end" spacing={1} mb={2} sx={{ color: '#1f2937' }}>
          <Person />
          Contacto
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Form.Item name="cargoContactoComplete" noStyle />
            <Form.Item name="cargoContacto" rules={conditionalRules}>
              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => {
                  const clienteEstado = getFieldValue('clienteEstado');
                  return (
                    <SelectContactsByClient
                      clientId={clienteEstado?.id}
                      value={getFieldValue('cargoContacto')} // <-- Esto selecciona el contacto correcto
                      onChange={(value, record: any) =>
                        form.setFieldsValue({
                          cargoContacto: value,
                          cargoContactoComplete: record?.optiondata,
                          nombreContacto: record?.optiondata?.nombre,
                          celularContacto: record?.optiondata?.telefono,
                        })
                      }
                      onContactCreated={() => {
                        // Refrescar la lista de contactos del hook
                        // El hook ya se actualiza automáticamente
                      }}
                    />
                  );
                }}
              </Form.Item>
            </Form.Item>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Form.Item name="nombreContacto" >
              <InputAntd label="Nombre" disabled />
            </Form.Item>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Form.Item name="celularContacto" >
              <InputAntd label="Celular" disabled />
            </Form.Item>
          </Grid>
        </Grid>
      </Box>
    </StepItemContent>
  );
};

export default InputsFourthStep;
