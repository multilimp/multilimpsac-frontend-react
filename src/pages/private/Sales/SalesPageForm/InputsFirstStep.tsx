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
