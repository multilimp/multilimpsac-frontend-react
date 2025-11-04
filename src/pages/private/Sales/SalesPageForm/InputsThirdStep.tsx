import React, { Fragment, useEffect } from 'react';
import { Form, FormInstance, Radio, Select } from 'antd';
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
import InputNumberAntd from '@/components/InputNumberAntd';

interface InputsThirdStepProps {
  form: FormInstance;
  companyId?: number;
  isPrivateSale?: boolean;
  disabledAll?: boolean;
}

const etapaSIAFOptions = ['COM', 'DEV', 'PAG', 'SSIAF', 'RES', 'GIR', 'GIR-F', 'GIR-V', 'GIR-A', 'GIR-R'].map((value) => ({ label: value, value }));

const InputsThirdStep = ({ form, companyId, isPrivateSale = false, disabledAll = false }: InputsThirdStepProps) => {
  // Reglas condicionales: si es venta privada, ningún campo es obligatorio
  const conditionalRules = isPrivateSale ? [] : [requiredField];
  const siafRules = isPrivateSale ? [] : [requiredField];

  // Observar cambios en el cliente seleccionado
  const cliente = Form.useWatch('clienteEstado', form);

  // Establecer valor por defecto del OCF basado en la RUC del cliente
  useEffect(() => {
    if (cliente?.ruc && !isPrivateSale) {
      const currentOcfValue = form.getFieldValue('codigoOcf');

      const shouldUpdate = !currentOcfValue ||
        currentOcfValue === '' ||
        (currentOcfValue.match(/^\d{11}-$/) && !currentOcfValue.startsWith(cliente.ruc));

      if (shouldUpdate) {
        form.setFieldsValue({
          codigoOcf: `${cliente.ruc}`
        });
      }
    }
  }, [cliente?.ruc, isPrivateSale, form]);

  return (
    <Fragment>
      <StepItemContent>
        <Box sx={{ backgroundColor: 'white', m: -2, p: 4, borderRadius: 1 }}>
          {/* Título con switch de fuentes de financiamiento */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight={600} component={Stack} direction="row" alignItems="center" spacing={1} sx={{ color: '#1f2937' }}>
              <Info />
              Datos generales
            </Typography>

            {/* Switch de fuentes de financiamiento */}
            {/* Ocultar para venta privada */}
            {!isPrivateSale && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                  Fuentes de financiamiento:
                </Typography>
                <Form.Item name="multipleFuentesFinanciamiento" initialValue={false}>
                  <Select size="small" style={{ minWidth: 180 }}>
                    <Select.Option value={false}>Una fuente</Select.Option>
                    <Select.Option value={true}>Múltiples fuentes</Select.Option>
                  </Select>
                </Form.Item>
              </Stack>
            )}
          </Stack>
          {/* Primera fila: Datos principales */}
          <Grid container columnSpacing={2} rowSpacing={2}>
            {/* Solo mostrar catálogo y fecha formalización si NO es venta privada */}
            {!isPrivateSale && (
              <>
                {companyId ? (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Form.Item name="catalogoComplete" noStyle />
                    <Form.Item shouldUpdate noStyle>
                      {({ setFieldsValue }) => (
                        <Form.Item name="catalogo" rules={conditionalRules}>
                          <SelectCatalogs companyId={companyId} label="Catálogo" disabled={disabledAll} />
                        </Form.Item>
                      )}
                    </Form.Item>
                  </Grid>
                ) : null}

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Form.Item name="fechaFormalizacion" rules={conditionalRules}>
                    <DatePickerAntd label="Fecha formalización" disabled={disabledAll} />
                  </Form.Item>
                </Grid>
              </>
            )}

            {/* Campos principales - fecha máxima, monto y campos de cotización */}
            <Grid size={{ xs: 12, sm: 6, md: isPrivateSale ? 3 : 3 }}>
              <Form.Item name="fechaMaxEntrega" rules={conditionalRules}>
                <DatePickerAntd label="Fecha máxima de entrega" disabled={disabledAll} />
              </Form.Item>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: isPrivateSale ? 3 : 3 }}>
              <Form.Item name="montoVenta" rules={conditionalRules}>
                <InputNumberAntd label="Monto de venta" isCurrency disabled={disabledAll} />
              </Form.Item>
            </Grid>

            {/* Campos de cotización en la misma fila - solo para ventas privadas */}
            {isPrivateSale && (
              <>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Form.Item name="cotizacion">
                    <InputAntd label="Cod. Cotización" disabled={disabledAll} />
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
                        editable={!disabledAll}
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
                  <InputAntd label="Número de SIAF" disabled={disabledAll} />
                </Form.Item>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Form.Item name="etapaSIAF" rules={siafRules}>
                  <SelectGeneric label="Etapa SIAF" options={etapaSIAFOptions} disabled={disabledAll} />
                </Form.Item>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Form.Item name="fechaSIAF" rules={siafRules}>
                  <DatePickerAntd label="Fecha de SIAF" disabled={disabledAll} />
                </Form.Item>
              </Grid>

              {/* OCF para ventas al estado junto a Fecha SIAF */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Form.Item name="codigoOcf" rules={siafRules}>
                  <InputAntd
                    label="OCF"
                    disabled={disabledAll}
                  />
                </Form.Item>
              </Grid>
            </Grid>
          )}

          {/* Tercera fila: Documentos - Solo para ventas al estado */}
          {!isPrivateSale && (
            <Grid container columnSpacing={2} rowSpacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Form.Item name="ordenCompraElectronica">
                  <SimpleFileUpload
                    label="Orden de Compra Electrónica (OCE)"
                    accept="pdf"
                    value={form.getFieldValue('ordenCompraElectronica')}
                    onChange={(file) => form.setFieldsValue({ ordenCompraElectronica: file })}
                    editable={!disabledAll}
                  />
                </Form.Item>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Form.Item name="ordenCompraFisica">
                  <SimpleFileUpload
                    label="Orden de Compra Física (OCF)"
                    accept="pdf"
                    value={form.getFieldValue('ordenCompraFisica')}
                    onChange={(file) => form.setFieldsValue({ ordenCompraFisica: file })}
                    editable={!disabledAll}
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