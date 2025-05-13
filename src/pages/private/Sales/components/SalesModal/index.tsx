
import { useEffect, useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, Fab, Stack, Step, Stepper, Typography } from '@mui/material';
import { Form, notification } from 'antd';
import { Close } from '@mui/icons-material';
import InputsFirstStep from './InputsFirstStep';
import InputsSecondStep from './InputsSecondStep';
import InputsThirdStep from './InputsThirdStep';
import InputsFourthStep from './InputsFourthStep';
import InputsFifthStep from './InputsFifthStep';
import { createSale } from '@/services/sales/sales.request';
import { SaleProps } from '@/services/sales/sales';
import dayjs from 'dayjs';

interface SalesModalProps {
  handleClose: VoidFunction;
  handleReload: VoidFunction;
  data?: SaleProps;
  processed?: boolean;
}

const SalesModal = ({ handleClose, handleReload, data }: SalesModalProps) => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data) return;

    form.setFieldsValue({
      direccionEntrega: data.direccionEntrega ?? '',
      etapaSIAF: data.etapaSiaf,
      fechaEntrega: data.fechaEntrega ? dayjs(data.fechaEntrega) : null,
      fechaFormalizacion: data.fechaForm ? dayjs(data.fechaForm) : null,
      fechaMaxEntrega: data.fechaMaxForm ? dayjs(data.fechaMaxForm) : null,
      fechaSIAF: data.fechaSiaf ? dayjs(data.fechaSiaf) : null,
      montoVenta: data.montoVenta,
      productos: Array.isArray(data.productos) ? data.productos : [],
      referenciaEntrega: data.referenciaEntrega,
      numeroSIAF: data.siaf,
      tipoVenta: data.ventaPrivada ? 'privada' : 'directa',
    });
  }, [data]);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleFinish = async (values: Record<string, any>) => {
    try {
      setLoading(true);

      const body = {
        empresaId: values.empresa,
        ventaPrivada: values.tipoVenta === 'privada',

        fechaEmision: new Date().toISOString(),

        clienteId: values.cliente,
        departamentoEntrega: JSON.stringify(values.regionEntregaComplete),
        provinciaEntrega: JSON.stringify(values.provinciaEntregaComplete),
        distritoEntrega: JSON.stringify(values.distritoEntregaComplete),
        direccionEntrega: values.direccionEntrega,
        referenciaEntrega: values.referenciaEntrega,
        fechaEntrega: values.fechaEntrega.toISOString(),

        catalogoEmpresaId: values.catalogo,
        fechaForm: values.fechaFormalizacion.toISOString(),
        fechaMaxForm: values.fechaMaxEntrega.toISOString(),
        montoVenta: Number(values.montoVenta),
        siaf: values.numeroSIAF,
        etapaSiaf: values.etapaSIAF,
        fechaSiaf: values.fechaSIAF.toISOString(),
        documentoOce: 'https://www.sammobile.com/wp-content/uploads/2023/12/Files-By-Google.jpg',
        documentoOcf: 'https://www.sammobile.com/wp-content/uploads/2023/12/Files-By-Google.jpg',

        contactoClienteId: values.cargoContacto,

        productos: values.productos,
      };

      await createSale(body);

      handleClose();
      handleReload();

      notification.success({ message: 'La venta fue registrada correctamente' });
    } catch (error) {
      notification.error({ message: 'No se logró registrar la venta', description: `Intente mas tarde. ${error}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open fullScreen>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h5" color="primary">
            REGISTRAR NUEVA VENTA
          </Typography>
          <Fab onClick={handleClose} size="small" disabled={loading}>
            <Close />
          </Fab>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Form form={form} onFinish={handleFinish}>
          <Stepper activeStep={step} orientation="vertical">
            <Step active={step === 1}>
              <InputsFirstStep form={form} dback next={handleNext} />
            </Step>

            <Step active={step === 2}>
              <InputsSecondStep form={form} back={handleBack} next={handleNext} />
            </Step>

            <Step active={step === 3}>
              <InputsThirdStep form={form} back={handleBack} next={handleNext} />
            </Step>

            <Step active={step === 4}>
              <InputsFourthStep form={form} back={handleBack} next={handleNext} />
            </Step>

            <Step active={step === 5}>
              <InputsFifthStep form={form} back={handleBack} next={handleNext} />
            </Step>
          </Stepper>

          {step === 6 && (
            <Stack alignItems="center" justifyContent="center" my={5}>
              <Typography variant="h5">Completaste todos los pasos correctamante</Typography>
              <Stack direction="row" mt={3} spacing={2}>
                <Button variant="outlined" onClick={() => handleBack()} disabled={loading}>
                  Volver al último paso
                </Button>
                <Button loading={loading} type="submit">
                  Finalizar y registrar venta
                </Button>
              </Stack>
            </Stack>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SalesModal;
