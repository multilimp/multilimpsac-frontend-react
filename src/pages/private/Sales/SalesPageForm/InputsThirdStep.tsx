import { Fragment } from 'react';
import { Form, FormInstance } from 'antd';
import { StepItemContent } from './smallcomponents';
import { Grid, Typography, Stack } from '@mui/material';
import SelectGeneric from '@/components/selects/SelectGeneric';
import { requiredField } from './InputsFirstStep';
import DatePickerAntd from '@/components/DatePickerAnt';
import InputAntd from '@/components/InputAntd';
import InputFile from '@/components/InputFile';
import SelectCatalogs from '@/components/selects/SelectCatalogs';
import { Info, Description } from '@mui/icons-material';

interface InputsThirdStepProps {
  form: FormInstance;
  companyId: number;
}

const etapaSIAFOptions = ['COM', 'DEV', 'PAG', 'SSIAF', 'RES', 'GIR', 'GIR-F', 'GIR-V', 'GIR-A', 'GIR-R'].map((value) => ({ label: value, value }));

const InputsThirdStep = ({ form, companyId }: InputsThirdStepProps) => {
  return (
    <Fragment>
      <StepItemContent>
        <Typography variant="h5" fontWeight={700} component={Stack} direction="row" alignItems="flex-end" spacing={1} mb={2}>
          <Info />
          Información Básica
        </Typography>

        <Grid container columnSpacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Form.Item name="catalogoComplete" noStyle />
            <Form.Item shouldUpdate noStyle>
              {({ setFieldsValue }) => (
                <Form.Item name="catalogo" rules={[requiredField]}>
                  <SelectCatalogs
                    companyId={companyId}
                    label="Catálogo"
                    onChange={(value, record: any) => setFieldsValue({ catalogo: value, catalogoComplete: record?.optiondata })}
                  />
                </Form.Item>
              )}
            </Form.Item>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Form.Item name="fechaFormalizacion" rules={[requiredField]}>
              <DatePickerAntd label="Fecha formalización" />
            </Form.Item>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Form.Item name="fechaMaxEntrega" rules={[requiredField]}>
              <DatePickerAntd label="Fecha máxima de entrega" />
            </Form.Item>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Form.Item name="montoVenta" rules={[requiredField]}>
              <InputAntd label="Monto de venta" type="number" />
            </Form.Item>
          </Grid>
        </Grid>
      </StepItemContent>

      <StepItemContent>
        <Typography variant="h5" fontWeight={700} component={Stack} direction="row" alignItems="flex-end" spacing={1} mb={2}>
          <Description />
          Información SIAF
        </Typography>

        <Grid container columnSpacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Form.Item name="numeroSIAF" rules={[requiredField]}>
              <InputAntd label="Número de SIAF" />
            </Form.Item>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Form.Item name="etapaSIAF" rules={[requiredField]}>
              <SelectGeneric label="Etapa SIAF" options={etapaSIAFOptions} />
            </Form.Item>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Form.Item name="fechaSIAF" rules={[requiredField]}>
              <DatePickerAntd label="Fecha de SIAF" />
            </Form.Item>
          </Grid>
        </Grid>
      </StepItemContent>

      <StepItemContent>
        <Typography variant="h5" fontWeight={700} component={Stack} direction="row" alignItems="flex-end" spacing={1} mb={2}>
          <Description />
          Documentos de Compra
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Form.Item name="ordenCompraElectronica" rules={[requiredField]}>
              <InputFile onChange={(file) => form.setFieldValue('ordenCompraElectronica', file)} label="Órden de compra electrónica" accept="pdf" />
            </Form.Item>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Form.Item name="ordenCompraFisica" rules={[requiredField]}>
              <InputFile onChange={(file) => form.setFieldValue('ordenCompraFisica', file)} label="Órden de compra física" accept="pdf" />
            </Form.Item>
          </Grid>
        </Grid>
      </StepItemContent>
    </Fragment>
  );
};

export default InputsThirdStep;
