import { Divider, Form, FormInstance } from 'antd';
import { Button, Collapse, Grid, IconButton, Stack, StepLabel, Typography } from '@mui/material';
import SelectCompanies from '@/components/selects/SelectCompanies';
import { Controls, ControlsProps, StepItemContent } from './smallcomponents';
import SelectClients from '@/components/selects/SelectClients';
import SelectGeneric from '@/components/selects/SelectGeneric';
import InputFile from '@/components/InputFile';
import InputAntd from '@/components/InputAntd';
import { Delete } from '@mui/icons-material';
import { formatCurrency } from '@/utils/functions';
import DatePickerAntd from '@/components/DatePickerAnt';

interface InputsFirstStepProps extends ControlsProps {
  form: FormInstance;
}

export const requiredField = { required: true, message: 'Campo requerido' };

const saleTypeOptions = [
  { label: 'Venta Directa', value: 'directa' },
  { label: 'Venta Privada', value: 'privada' },
];

const facturaStatusOptions = [
  { label: 'Pendiente', value: 'pendiente' },
  { label: 'Pagada', value: 'pagada' },
  { label: 'Cancelada', value: 'cancelada' },
  { label: 'Anulada', value: 'anulada' },
];

const statusOptions = [
  { label: 'Activo', value: 'activo' },
  { label: 'Inactivo', value: 'inactivo' },
];

const InputsFirstStep = ({ form, ...controlProps }: InputsFirstStepProps) => {
  return (
    <StepItemContent
      customTitle={
        <Form.Item shouldUpdate noStyle>
          {({ getFieldValue }) => {
            const privateSale = getFieldValue('saleType') === 'privada';
            const aux = getFieldValue('enterpriseComplete');
            return (
              <StepLabel optional={privateSale !== undefined && (privateSale ? 'VENTA PRIVADA' : 'VENTA DIRECTA')}>
                {aux ? `${aux.razonSocial} — RUC: ${aux.ruc}` : 'SELECCIONAR EMPRESA'}
              </StepLabel>
            );
          }}
        </Form.Item>
      }
    >
      <Grid container columnSpacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Form.Item name="enterpriseComplete" noStyle />
          <Form.Item name="enterprise" rules={[requiredField]}>
            <SelectCompanies
              label="Empresa"
              onChange={(value, record: any) => form.setFieldsValue({ enterprise: value, enterpriseComplete: record.optiondata })}
            />
          </Form.Item>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Form.Item name="saleType" rules={[requiredField]}>
            <SelectGeneric label="Tipo de venta" options={saleTypeOptions} />
          </Form.Item>
        </Grid>
      </Grid>

      <Form.Item shouldUpdate noStyle>
        {({ getFieldValue }) => {
          const allow = getFieldValue('saleType') === 'privada';

          return (
            <Collapse in={allow}>
              <Divider>VENTA PRIVADA</Divider>

              <Form.Item name="privateClientComplete" noStyle />
              <Form.Item name="privateClient" rules={[requiredField]}>
                <SelectClients
                  label="Cliente"
                  onChange={(value, record: any) => form.setFieldsValue({ privateClient: value, privateClientComplete: record.optiondata })}
                />
              </Form.Item>

              <Grid container columnSpacing={2} mt={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Form.Item name="facturaStatus" rules={[requiredField]}>
                    <SelectGeneric label="Estado de Factura" options={facturaStatusOptions} />
                  </Form.Item>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Form.Item name="dateFactura" rules={[requiredField]}>
                    <DatePickerAntd label="Fecha factura" />
                  </Form.Item>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                  <Form.Item name="documentoFactura" rules={[requiredField]}>
                    <InputFile onChange={(file) => form.setFieldValue('documentoFactura', file)} />
                  </Form.Item>
                </Grid>
                <Grid size={12}>
                  <Divider dashed>Pagos Recibidos</Divider>

                  {[1, 2, 3, 4].map((item) => (
                    <Stack direction="row" spacing={1} key={item}>
                      <Form.Item name="date" rules={[requiredField]} className="flex-2">
                        <DatePickerAntd label="Fecha" />
                      </Form.Item>
                      <Form.Item name="bank" rules={[requiredField]} className="flex-2">
                        <InputAntd label="Banco" />
                      </Form.Item>
                      <Form.Item name="description" rules={[requiredField]} className="flex-2">
                        <InputAntd label="Descripción" />
                      </Form.Item>
                      <Form.Item name="file" rules={[requiredField]} className="flex-1">
                        <InputFile onChange={(file) => form.setFieldValue('file', file)} />
                      </Form.Item>
                      <Form.Item name="amount" rules={[requiredField]} className="flex-1">
                        <InputAntd label="Monto" type="number" />
                      </Form.Item>
                      <Form.Item name="status" rules={[requiredField]} className="flex-1">
                        <SelectGeneric label="Estado" options={statusOptions} />
                      </Form.Item>
                      <Form.Item>
                        <IconButton size="large" color="error">
                          <Delete />
                        </IconButton>
                      </Form.Item>
                    </Stack>
                  ))}

                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Button size="medium" color="warning" variant="outlined">
                      AGREGAR PAGO
                    </Button>
                    <Typography variant="h5" pr={8}>
                      {formatCurrency(0)}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Collapse>
          );
        }}
      </Form.Item>

      <Controls {...controlProps} />
    </StepItemContent>
  );
};

export default InputsFirstStep;
