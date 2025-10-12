import { Fragment, useState } from 'react';
import { Form, FormInstance } from 'antd';
import { StepItemContent } from './smallcomponents';
import { Grid, Stack, Typography, Box } from '@mui/material';
import { requiredField } from './InputsFirstStep';
// Removed location select components - using text inputs with AI autocomplete instead
import InputAntd from '@/components/InputAntd';
import SelectGeneric from '@/components/selects/SelectGeneric';
import { Business, LocationOn } from '@mui/icons-material';
import ClientSelectorModal from '../../Clients/components/ClientSelectorModal';
import { ClientProps } from '@/services/clients/clients';
import { SaleProps } from '@/services/sales/sales';
import { formattedDate } from '@/utils/functions';

// Opciones para el tipo de entrega en ventas privadas
const tipoEntregaOptions = [
  { label: 'Recojo en almacén', value: 'RECOJO_ALMACEN' },
  { label: 'Entrega a domicilio', value: 'ENTREGA_DOMICILIO' },
  { label: 'Entrega en agencia', value: 'ENTREGA_AGENCIA' }
];

interface InputsSecondStepProps {
  form: FormInstance;
  isEditing?: boolean;
  currentSale?: SaleProps | null;
  isPrivateSale?: boolean;
}

const InputsSecondStep = ({ form, isEditing = false, currentSale, isPrivateSale = false }: InputsSecondStepProps) => {
  const [openClients, setOpenClients] = useState(false);

  // Reglas condicionales: si es venta privada, ningún campo es obligatorio
  const conditionalRules = isPrivateSale ? [] : [requiredField];

  // Footer con CUE - siempre visible para ventas directas y privadas
  const renderFooterContent = () => {
    return (
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => {
          const clienteEstado: ClientProps | null = getFieldValue('clienteEstado');
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}>
              {/* Ubicación primero */}
              {clienteEstado && (clienteEstado.departamento || clienteEstado.provincia) && (
                <Box>
                  <Typography component="span" fontSize={13} color="#ccc">
                    Ubicación:
                  </Typography>
                  <Typography component="span" fontSize={13} color="#fff" sx={{ ml: 1, fontWeight: 500 }}>
                    {[
                      clienteEstado.departamento,
                      clienteEstado.provincia,
                      clienteEstado.distrito,
                      clienteEstado.direccion
                    ].filter(Boolean).join(' - ') || 'N/A'}
                  </Typography>
                </Box>
              )}

              {/* Código UE segundo */}
              <Box>
                <Typography component="span" fontSize={13} color="#ccc">
                  Código UE:
                </Typography>
                <Typography component="span" fontSize={13} color="#fff" sx={{ ml: 1, fontWeight: 500 }}>
                  {clienteEstado?.codigoUnidadEjecutora || 'N/A'}
                </Typography>
              </Box>
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
              {currentSale?.createdAt ? formattedDate(currentSale.createdAt, 'dd / MM / yyyy') : '---'}
            </Typography>
          </Fragment>
        }
        headerRight={
          <Fragment>
            {'Actualizado: '}
            <Typography component="span" color="inherit" variant="inherit" fontWeight={600}>
              {currentSale?.updatedAt ? formattedDate(currentSale.updatedAt, 'dd / MM / yyyy') : '---'}
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
          <Typography variant="h6" fontWeight={600} component={Stack} direction="row" alignItems="flex-end" spacing={1} mb={2} sx={{ color: '#1f2937' }}>
            <LocationOn />
            Lugar de entrega
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* Campos específicos para ventas privadas */}
            {isPrivateSale && (
              <Grid container columnSpacing={2} rowSpacing={2}>
                {/* Tipo de entrega */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Form.Item name="tipoEntrega" rules={conditionalRules}>
                    <SelectGeneric
                      label="Tipo de entrega"
                      options={tipoEntregaOptions}
                    />
                  </Form.Item>
                </Grid>

                {/* Destino - visible solo para entrega a domicilio y entrega en agencia */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => {
                      const tipoEntrega = getFieldValue('tipoEntrega');
                      if (tipoEntrega === 'ENTREGA_DOMICILIO') {
                        return (
                          <Form.Item name="destinoEntidad" rules={conditionalRules}>
                            <InputAntd label="Nombre de la entidad" />
                          </Form.Item>
                        );
                      } else if (tipoEntrega === 'ENTREGA_AGENCIA') {
                        return (
                          <Form.Item name="nombreAgencia" rules={conditionalRules}>
                            <InputAntd label="Nombre de la agencia" />
                          </Form.Item>
                        );
                      }
                      return null;
                    }}
                  </Form.Item>
                </Grid>

                {/* Destino general - para entrega en agencia */}
                <Form.Item noStyle shouldUpdate>
                  {({ getFieldValue }) => {
                    const tipoEntrega = getFieldValue('tipoEntrega');
                    if (tipoEntrega === 'ENTREGA_AGENCIA') {
                      return (
                        <Grid size={12}>
                          <Form.Item name="destinoFinal" rules={conditionalRules}>
                            <InputAntd label="Destino final" />
                          </Form.Item>
                        </Grid>
                      );
                    }
                    return null;
                  }}
                </Form.Item>
              </Grid>
            )}

            {/* Fila de ubicación geográfica */}
            <Grid container columnSpacing={2} rowSpacing={2}>
              {/* Primera fila - Dirección completa */}
              <Grid size={12}>
                <Form.Item name="direccionEntrega" rules={conditionalRules}>
                  <InputAntd label="Dirección" />
                </Form.Item>
              </Grid>

              {/* Segunda fila - Distrito, Provincia, Departamento */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <Form.Item name="distritoEntrega" rules={conditionalRules}>
                  <InputAntd label="Distrito" />
                </Form.Item>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Form.Item name="provinciaEntrega" rules={conditionalRules}>
                  <InputAntd label="Provincia" />
                </Form.Item>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Form.Item name="regionEntrega" rules={conditionalRules}>
                  <InputAntd label="Departamento" />
                </Form.Item>
              </Grid>

              {/* Tercera fila - Referencia */}
              <Grid size={12}>
                <Form.Item name="referenciaEntrega" rules={conditionalRules}>
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
