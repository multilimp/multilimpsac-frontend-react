import { Fragment } from 'react';
import { Form, FormInstance } from 'antd';
import { StepItemContent } from './smallcomponents';
import { Grid, Typography, Stack, Box } from '@mui/material';
import SelectGeneric from '@/components/selects/SelectGeneric';
import { requiredField } from './InputsFirstStep';
import DatePickerAntd from '@/components/DatePickerAnt';
import InputAntd from '@/components/InputAntd';
import InputFile from '@/components/InputFile';
import SelectCatalogs from '@/components/selects/SelectCatalogs';
import { Info } from '@mui/icons-material';

interface InputsThirdStepProps {
  form: FormInstance;
  companyId: number;
}

const etapaSIAFOptions = ['COM', 'DEV', 'PAG', 'SSIAF', 'RES', 'GIR', 'GIR-F', 'GIR-V', 'GIR-A', 'GIR-R'].map((value) => ({ label: value, value }));

const InputsThirdStep = ({ form, companyId }: InputsThirdStepProps) => {
  return (
    <Fragment>
      <StepItemContent>
        <Box sx={{ backgroundColor: 'white', m: -2, p: 4, borderRadius: 1 }}>
          <Typography variant="h5" fontWeight={700} component={Stack} direction="row" alignItems="flex-end" spacing={1} mb={2}>
          <Info />
          Datos generales
        </Typography>
          {/* Primera fila: Datos principales */}
          <Grid container columnSpacing={2} rowSpacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Form.Item name="fechaFormalizacion" rules={[requiredField]}>
                <DatePickerAntd label="Fecha formalización" />
              </Form.Item>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Form.Item name="fechaMaxEntrega" rules={[requiredField]}>
                <DatePickerAntd label="Fecha máxima de entrega" />
              </Form.Item>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Form.Item name="montoVenta" rules={[requiredField]}>
                <InputAntd label="Monto de venta" type="number" />
              </Form.Item>
            </Grid>
          </Grid>

          {/* Segunda fila: Datos SIAF */}
          <Grid container columnSpacing={2} rowSpacing={2} sx={{ mt: 1 }}>
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

          {/* Tercera fila: Documentos */}
          <Grid container columnSpacing={2} rowSpacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Form.Item name="ordenCompraElectronica">
                <Form.Item shouldUpdate noStyle>
                  {({ getFieldValue }) => (
                    <InputFile 
                      onChange={(file) => form.setFieldValue('ordenCompraElectronica', file)} 
                      value={getFieldValue('ordenCompraElectronica')}
                      label="Orden de compra electrónica" 
                      accept="pdf" 
                    />
                  )}
                </Form.Item>
              </Form.Item>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Form.Item name="ordenCompraFisica">
                <Form.Item shouldUpdate noStyle>
                  {({ getFieldValue }) => (
                    <InputFile 
                      onChange={(file) => form.setFieldValue('ordenCompraFisica', file)} 
                      value={getFieldValue('ordenCompraFisica')}
                      label="Orden de compra física" 
                      accept="pdf" 
                    />
                  )}
                </Form.Item>
              </Form.Item>
            </Grid>
          </Grid>
        </Box>
      </StepItemContent>
    </Fragment>
  );
};

export default InputsThirdStep;