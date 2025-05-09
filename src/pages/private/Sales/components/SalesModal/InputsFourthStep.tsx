import { Grid } from '@mui/material';
import { Form } from 'antd';
import { Controls, ControlActionsProps, StepItemContent } from './smallcomponents';
import SelectGeneric from '@/components/selects/SelectGeneric';
import { requiredField } from './InputsFirstStep';
import InputAntd from '@/components/InputAntd';

interface InputsFourthStepProps extends ControlActionsProps {}

const InputsFourthStep = ({ form, ...controlProps }: InputsFourthStepProps) => {
  return (
    <StepItemContent title="INFORMACIÓN DE CONTACTO" subtitle="Ingresa la información solicitada">
      <Grid container columnSpacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Form.Item name="cargoContacto" rules={[requiredField]}>
            <SelectGeneric label="Cargo" options={[{ label: 'Cargo estático de prueba', value: 1 }]} />
          </Form.Item>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Form.Item name="nombreContacto" rules={[requiredField]}>
            <InputAntd label="Nombre" />
          </Form.Item>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Form.Item name="celularContacto" rules={[requiredField]}>
            <InputAntd label="Celular" />
          </Form.Item>
        </Grid>
      </Grid>

      <Controls fieldsToValidate={['cargoContacto', 'nombreContacto', 'celularContacto']} form={form} {...controlProps} />
    </StepItemContent>
  );
};

export default InputsFourthStep;
