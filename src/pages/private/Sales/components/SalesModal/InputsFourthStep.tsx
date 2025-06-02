import { Grid, Paper, Typography } from '@mui/material';
import { Form, FormInstance } from 'antd';
import { StepItemContent } from './smallcomponents';
import { requiredField } from './InputsFirstStep';
import InputAntd from '@/components/InputAntd';
import SelectContacts from '@/components/selects/SelectContacts';
import { Person } from '@mui/icons-material';

interface InputsFourthStepProps {
  form: FormInstance;
}

const InputsFourthStep = ({ form }: InputsFourthStepProps) => {
  return (
    <StepItemContent title="INFORMACIÓN DE CONTACTO" subtitle="Ingresa la información solicitada">
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          bgcolor: '#f8f9fa', 
          borderRadius: 2,
          border: '1px solid #e9ecef'
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 3, 
            color: '#111826',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Person sx={{ color: '#006DFA' }} />
          Datos del Contacto
        </Typography>
          <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Form.Item name="cargoContactoComplete" noStyle />
            <Form.Item name="cargoContacto" rules={[requiredField]}>
              <SelectContacts
                label="Cargo"
                onChange={(value, record: any) =>
                  form.setFieldsValue({
                    cargoContacto: value,
                    cargoContactoComplete: record?.optiondata,
                    nombreContacto: record?.optiondata?.cargo,
                    celularContacto: record?.optiondata?.telefono,
                  })
                }
              />
            </Form.Item>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Form.Item name="nombreContacto" rules={[requiredField]}>
              <InputAntd 
                label="Nombre" 
                disabled 
              />
            </Form.Item>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Form.Item name="celularContacto" rules={[requiredField]}>
              <InputAntd 
                label="Celular" 
                disabled 
              />
            </Form.Item>
          </Grid>
        </Grid>
      </Paper>
    </StepItemContent>
  );
};

export default InputsFourthStep;
