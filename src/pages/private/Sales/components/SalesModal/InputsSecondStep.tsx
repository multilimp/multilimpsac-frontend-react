import { Form, FormInstance } from 'antd';
import { StepItemContent } from './smallcomponents';
import { Card, CardContent, CardHeader, Grid } from '@mui/material';
import SelectClients from '@/components/selects/SelectClients';
import { requiredField } from './InputsFirstStep';
import SelectRegions from '@/components/selects/SelectRegions';
import SelectProvinces from '@/components/selects/SelectProvinces';
import SelectDistricts from '@/components/selects/SelectDistricts';
import InputAntd from '@/components/InputAntd';
import DatePickerAntd from '@/components/DatePickerAnt';

interface InputsSecondStepProps {
  form: FormInstance;
}

const InputsSecondStep = ({ form }: InputsSecondStepProps) => {
  return (
    <StepItemContent title="DATOS DEL CLIENTE Y LUGAR DE ENTREGA" subtitle="Ingresa la información solicitada">
      <Form.Item name="clienteComplete" noStyle />
      <Form.Item name="cliente" rules={[requiredField]}>
        <SelectClients
          label="Cliente"
          onChange={(value, record: any) => form.setFieldsValue({ cliente: value, clienteComplete: record.optiondata })}
        />
      </Form.Item>

      <Card variant="outlined">
        <CardHeader title="Lugar de entrega" />
        <CardContent sx={{ pb: '0 !important', pt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Form.Item name="regionEntregaComplete" noStyle />
              <Form.Item name="regionEntrega" rules={[requiredField]}>
                <SelectRegions
                  label="Departamento"
                  onChange={(value, record: any) =>
                    form.setFieldsValue({
                      regionEntrega: value,
                      regionEntregaComplete: record?.optiondata,
                      provinciaEntrega: null,
                      provinciaEntregaComplete: null,
                      distritoEntrega: null,
                      distritoEntregaComplete: null,
                    })
                  }
                />
              </Form.Item>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Form.Item name="provinciaEntregaComplete" noStyle />
              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => (
                  <Form.Item name="provinciaEntrega" rules={[requiredField]}>
                    <SelectProvinces
                      label="Provincia"
                      regionId={getFieldValue('regionEntrega')}
                      onChange={(value, record: any) =>
                        form.setFieldsValue({
                          provinciaEntrega: value,
                          provinciaEntregaComplete: record?.optiondata,
                          distritoEntrega: null,
                          distritoEntregaComplete: null,
                        })
                      }
                    />
                  </Form.Item>
                )}
              </Form.Item>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Form.Item name="distritoEntregaComplete" noStyle />
              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => (
                  <Form.Item name="distritoEntrega" rules={[requiredField]}>
                    <SelectDistricts
                      label="Distrito"
                      provinceId={getFieldValue('provinciaEntrega')}
                      onChange={(value, record: any) => form.setFieldsValue({ distritoEntrega: value, distritoEntregaComplete: record?.optiondata })}
                    />
                  </Form.Item>
                )}
              </Form.Item>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Form.Item name="fechaEntrega" rules={[requiredField]}>
                <DatePickerAntd label="Fecha de entrega" />
              </Form.Item>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Form.Item name="direccionEntrega" rules={[requiredField]}>
                <InputAntd label="Dirección" />
              </Form.Item>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Form.Item name="referenciaEntrega" rules={[requiredField]}>
                <InputAntd label="Referencia" />
              </Form.Item>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </StepItemContent>
  );
};

export default InputsSecondStep;
