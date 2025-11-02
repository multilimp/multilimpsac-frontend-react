import { Fragment, useState } from 'react';
import { Form, FormInstance, notification } from 'antd';
import { Box, IconButton, Grid, Stack, Typography } from '@mui/material';
import { StepItemContent } from '../../Sales/SalesPageForm/smallcomponents';
import SelectCompanies from '@/components/selects/SelectCompanies';
import { Handshake, Print } from '@mui/icons-material';
import DatePickerAntd from '@/components/DatePickerAnt';
import ClientSelectorModal from '../../Clients/components/ClientSelectorModal';
import SelectContactsByClient from '@/components/selects/SelectContactsByClient';
import { ClientProps } from '@/services/clients/clients';
import PersonOutline from '@mui/icons-material/PersonOutline';
import Phone from '@mui/icons-material/Phone';
import dayjs from 'dayjs';
import { useEffect } from 'react';

export const requiredField = { required: true, message: 'Campo requerido' };

const QuotesFormFirstStep = ({ form, isEditing, quoteId }: { form: FormInstance; isEditing: boolean; quoteId?: string }) => {
  const [openClients, setOpenClients] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      form.setFieldsValue({
        estado: 'COTIZADO'
      });
    }
  }, [isEditing, form]);

  const updateFechaActualizacion = () => {
    form.setFieldValue('fechaActualizacion', new Date());
  };

  const printQuote = async () => {
    if (!quoteId) {
      notification.error({
        message: 'Error',
        description: 'No se puede imprimir: ID de cotización no disponible',
      });
      return;
    }
    
    try {
      const { printCotizacion } = await import('../../../../services/print/print.requests');
      await printCotizacion(Number(quoteId));
    } catch (error) {
      notification.error({
        message: 'Error de impresión',
        description: 'No se pudo generar la cotización para impresión',
      });
    }
  };

  const renderFooterContent = () => (
    <Form.Item noStyle shouldUpdate>
      {({ getFieldValue }) => {
        const cliente: ClientProps | null = getFieldValue('cliente');
        const contactName = getFieldValue('nombreContacto') || '';
        const contactCargo = getFieldValue('cargoContacto') || '';
        const contactPhone = getFieldValue('celularContacto') || '';
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
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Form.Item name="contactoCliente" noStyle>
                <SelectContactsByClient
                  placeholder="Contacto"
                  clientId={cliente?.id}
                  size="large"
                  onChange={(value, record: unknown) => {
                    const recordData = record as { optiondata?: { nombre: string; telefono: string; cargo: string } };
                    form.setFieldsValue({
                      contactoCliente: value,
                      nombreContacto: recordData?.optiondata?.nombre ?? '',
                      celularContacto: recordData?.optiondata?.telefono ?? '',
                      cargoContacto: recordData?.optiondata?.cargo ?? '',
                      contactoClienteComplete: recordData?.optiondata ?? null,
                    });
                    updateFechaActualizacion();
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
    <StepItemContent
      showHeader
      showFooter
      ResumeIcon={Handshake}
      onClickSearch={() => setOpenClients(true)}
      resumeContent={
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) => {
            const cliente: ClientProps | null = getFieldValue('cliente');
            return (
              <Fragment>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>
                  {`${getFieldValue('idCotizacion') ?? 'ID Cotización'}`}
                </Typography>
                <Typography sx={{ fontWeight: 300, color: '#ffffff', opacity: 0.8, fontSize: '0.875rem' }}>
                  {cliente
                    ? `${cliente.razonSocial ?? 'Cliente seleccionado'}`
                    : 'Cliente no seleccionado'}
                </Typography>
                {cliente && (
                  <Typography sx={{ fontWeight: 300, color: '#ffffff', opacity: 0.7, fontSize: '0.85rem' }}>
                    RUC: {cliente.ruc ?? '—'}
                  </Typography>
                )}
              </Fragment>
            );
          }}
        </Form.Item>
      }
      footerContent={renderFooterContent()}
      resumeButtons={
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton
            sx={{
              border: '1px solid',
              borderRadius: 1,
              color: '#04BA6B',
              zIndex: 900,
              padding: 1.5,
              minWidth: 44,
              minHeight: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => {
              printQuote();
            }}
          >
            <Print sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      }
    >
      <Form.Item name="cliente" noStyle />
      <Typography variant="h6" sx={{ margin: 1, mb: 2 }}>
        Empresa y fecha de cotización
      </Typography>
      <Grid container columnSpacing={2} rowSpacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Form.Item name="empresa" rules={[requiredField]}>
            <SelectCompanies
              label="Empresa"
              onChange={updateFechaActualizacion}
            />
          </Form.Item>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Form.Item name="fechaCotizacion" rules={[requiredField]} initialValue={dayjs()}>
            <DatePickerAntd
              label="Fecha de Cotización"
              onChange={updateFechaActualizacion}
            />
          </Form.Item>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Form.Item name="fechaEntrega">
            <DatePickerAntd
              label="Fecha de Entrega"
              onChange={updateFechaActualizacion}
            />
          </Form.Item>
        </Grid>
      </Grid>

      {openClients ? (
        <ClientSelectorModal
          onClose={() => setOpenClients(false)}
          onSelected={(data) => form.setFieldValue('cliente', data)}
        />
      ) : null}
    </StepItemContent>
  );
};

export default QuotesFormFirstStep;

