
import { Grid } from '@mui/material';
import { Form } from 'antd';
import { Controls, ControlActionsProps, StepItemContent } from './smallcomponents';
import { requiredField } from './InputsFirstStep';
import InputAntd from '@/components/InputAntd';
import SelectContacts from '@/components/selects/SelectContacts';

interface InputsFourthStepProps extends ControlActionsProps {}

const InputsFourthStep = ({ form, ...controlProps }: InputsFourthStepProps) => {
  return (
    <StepItemContent title="INFORMACIÓN DE CONTACTO" subtitle="Ingresa la información solicitada">
      <Grid container columnSpacing={2}>
        <Grid container item xs={12} sm={6} md={4}>
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
        <Grid container item xs={12} sm={6} md={4}>
          <Form.Item name="nombreContacto" rules={[requiredField]}>
            <InputAntd label="Nombre" disabled />
          </Form.Item>
        </Grid>
        <Grid container item xs={12} sm={6} md={4}>
          <Form.Item name="celularContacto" rules={[requiredField]}>
            <InputAntd label="Celular" disabled />
          </Form.Item>
        </Grid>
      </Grid>

      <Controls fieldsToValidate={['cargoContacto', 'nombreContacto', 'celularContacto']} form={form} {...controlProps} />
    </StepItemContent>
  );
};

export default InputsFourthStep;
