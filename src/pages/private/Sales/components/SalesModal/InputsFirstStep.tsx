
import { Divider, Form } from 'antd';
import { Button, Collapse, Grid, IconButton, Stack, StepLabel, Typography } from '@mui/material';
import SelectCompanies from '@/components/selects/SelectCompanies';
import { ControlActionsProps, Controls, StepItemContent } from './smallcomponents';
import SelectClients from '@/components/selects/SelectClients';
import SelectGeneric from '@/components/selects/SelectGeneric';
import InputFile from '@/components/InputFile';
import InputAntd from '@/components/InputAntd';
import { Delete } from '@mui/icons-material';
import { formatCurrency } from '@/utils/functions';
import DatePickerAntd from '@/components/DatePickerAnt';

interface InputsFirstStepProps extends ControlActionsProps {}

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
            const privateSale = getFieldValue('tipoVenta') === 'privada';
            const aux = getFieldValue('empresaComplete');
            return (
              <StepLabel optional={privateSale !== undefined && (privateSale ? 'VENTA PRIVADA' : 'VENTA DIRECTA')}>
                {aux ? `${aux.razonSocial} — RUC: ${aux.ruc}` : 'SELECCIONAR EMPRESA'}
              </StepLabel>
            );
          }}
        </Form.Item>
      }
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Form.Item name="empresaComplete" noStyle />
          <Form.Item name="empresa" rules={[requiredField]}>
            <SelectCompanies
              label="Empresa"
              onChange={(value, record: any) => form.setFieldsValue({ empresa: value, empresaComplete: record.optiondata })}
            />
          </Form.Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Form.Item name="tipoVenta" rules={[requiredField]} initialValue="directa">
            <SelectGeneric label="Tipo de venta" options={saleTypeOptions} disabled />
          </Form.Item>
        </Grid>
      </Grid>

      <Form.Item shouldUpdate noStyle>
        {({ getFieldValue }) => {
          const allow = getFieldValue('tipoVenta') === 'privada';

          return (
            <Collapse in={allow} unmountOnExit>
              <Divider>VENTA PRIVADA</Divider>

              <Form.Item name="privateClientComplete" noStyle />
              <Form.Item name="privateClient" rules={[requiredField]}>
                <SelectClients
                  label="Cliente"
                  onChange={(value, record: any) => form.setFieldsValue({ privateClient: value, privateClientComplete: record.optiondata })}
                />
              </Form.Item>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <Form.Item name="facturaStatus" rules={[requiredField]}>
                    <SelectGeneric label="Estado de Factura" options={facturaStatusOptions} />
                  </Form.Item>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Form.Item name="dateFactura" rules={[requiredField]}>
                    <DatePickerAntd label="Fecha factura" />
                  </Form.Item>
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <Form.Item name="documentoFactura" rules={[requiredField]}>
                    <InputFile onChange={(file) => form.setFieldValue('documentoFactura', file)} accept="pdf" />
                  </Form.Item>
                </Grid>
                <Grid item xs={12}>
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
                        <InputFile onChange={(file) => form.setFieldValue('file', file)} accept="pdf" />
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

      <Controls fieldsToValidate={['empresa', 'tipoVenta']} form={form} {...controlProps} />
    </StepItemContent>
  );
};

export default InputsFirstStep;
