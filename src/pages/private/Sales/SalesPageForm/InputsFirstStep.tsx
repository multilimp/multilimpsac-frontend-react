import { Fragment, useState } from 'react';
import { Form, FormInstance } from 'antd';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { StepItemContent } from './smallcomponents';
import SelectGeneric from '@/components/selects/SelectGeneric';
import InputFile from '@/components/InputFile';
import { Handshake } from '@mui/icons-material';
import DatePickerAntd from '@/components/DatePickerAnt';
import ClientSelectorModal from '../../Clients/components/ClientSelectorModal';
import PaymentsList from '@/components/PaymentsList';
import SelectContactsByClient from '@/components/selects/SelectContactsByClient';
import { ClientProps } from '@/services/clients/clients';

export const requiredField = { required: true, message: 'Campo requerido' };

const facturaStatusOptions = [
  { label: 'Pendiente', value: 'PENDIENTE' },
  { label: 'Pagado', value: 'PAGADO' },
  { label: 'Urgente', value: 'URGENTE' },
];

const InputsFirstStep = ({ form }: { form: FormInstance }) => {
  const [openClients, setOpenClients] = useState(false);
  const renderFooterContent = () => {
    return (
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => {
          const clientePrivate: ClientProps | null = getFieldValue('clientePrivate');
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, width: '100%' }}>
             
              {/* Selector de contacto */}
              <Box sx={{ flex: 1, maxWidth: 300 }}>
                <Form.Item name="privateContact" noStyle>
                  <SelectContactsByClient 
                    label="" 
                    placeholder="Seleccionar contacto"
                    clientId={clientePrivate?.id}
                    size="small"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '4px'
                    }}
                  />
                </Form.Item>
              </Box>
            </Box>
          );
        }}
      </Form.Item>
    );
  };
  return (
    <Stack direction="column" spacing={2}>
      <StepItemContent
        showHeader
        showFooter
        ResumeIcon={Handshake}
        color="#006DFA"
        onClickSearch={() => setOpenClients(true)}
        resumeContent={
          <Fragment>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#ffffff' }}>
              Venta Privada
            </Typography>
            <Typography sx={{ fontWeight: 300, color: '#ffffff', opacity: 0.8, fontSize: '0.875rem' }}>
              Cliente no seleccionado
            </Typography>
          </Fragment>
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
              <InputFile
                onChange={(file) => form.setFieldValue('documentoFactura', file)}
                accept="pdf"
                label="Factura PDF"
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
      <PaymentsList
        name="pagos"
        title="Pagos Recibidos"
        mode="edit"
        color="#006DFA"
        required={true}
        initialValue={[{
          date: null,
          bank: '',
          description: '',
          file: null,
          amount: '',
          status: 'false',
        }]}
      />

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
