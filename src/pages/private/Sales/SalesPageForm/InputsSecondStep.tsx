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
import dayjs from 'dayjs';

interface InputsSecondStepProps {
  form: FormInstance;
}

const InputsSecondStep = ({ form }: InputsSecondStepProps) => {
  const [openClients, setOpenClients] = useState(false);

  return (
    <Fragment>
      <Form.Item name="clienteEstado" noStyle />

      <StepItemContent
        showHeader
        showFooter
        ResumeIcon={Business}
        onClickSearch={() => setOpenClients(true)}
        headerLeft={
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const createdDate = getFieldValue('clienteEstado')?.createdAt;
              return (
                <Fragment>
                  {'Creado: '}
                  <Typography component="span" color="inherit" variant="inherit" fontWeight={600}>
                    {createdDate ? dayjs(createdDate).format('DD / MM / YYYY') : '---'}
                  </Typography>
                </Fragment>
              );
            }}
          </Form.Item>
        }
        headerRight={
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const createdDate = getFieldValue('clienteEstado')?.updatedAt;
              return (
                <Fragment>
                  {'Actualizado: '}
                  <Typography component="span" color="inherit" variant="inherit" fontWeight={600}>
                    {createdDate ? dayjs(createdDate).format('DD / MM / YYYY') : '---'}
                  </Typography>
                </Fragment>
              );
            }}
          </Form.Item>
        }
        resumeContent={
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const clienteEstado: null | ClientProps = getFieldValue('clienteEstado');
              return (
                <Fragment>
                  <Typography variant="h5">OCGRU660</Typography>
                  <Typography fontWeight={300} color={clienteEstado ? undefined : 'textSecondary'}>
                    {clienteEstado?.razonSocial ?? 'Seleccione a un cliente'}
                  </Typography>
                  <Typography fontWeight={300} color={clienteEstado ? undefined : 'textSecondary'}>
                    {clienteEstado ? `RUC: ${clienteEstado.ruc}` : 'Seleccione a un cliente'}
                  </Typography>
                </Fragment>
              );
            }}
          </Form.Item>
        }
      >
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
            </Grid>            {/* Segunda fila - Ubicación geográfica con texto libre para AI */}            <Grid size={{ xs: 12, sm: 4 }}>
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
      </StepItemContent>

      {openClients ? (
        <ClientSelectorModal onClose={() => setOpenClients(false)} onSelected={(data) => form.setFieldValue('clienteEstado', data)} />
      ) : null}
    </Fragment>
  );
};

export default InputsSecondStep;
