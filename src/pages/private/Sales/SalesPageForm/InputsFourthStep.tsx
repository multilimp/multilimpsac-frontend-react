import { Grid, Stack, Typography } from '@mui/material';
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
    <StepItemContent>
      <Typography variant="h5" fontWeight={700} component={Stack} direction="row" alignItems="flex-end" spacing={1} mb={2}>
        <Person />
        Contacto
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
            <InputAntd label="Nombre" disabled />
          </Form.Item>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Form.Item name="celularContacto" rules={[requiredField]}>
            <InputAntd label="Celular" disabled />
          </Form.Item>
        </Grid>
      </Grid>
    </StepItemContent>
  );
};

export default InputsFourthStep;
