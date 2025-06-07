import { Fragment, useState } from 'react';
import { Form, FormInstance } from 'antd';
import { StepItemContent } from './smallcomponents';
import { Grid, Stack, Typography } from '@mui/material';
import { requiredField } from './InputsFirstStep';
import SelectRegions from '@/components/selects/SelectRegions';
import SelectProvinces from '@/components/selects/SelectProvinces';
import SelectDistricts from '@/components/selects/SelectDistricts';
import InputAntd from '@/components/InputAntd';
import DatePickerAntd from '@/components/DatePickerAnt';
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
        color="primary"
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

        <Grid container columnSpacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Form.Item name="regionEntregaComplete" noStyle />
            <Form.Item name="regionEntrega" rules={[requiredField]}>
              <SelectRegions
                label="Departamento"
                onChange={(value, record: any) =>
                  form.setFieldsValue({
                    regionEntrega: value,
                    regionEntregaComplete: record?.optiondata,
                    provinciaEntrega: null,
                    provinciaEntregaComplete: null,
                    distritoEntrega: null,
                    distritoEntregaComplete: null,
                  })
                }
              />
            </Form.Item>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Form.Item name="provinciaEntregaComplete" noStyle />
            <Form.Item noStyle shouldUpdate>
              {({ getFieldValue }) => (
                <Form.Item name="provinciaEntrega" rules={[requiredField]}>
                  <SelectProvinces
                    label="Provincia"
                    regionId={getFieldValue('regionEntrega')}
                    onChange={(value, record: any) =>
                      form.setFieldsValue({
                        provinciaEntrega: value,
                        provinciaEntregaComplete: record?.optiondata,
                        distritoEntrega: null,
                        distritoEntregaComplete: null,
                      })
                    }
                  />
                </Form.Item>
              )}
            </Form.Item>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Form.Item name="distritoEntregaComplete" noStyle />
            <Form.Item noStyle shouldUpdate>
              {({ getFieldValue }) => (
                <Form.Item name="distritoEntrega" rules={[requiredField]}>
                  <SelectDistricts
                    label="Distrito"
                    provinceId={getFieldValue('provinciaEntrega')}
                    onChange={(value, record: any) => form.setFieldsValue({ distritoEntrega: value, distritoEntregaComplete: record?.optiondata })}
                  />
                </Form.Item>
              )}
            </Form.Item>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Form.Item name="fechaEntrega" rules={[requiredField]}>
              <DatePickerAntd label="Fecha de entrega" />
            </Form.Item>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Form.Item name="direccionEntrega" rules={[requiredField]}>
              <InputAntd label="Dirección" />
            </Form.Item>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Form.Item name="referenciaEntrega" rules={[requiredField]}>
              <InputAntd label="Referencia" />
            </Form.Item>
          </Grid>
        </Grid>
      </StepItemContent>

      {openClients ? (
        <ClientSelectorModal onClose={() => setOpenClients(false)} onSelected={(data) => form.setFieldValue('clienteEstado', data)} />
      ) : null}
    </Fragment>
  );
};

export default InputsSecondStep;
