import { Fragment, useState } from 'react';
import { Form, FormInstance } from 'antd';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { StepItemContent } from './smallcomponents';
import SelectGeneric from '@/components/selects/SelectGeneric';
import { Handshake } from '@mui/icons-material';
import DatePickerAntd from '@/components/DatePickerAnt';
import ClientSelectorModal from '../../Clients/components/ClientSelectorModal';
import SelectContactsByClient from '@/components/selects/SelectContactsByClient';
import { ClientProps } from '@/services/clients/clients';
import SimpleFileUpload from '@/components/SimpleFileUpload';
import InputFile from '@/components/InputFile';
import PersonOutline from '@mui/icons-material/PersonOutline';
import Phone from '@mui/icons-material/Phone';
import PaymentsList from '@/components/PaymentsList';

export const requiredField = { required: true, message: 'Campo requerido' };

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
  onNotaPagoChange
}: {
  form: FormInstance;
  payments?: any[];
  tipoPago?: string;
  notaPago?: string;
  onPaymentsChange?: (payments: any[]) => void;
  onTipoPagoChange?: (tipoPago: string) => void;
  onNotaPagoChange?: (notaPago: string) => void;
}) => {
  const [openClients, setOpenClients] = useState(false);

  const renderFooterContent = () => (
    <Form.Item noStyle shouldUpdate>
      {({ getFieldValue }) => {
        const clientePrivate: ClientProps | null = getFieldValue('clientePrivate');
        const contactName = getFieldValue('privateContactName') || '';
        const contactCargo = getFieldValue('privateContactCargo') || '';
        const contactPhone = getFieldValue('privateContactPhone') || '';
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              width: '100%',
              margin: '-4px'
            }}
          >
            {/* Cargo y nombre */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
              <PersonOutline sx={{ color: '#bfc6d1', fontSize: 28 }} />
              <Typography component="span" fontWeight={700} color="#e5e7eb" fontSize={14}>
                {contactCargo || '—'}
              </Typography>
              <Typography component="span" color="#e5e7eb" fontSize={14} sx={{ ml: 0.5 }}>
                {contactName || ''}
              </Typography>
              <Phone sx={{ color: '#bfc6d1', fontSize: 24 }} />
              <Typography color="#e5e7eb" fontSize={14}>
                {contactPhone || '—'}
              </Typography>
            </Stack>
            {/* Selector de contacto */}
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Form.Item name="privateContact" noStyle>
                <SelectContactsByClient
                  placeholder="Contacto"
                  clientId={clientePrivate?.id}
                  size="middle"
                  onChange={(value, record: any) => {
                    form.setFieldsValue({
                      privateContact: value,
                      privateContactName: record?.optiondata?.nombre ?? '',
                      privateContactPhone: record?.optiondata?.telefono ?? '',
                      privateContactCargo: record?.optiondata?.cargo ?? '',
                      privateContactComplete: record?.optiondata ?? null,
                    });
                  }}
                  style={{ backgroundColor: 'inherit' }}
                />
              </Form.Item>
            </Box>
          </Box>
        );
      }}
    </Form.Item>
  );

  return (
    <Stack direction="column" spacing={2}>
      <StepItemContent
        showHeader
        showFooter
        ResumeIcon={Handshake}
        color="#006DFA"
        onClickSearch={() => setOpenClients(true)}
        resumeContent={
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const clientePrivate: ClientProps | null = getFieldValue('clientePrivate');
              return (
                <Fragment>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#ffffff' }}>
                    Venta Privada
                  </Typography>
                  <Typography sx={{ fontWeight: 300, color: '#ffffff', opacity: 0.8, fontSize: '0.875rem' }}>
                    {clientePrivate
                      ? `${clientePrivate.razonSocial ?? 'Cliente seleccionado'}`
                      : 'Cliente no seleccionado'}
                  </Typography>
                  {clientePrivate && (
                    <Typography sx={{ fontWeight: 300, color: '#ffffff', opacity: 0.7, fontSize: '0.85rem' }}>
                      RUC: {clientePrivate.ruc ?? '—'}
                    </Typography>
                  )}
                </Fragment>
              );
            }}
          </Form.Item>
        }
        footerContent={
          renderFooterContent()
        }
      >
        <Form.Item name="clientePrivate" noStyle />

        <Grid container columnSpacing={2} rowSpacing={2}>
          {/* Fila única: Estado de Factura, Fecha Factura y Documento PDF */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Form.Item name="facturaStatus" rules={[requiredField]}>
              <SelectGeneric label="Estado de Factura" options={facturaStatusOptions} />
            </Form.Item>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Form.Item name="documentoFactura" rules={[requiredField]}>
              <SimpleFileUpload
                onChange={(file) => form.setFieldValue('documentoFactura', file)}
                accept="application/pdf"
              />
            </Form.Item>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Form.Item name="dateFactura" rules={[requiredField]}>
              <DatePickerAntd label="Fecha factura" />
            </Form.Item>
          </Grid>
        </Grid>
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

      {/* Campo para subir cotización */}
      <StepItemContent>
        <Box sx={{ backgroundColor: 'white', m: -2, p: 4, borderRadius: 1 }}>
          <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: '#1f2937' }}>
            Cotización
          </Typography>
          <Grid container columnSpacing={2} rowSpacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Form.Item name="documentoCotizacion">
                <Form.Item shouldUpdate noStyle>
                  {({ getFieldValue }) => (
                    <InputFile
                      onChange={(file) => form.setFieldValue('documentoCotizacion', file)}
                      value={getFieldValue('documentoCotizacion')}
                      label="Documento de cotización"
                      accept="pdf"
                    />
                  )}
                </Form.Item>
              </Form.Item>
            </Grid>
          </Grid>
        </Box>
      </StepItemContent>

      {openClients ? (
        <ClientSelectorModal
          onClose={() => setOpenClients(false)}
          onSelected={(data) => form.setFieldValue('clientePrivate', data)}
        />
      ) : null}
    </Stack>
  );
};

export default InputsFirstStep;
