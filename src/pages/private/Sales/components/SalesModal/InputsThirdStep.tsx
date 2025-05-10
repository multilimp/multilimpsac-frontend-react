
import { Form } from 'antd';
import { Controls, ControlActionsProps, StepItemContent } from './smallcomponents';
import { Grid } from '@mui/material';
import SelectGeneric from '@/components/selects/SelectGeneric';
import { requiredField } from './InputsFirstStep';
import DatePickerAntd from '@/components/DatePickerAnt';
import InputAntd from '@/components/InputAntd';
import InputFile from '@/components/InputFile';
import SelectCatalogs from '@/components/selects/SelectCatalogs';

interface InputsThirdStepProps extends ControlActionsProps {}

const etapaSIAFOptions = ['COM', 'DEV', 'PAG', 'SSIAF', 'RES', 'GIR', 'GIR-F', 'GIR-V', 'GIR-A', 'GIR-R'].map((value) => ({ label: value, value }));

const InputsThirdStep = ({ form, ...controlProps }: InputsThirdStepProps) => {
  return (
    <StepItemContent title="DATOS GENERALES" subtitle="Ingresa la información solicitada">
      <Grid container spacing={2}>
        <Grid xs={12} sm={12} md={4} lg={3}>
          <Form.Item name="catalogoComplete" noStyle />
          <Form.Item name="catalogo" rules={[requiredField]}>
            <SelectCatalogs
              label="Catálogo"
              onChange={(value, record: any) => form.setFieldsValue({ catalogo: value, catalogoComplete: record?.optiondata })}
            />
          </Form.Item>
        </Grid>
        <Grid xs={12} sm={6} md={4} lg={3}>
          <Form.Item name="fechaFormalizacion" rules={[requiredField]}>
            <DatePickerAntd label="Fecha formalización" />
          </Form.Item>
        </Grid>
        <Grid xs={12} sm={6} md={4} lg={3}>
          <Form.Item name="fechaMaxEntrega" rules={[requiredField]}>
            <DatePickerAntd label="Fecha máxima de entrega" />
          </Form.Item>
        </Grid>
        <Grid xs={12} sm={6} md={6} lg={3}>
          <Form.Item name="montoVenta" rules={[requiredField]}>
            <InputAntd label="Monto de venta" type="number" />
          </Form.Item>
        </Grid>
        <Grid xs={12} sm={6} md={6} lg={4}>
          <Form.Item name="numeroSIAF" rules={[requiredField]}>
            <InputAntd label="Número de SIAF" />
          </Form.Item>
        </Grid>
        <Grid xs={12} sm={6} md={6} lg={4}>
          <Form.Item name="etapaSIAF" rules={[requiredField]}>
            <SelectGeneric label="Etapa SIAF" options={etapaSIAFOptions} />
          </Form.Item>
        </Grid>
        <Grid xs={12} sm={6} md={6} lg={4}>
          <Form.Item name="fechaSIAF" rules={[requiredField]}>
            <DatePickerAntd label="Fecha de SIAF" />
          </Form.Item>
        </Grid>
        <Grid xs={12} sm={6} md={6} lg={6}>
          <Form.Item name="ordenCompraElectronica" rules={[requiredField]}>
            <InputFile onChange={(file) => form.setFieldValue('ordenCompraElectronica', file)} label="Órden de compra electrónica" accept="pdf" />
          </Form.Item>
        </Grid>
        <Grid xs={12} sm={6} md={6} lg={6}>
          <Form.Item name="ordenCompraFisica" rules={[requiredField]}>
            <InputFile onChange={(file) => form.setFieldValue('ordenCompraFisica', file)} label="Órden de compra física" accept="pdf" />
          </Form.Item>
        </Grid>
      </Grid>

      <Controls
        fieldsToValidate={[
          'catalogo',
          'fechaFormalizacion',
          'fechaMaxEntrega',
          'montoVenta',
          'numeroSIAF',
          'etapaSIAF',
          'fechaSIAF',
          'ordenCompraElectronica',
          'ordenCompraFisica',
        ]}
        form={form}
        {...controlProps}
      />
    </StepItemContent>
  );
};

export default InputsThirdStep;
