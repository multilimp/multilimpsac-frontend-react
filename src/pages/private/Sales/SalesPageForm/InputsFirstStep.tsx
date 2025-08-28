import { Fragment } from 'react';
import { Form, FormInstance } from 'antd';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { Receipt } from '@mui/icons-material';
import { StepItemContent } from './smallcomponents';
import SelectGeneric from '@/components/selects/SelectGeneric';
import DatePickerAntd from '@/components/DatePickerAnt';
import SimpleFileUpload from '@/components/SimpleFileUpload';
import PaymentsList from '@/components/PaymentsList';

export const requiredField = { required: false, message: 'Campo requerido' };

const facturaStatusOptions = [
  { label: 'Pendiente', value: 'PENDIENTE' },
  { label: 'Pagado', value: 'PAGADO' },
  { label: 'Urgente', value: 'URGENTE' },
];

const InputsFirstStep = ({
  form,
  payments = [],
  tipoPago = '',
  notaPago = '',
  onPaymentsChange,
  onTipoPagoChange,
  onNotaPagoChange,
  isPrivateSale = false
}: {
  form: FormInstance;
  payments?: any[];
  tipoPago?: string;
  notaPago?: string;
  onPaymentsChange?: (payments: any[]) => void;
  onTipoPagoChange?: (tipoPago: string) => void;
  onNotaPagoChange?: (notaPago: string) => void;
  isPrivateSale?: boolean;
}) => {
  // Reglas condicionales: si es venta privada, ningún campo es obligatorio
  const conditionalRules = isPrivateSale ? [] : [requiredField];

  return (
    <Stack direction="column" spacing={2}>
      <Form.Item name="clientePrivate" noStyle />

      {/* Datos de Factura - Sin wrapper azul */}
      <StepItemContent>
        <Box sx={{ backgroundColor: 'white', m: -2, p: 4, borderRadius: 1 }}>
          <Typography variant="h6" fontWeight={600} component={Stack} direction="row" alignItems="flex-end" spacing={1} mb={2} sx={{ color: '#1f2937' }}>
            <Receipt />
            Datos de Factura
          </Typography>

          <Grid container columnSpacing={2} rowSpacing={2}>
            {/* Fila única: Estado de Factura, Fecha Factura y Documento PDF */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Form.Item name="facturaStatus" rules={conditionalRules}>
                <SelectGeneric label="Estado de Factura" options={facturaStatusOptions} />
              </Form.Item>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Form.Item name="documentoFactura" rules={conditionalRules}>
                <SimpleFileUpload
                  label="Documento de Factura"
                  onChange={(file) => form.setFieldValue('documentoFactura', file)}
                  accept="application/pdf"
                />
              </Form.Item>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Form.Item name="dateFactura" rules={conditionalRules}>
                <DatePickerAntd label="Fecha factura" />
              </Form.Item>
            </Grid>
          </Grid>
        </Box>
      </StepItemContent>

      {/* Pagos Recibidos - Componente Reutilizable */}
      <Form.Item noStyle shouldUpdate={(prev, curr) => prev.montoVenta !== curr.montoVenta}>
        {({ getFieldValue }) => {
          const montoVenta = getFieldValue('montoVenta') || 0;

          return (
            <PaymentsList
              payments={payments}
              tipoPago={tipoPago}
              notaPago={notaPago}
              title="Pagos Venta Privada"
              mode="edit"
              montoTotal={Number(montoVenta)}
              onPaymentsChange={onPaymentsChange}
              onTipoPagoChange={onTipoPagoChange}
              onNotaPagoChange={onNotaPagoChange}
            />
          );
        }}
      </Form.Item>
    </Stack>
  );
};

export default InputsFirstStep;
