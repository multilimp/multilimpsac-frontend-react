import { Fragment } from 'react';
import { Form, FormInstance } from 'antd';
import { StepItemContent } from './smallcomponents';
import { Grid, Typography, Stack, Box } from '@mui/material';
import SelectGeneric from '@/components/selects/SelectGeneric';
import { requiredField } from './InputsFirstStep';
import DatePickerAntd from '@/components/DatePickerAnt';
import InputAntd from '@/components/InputAntd';
import InputFile from '@/components/InputFile';
import SimpleFileUpload from '@/components/SimpleFileUpload';
import SelectCatalogs from '@/components/selects/SelectCatalogs';
import { Info } from '@mui/icons-material';

interface InputsThirdStepProps {
  form: FormInstance;
  companyId: number;
  isPrivateSale?: boolean;
}

const etapaSIAFOptions = ['COM', 'DEV', 'PAG', 'SSIAF', 'RES', 'GIR', 'GIR-F', 'GIR-V', 'GIR-A', 'GIR-R'].map((value) => ({ label: value, value }));

const InputsThirdStep = ({ form, companyId, isPrivateSale = false }: InputsThirdStepProps) => {
  // Reglas condicionales: si es venta privada, ningún campo es obligatorio
  const conditionalRules = isPrivateSale ? [] : [requiredField];
  const siafRules = isPrivateSale ? [] : [requiredField];

  return (
    <Fragment>
      <StepItemContent>
        <Box sx={{ backgroundColor: 'white', m: -2, p: 4, borderRadius: 1 }}>
          <Typography variant="h6" fontWeight={600} component={Stack} direction="row" alignItems="flex-end" spacing={1} mb={2} sx={{ color: '#1f2937' }}>
            <Info />
            Datos generales
          </Typography>
          {/* Primera fila: Datos principales */}
          <Grid container columnSpacing={2} rowSpacing={2}>
            {/* Solo mostrar catálogo y fecha formalización si NO es venta privada */}
            {!isPrivateSale && (
              <>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Form.Item name="catalogoComplete" noStyle />
                  <Form.Item shouldUpdate noStyle>
                    {({ setFieldsValue }) => (
                      <Form.Item name="catalogo" rules={conditionalRules}>
                        <SelectCatalogs companyId={companyId} label="Catálogo" />
                      </Form.Item>
                    )}
                  </Form.Item>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Form.Item name="fechaFormalizacion" rules={conditionalRules}>
                    <DatePickerAntd label="Fecha formalización" />
                  </Form.Item>
                </Grid>
              </>
            )}

            {/* Campos principales - fecha máxima, monto y campos de cotización */}
            <Grid size={{ xs: 12, sm: 6, md: isPrivateSale ? 3 : 3 }}>
              <Form.Item name="fechaMaxEntrega" rules={conditionalRules}>
                <DatePickerAntd label="Fecha máxima de entrega" />
              </Form.Item>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: isPrivateSale ? 3 : 3 }}>
              <Form.Item name="montoVenta" rules={conditionalRules}>
                <InputAntd label="Monto de venta" type="number" />
              </Form.Item>
            </Grid>

            {/* Campos de cotización en la misma fila - solo para ventas privadas */}
            {isPrivateSale && (
              <>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Form.Item name="cotizacion">
                    <InputAntd label="Cod. Cotización" />
                  </Form.Item>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue, setFieldValue }) => (
                      <SimpleFileUpload
                        label="Doc. Cotización"
                        accept="application/pdf"
                        value={getFieldValue('documentoCotizacion')}
                        onChange={(file) => setFieldValue('documentoCotizacion', file)}
                      />
                    )}
                  </Form.Item>
                </Grid>
              </>
            )}

            {/* OCF oculto para ventas privadas */}
          </Grid>

          {/* Segunda fila: Datos SIAF - Solo mostrar si NO es venta privada */}
          {!isPrivateSale && (
            <Grid container columnSpacing={2} rowSpacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Form.Item name="numeroSIAF" rules={siafRules}>
                  <InputAntd label="Número de SIAF" />
                </Form.Item>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Form.Item name="etapaSIAF" rules={siafRules}>
                  <SelectGeneric label="Etapa SIAF" options={etapaSIAFOptions} />
                </Form.Item>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Form.Item name="fechaSIAF" rules={siafRules}>
                  <DatePickerAntd label="Fecha de SIAF" />
                </Form.Item>
              </Grid>

              {/* OCF para ventas al estado junto a Fecha SIAF */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Form.Item name="codigoOcf" rules={siafRules}>
                  <InputAntd label="OCF" />
                </Form.Item>
              </Grid>
            </Grid>
          )}

          {/* Tercera fila: Documentos - Solo para ventas al estado */}
          {!isPrivateSale && (
            <Grid container columnSpacing={2} rowSpacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Form.Item name="ordenCompraElectronica">
                  <InputFile
                    label="Orden de Compra Electrónica (OCE)"
                    accept="pdf"
                    maxSizeMB={10}
                  />
                </Form.Item>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Form.Item name="ordenCompraFisica">
                  <InputFile
                    label="Orden de Compra Física (OCF)"
                    accept="pdf"
                    maxSizeMB={10}
                  />
                </Form.Item>
              </Grid>
            </Grid>
          )}
        </Box>
      </StepItemContent>
    </Fragment>
  );
};

export default InputsThirdStep;