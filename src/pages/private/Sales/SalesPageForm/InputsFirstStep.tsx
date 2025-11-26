import { Fragment } from 'react';
import { Form, FormInstance } from 'antd';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { Receipt } from '@mui/icons-material';
import { StepItemContent } from './smallcomponents';
import SelectGeneric from '@/components/selects/SelectGeneric';
import DatePickerAntd from '@/components/DatePickerAnt';
import SimpleFileUpload from '@/components/SimpleFileUpload';
import PaymentsList from '@/components/PaymentsList';
import type { Dayjs } from 'dayjs';

export const requiredField = { required: false, message: 'Campo requerido' };

const facturaStatusOptions = [
  { label: 'Pendiente', value: 'PENDIENTE' },
  { label: 'Completado', value: 'COMPLETADO' },
  { label: 'Urgente', value: 'URGENTE' },
];

type PaymentItem = {
  date: Dayjs | null;
  bank: string;
  description: string;
  file: string | null;
  amount: string;
  status: boolean;
};

const InputsFirstStep = ({
  form,
  payments = [],
  tipoPago = '',
  notaPago = '',
  onPaymentsChange,
  onTipoPagoChange,
  onNotaPagoChange,
  isPrivateSale = false,
  isEditing = false,
  disableInvoiceFields = false,
  fromBilling = false
}: {
  form: FormInstance;
  payments?: PaymentItem[];
  tipoPago?: string;
  notaPago?: string;
  onPaymentsChange?: (payments: PaymentItem[]) => void;
  onTipoPagoChange?: (tipoPago: string) => void;
  onNotaPagoChange?: (notaPago: string) => void;
  isPrivateSale?: boolean;
  isEditing?: boolean;
  disableInvoiceFields?: boolean;
  fromBilling?: boolean;
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
                <SelectGeneric showSearch={false} label="Estado de Factura" options={facturaStatusOptions} />
              </Form.Item>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Form.Item name="documentoFactura" rules={conditionalRules}>
                <SimpleFileUpload
                  label="Documento de Factura"
                  onChange={(file) => form.setFieldValue('documentoFactura', file)}
                  editable={!disableInvoiceFields}
                />
              </Form.Item>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Form.Item name="fechaFactura" rules={conditionalRules}>
                <DatePickerAntd label="Fecha factura" disabled={disableInvoiceFields} />
              </Form.Item>
            </Grid>
          </Grid>
        </Box>
      </StepItemContent>

      {/* Pagos Recibidos - Componente Reutilizable */}
      {/* Lista de Pagos - Solo visible en modo edición */}
      {isEditing && (
        <Form.Item shouldUpdate noStyle>
          {({ getFieldValue }) => {
            const montoVenta = getFieldValue('montoVenta') || 0;

            return (
              <PaymentsList
                payments={payments}
                tipoPago={tipoPago}
                notaPago={notaPago}
                title="Pagos Venta Privada"
                mode={fromBilling ? 'readonly' : 'edit'}
                montoTotal={Number(montoVenta)}
                onPaymentsChange={onPaymentsChange}
                onTipoPagoChange={onTipoPagoChange}
                onNotaPagoChange={onNotaPagoChange}
              />
            );
          }}
        </Form.Item>
      )}
    </Stack>
  );
};

export default InputsFirstStep;
