import { Fragment, useState } from 'react';
import { Form, FormInstance } from 'antd';
import { StepItemContent } from './smallcomponents';
import { Grid, Stack, Typography, Box } from '@mui/material';
import { requiredField } from './InputsFirstStep';
// Removed location select components - using text inputs with AI autocomplete instead
import InputAntd from '@/components/InputAntd';
import { Business, LocationOn } from '@mui/icons-material';
import ClientSelectorModal from '../../Clients/components/ClientSelectorModal';
import { ClientProps } from '@/services/clients/clients';
import { SaleProps } from '@/services/sales/sales';
import dayjs from 'dayjs';

interface InputsSecondStepProps {
  form: FormInstance;
  isEditing?: boolean;
  currentSale?: SaleProps | null;
  isPrivateSale?: boolean;
}

const InputsSecondStep = ({ form, isEditing = false, currentSale, isPrivateSale = false }: InputsSecondStepProps) => {
  const [openClients, setOpenClients] = useState(false);

  // Footer con CUE - siempre visible para ventas directas y privadas
  const renderFooterContent = () => {
    return (
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => {
          const clienteEstado: ClientProps | null = getFieldValue('clienteEstado');
          return (
            <Box>
              <Typography component="span" fontSize={13} color="#ccc">
                Código UE:
              </Typography>
              <Typography component="span" fontSize={13} color="#fff" sx={{ ml: 1, fontWeight: 500 }}>
                {clienteEstado?.codigoUnidadEjecutora || 'N/A'}
              </Typography>
            </Box>
          );
        }}
      </Form.Item>
    );
  };

  return (
    <Fragment>
      <Form.Item name="clienteEstado" noStyle />

      <StepItemContent
        showHeader
        showFooter
        footerContent={renderFooterContent()}
        ResumeIcon={Business}
        color={isPrivateSale ? '#006DFA' : '#04BA6B'}
        onClickSearch={() => setOpenClients(true)}
        headerLeft={
          <Fragment>
            {'Creado: '}
            <Typography component="span" color="inherit" variant="inherit" fontWeight={600}>
              {currentSale?.createdAt ? dayjs(currentSale.createdAt).format('DD / MM / YYYY') : '---'}
            </Typography>
          </Fragment>
        }
        headerRight={
          <Fragment>
            {'Actualizado: '}
            <Typography component="span" color="inherit" variant="inherit" fontWeight={600}>
              {currentSale?.updatedAt ? dayjs(currentSale.updatedAt).format('DD / MM / YYYY') : '---'}
            </Typography>
          </Fragment>
        }
        resumeContent={
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const clienteEstado: null | ClientProps = getFieldValue('clienteEstado');
              return (
                <Fragment>
                  {isEditing && currentSale && (
                    <Typography variant="h5">{currentSale.codigoVenta}</Typography>
                  )}
                  <Typography fontWeight={300} color={clienteEstado ? undefined : 'textSecondary'}>
                    {clienteEstado?.razonSocial ?? 'Seleccione a un cliente'}
                  </Typography>
                  <Typography fontWeight={300} color={clienteEstado ? undefined : 'textSecondary'}>
                    {clienteEstado ? `RUC: ${clienteEstado.ruc}` : 'RUC:'}
                  </Typography>
                </Fragment>
              );
            }}
          </Form.Item>
        }
      >
        <Box sx={{ backgroundColor: 'white', m: -2, p: 4, borderRadius: 1 }}>
          <Typography variant="h5" fontWeight={700} component={Stack} direction="row" alignItems="flex-end" spacing={1} mb={2}>
            <LocationOn />
            Lugar de entrega
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* Fila de ubicación geográfica */}
            <Grid container columnSpacing={2} rowSpacing={2}>
              {/* Primera fila - Dirección completa */}
              <Grid size={12}>
                <Form.Item name="direccionEntrega" rules={[requiredField]}>
                  <InputAntd label="Dirección" />
                </Form.Item>
              </Grid>            {/* Segunda fila - Ubicación geográfica con texto libre para AI */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <Form.Item name="regionEntrega" rules={[requiredField]}>
                  <InputAntd label="Región" />
                </Form.Item>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Form.Item name="provinciaEntrega" rules={[requiredField]}>
                  <InputAntd label="Provincia" />
                </Form.Item>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Form.Item name="distritoEntrega" rules={[requiredField]}>
                  <InputAntd label="Distrito" />
                </Form.Item>
              </Grid>{/* Tercera fila - Referencia */}
              <Grid size={12}>
                <Form.Item name="referenciaEntrega" rules={[requiredField]}>
                  <InputAntd label="Referencia" />
                </Form.Item>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </StepItemContent>

      {openClients ? (
        <ClientSelectorModal onClose={() => setOpenClients(false)} onSelected={(data) => form.setFieldValue('clienteEstado', data)} />
      ) : null}
    </Fragment>
  );
};

export default InputsSecondStep;
