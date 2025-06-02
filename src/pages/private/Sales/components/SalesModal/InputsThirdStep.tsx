import { Form, FormInstance } from 'antd';
import { StepItemContent } from './smallcomponents';
import { Grid, Paper, Typography, Box, Divider } from '@mui/material';
import SelectGeneric from '@/components/selects/SelectGeneric';
import { requiredField } from './InputsFirstStep';
import DatePickerAntd from '@/components/DatePickerAnt';
import InputAntd from '@/components/InputAntd';
import InputFile from '@/components/InputFile';
import SelectCatalogs from '@/components/selects/SelectCatalogs';
import { Info, AttachMoney, Description } from '@mui/icons-material';

interface InputsThirdStepProps {
  form: FormInstance;
}

const etapaSIAFOptions = ['COM', 'DEV', 'PAG', 'SSIAF', 'RES', 'GIR', 'GIR-F', 'GIR-V', 'GIR-A', 'GIR-R'].map((value) => ({ label: value, value }));

const InputsThirdStep = ({ form }: InputsThirdStepProps) => {
  return (
    <StepItemContent title="DATOS GENERALES" subtitle="Ingresa la información solicitada">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Información Básica */}
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
              mb: 2, 
              color: '#111826',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Info sx={{ color: '#006DFA' }} />
            Información Básica
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <Form.Item name="catalogoComplete" noStyle />
              <Form.Item shouldUpdate noStyle>
                {({ getFieldValue, setFieldsValue }) => (
                  <Form.Item name="catalogo" rules={[requiredField]}>
                    <SelectCatalogs
                      companyId={getFieldValue('empresa')}
                      label="Catálogo"
                      onChange={(value, record: any) => setFieldsValue({ catalogo: value, catalogoComplete: record?.optiondata })}
                    />
                  </Form.Item>
                )}
              </Form.Item>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
              <Form.Item name="fechaFormalizacion" rules={[requiredField]}>
                <DatePickerAntd label="Fecha formalización" />
              </Form.Item>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
              <Form.Item name="fechaMaxEntrega" rules={[requiredField]}>
                <DatePickerAntd label="Fecha máxima de entrega" />
              </Form.Item>
            </Grid>
          </Grid>
        </Paper>

        {/* Información Financiera */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            bgcolor: '#ffffff', 
            borderRadius: 2,
            border: '1px solid #e0e0e0'
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2, 
              color: '#111826',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <AttachMoney sx={{ color: '#006DFA' }} />
            Información Financiera
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 12 }}>
              <Form.Item name="montoVenta" rules={[requiredField]}>
                <InputAntd label="Monto de venta" type="number" />
              </Form.Item>
            </Grid>
          </Grid>
        </Paper>

        {/* Información SIAF */}
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
              mb: 2, 
              color: '#111826',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Description sx={{ color: '#006DFA' }} />
            Información SIAF
          </Typography>
          <Grid container spacing={3}>
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
        </Paper>

        {/* Documentos */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            bgcolor: '#ffffff', 
            borderRadius: 2,
            border: '1px solid #e0e0e0'
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2, 
              color: '#111826',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Description sx={{ color: '#006DFA' }} />
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
        </Paper>
      </Box>
    </StepItemContent>
  );
};

export default InputsThirdStep;
