import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, Stack, Typography } from '@mui/material';
import { Form, notification, Spin } from 'antd';
import { Close } from '@mui/icons-material';
import InputsFirstStep from './InputsFirstStep';
import InputsSecondStep from './InputsSecondStep';
import InputsThirdStep from './InputsThirdStep';
import InputsFourthStep from './InputsFourthStep';
import InputsFifthStep from './InputsFifthStep';
import { createDirectSale } from '@/services/sales/sales.request';
import { SaleProcessedProps, SaleProps } from '@/services/sales/sales';
import dayjs from 'dayjs';
// import { uploadFile } from '@/services/files/file.requests';
import { removeAccents } from '@/utils/functions';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';

interface SalesModalProps {
  handleClose: VoidFunction;
  handleReload: VoidFunction;
  data?: SaleProps;
  processed?: SaleProcessedProps;
}

const SalesModal = ({ handleClose, handleReload, data, processed }: SalesModalProps) => {
  const isEdit = !!data && !processed;
  const { regions, companies, clients } = useGlobalInformation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (processed) {
      // codigoCatalogo,
      // contactos,
      // distritoEntrega,
      // provinciaEntrega,

      const findCompany = companies.find((item) => item.ruc === processed.empresaRuc);
      const findClient = clients.find((item) => item.ruc === processed.clienteRuc);
      const findRegion = regions.find(
        (item) => removeAccents(item.name).toLowerCase() === removeAccents(processed.departamentoEntrega).toLowerCase()
      );

      form.setFieldsValue({
        tipoVenta: processed.ventaPrivada ? 'privada' : 'directa',
        empresa: findCompany?.id,
        empresaComplete: findCompany,
        cliente: findClient?.id,
        clienteComplete: findClient,
        regionEntregaComplete: findRegion,
        regionEntrega: findRegion?.id,
        direccionEntrega: processed.direccionEntrega,
        referenciaEntrega: processed.referenciaEntrega,
        fechaEntrega: dayjs(processed.fechaEntrega).isValid() ? dayjs(processed.fechaEntrega) : null,
        fechaFormalizacion: dayjs(processed.fechaForm).isValid() ? dayjs(processed.fechaForm) : null,
        fechaMaxEntrega: dayjs(processed.fechaMaxEntrega ?? processed.fechaMaxForm).isValid()
          ? dayjs(processed.fechaMaxEntrega ?? processed.fechaMaxForm)
          : null,
        montoVenta: processed.montoVenta,
        productos: processed.productos,
        numeroSIAF: processed.siaf,
        fechaSIAF: dayjs(processed.fechaSiaf).isValid() ? dayjs(processed.fechaSiaf) : null,
      });

      // return;
    }

    // if (data) {
    //   form.setFieldsValue({
    //     etapaSIAF: data.etapaSiaf,
    //     fechaSIAF: dayjs(data.fechaSiaf),
    //     empresa: data.empresaId,
    //     empresaComplete: data.empresa,
    //     tipoVenta: data.ventaPrivada ? 'privada' : 'directa',
    //     cliente: data.clienteId,
    //     clienteComplete: data.cliente,
    //     regionEntregaComplete: data.departamentoEntrega,
    //     regionEntrega: data.departamentoEntrega?.id,
    //     provinciaEntregaComplete: data.provinciaEntrega,
    //     provinciaEntrega: data.provinciaEntrega?.id,
    //     distritoEntregaComplete: data.distritoEntrega,
    //     distritoEntrega: data.distritoEntrega?.id,
    //     fechaEntrega: dayjs(data.fechaEntrega),
    //     direccionEntrega: data.direccionEntrega,
    //     referenciaEntrega: data.referenciaEntrega,
    //     catalogoComplete: data.catalogoEmpresa,
    //     catalogo: data.catalogoEmpresaId,
    //     fechaFormalizacion: dayjs(data.fechaForm),
    //     fechaMaxEntrega: dayjs(data.fechaMaxForm),
    //     montoVenta: data.montoVenta,
    //     numeroSIAF: data.siaf,
    //     cargoContactoComplete: data.contactoCliente,
    //     cargoContacto: data.contactoClienteId,
    //     nombreContacto: data.contactoCliente?.nombre,
    //     celularContacto: data.contactoCliente?.telefono,
    //     productos: data.productos,
    //   });
    // }
  }, [data, companies, clients, regions]);

  const handleFinish = async (values: Record<string, any>) => {
    try {
      if (isEdit) {
        notification.error({ message: 'EDICIÓN NO IMPLEMENTADA POR COMPLETO' });
        return;
      }

      setLoading(true);

      let OCE_DOC = 'https://pub-be92c56cdc1645c5aac3eb28d9ddb2c8.r2.dev/general-uploads/L73_-7HanJ-y-tYeeeO1R.pdf';
      let OCF_DOC = 'https://pub-be92c56cdc1645c5aac3eb28d9ddb2c8.r2.dev/general-uploads/L73_-7HanJ-y-tYeeeO1R.pdf';
      // if (values.ordenCompraElectronica) {
      //   OCE_DOC = await uploadFile(values.ordenCompraElectronica);
      // }
      // if (values.ordenCompraFisica) {
      //   OCF_DOC = await uploadFile(values.ordenCompraFisica);
      // }

      let bodyVentaPrivada = null;
      if (values.tipoVenta === 'privada') {
        const pagos = [];
        for (const payment of values.pagos) {
          // const archivoPago = await uploadFile(payment.file);
          pagos.push({
            fechaPago: payment.date.toISOString(),
            bancoPago: payment.bank,
            descripcionPago: payment.description,
            archivoPago: 'https://pub-be92c56cdc1645c5aac3eb28d9ddb2c8.r2.dev/general-uploads/L73_-7HanJ-y-tYeeeO1R.pdf',
            montoPago: payment.amount,
            estadoPago: payment.status === 'activo',
          });
        }

        // const documentoPago = await uploadFile(values.documentoFactura);
        bodyVentaPrivada = {
          clienteId: values.privateClient,
          contactoClienteId: values.privateContact,
          estadoPago: values.facturaStatus,
          fechaPago: values.dateFactura.toISOString(),
          documentoPago: 'https://pub-be92c56cdc1645c5aac3eb28d9ddb2c8.r2.dev/general-uploads/L73_-7HanJ-y-tYeeeO1R.pdf',
          pagos,
        };
      }

      const bodyVentaDirecta = {
        empresa: { connect: { id: values.empresa } },
        cliente: { connect: { id: values.cliente } },
        contactoCliente: { connect: { id: values.cargoContacto } },
        catalogoEmpresa: { connect: { id: values.catalogo } },

        ventaPrivada: bodyVentaPrivada,
        departamentoEntrega: JSON.stringify(values.regionEntregaComplete),
        provinciaEntrega: JSON.stringify(values.provinciaEntregaComplete),
        distritoEntrega: JSON.stringify(values.distritoEntregaComplete),
        direccionEntrega: values.direccionEntrega,
        referenciaEntrega: values.referenciaEntrega,
        fechaEntrega: values.fechaEntrega.toISOString(),
        fechaForm: values.fechaFormalizacion.toISOString(),
        fechaMaxForm: values.fechaMaxEntrega.toISOString(),
        montoVenta: Number(values.montoVenta),
        siaf: values.numeroSIAF,
        etapaSiaf: values.etapaSIAF,
        fechaSiaf: values.fechaSIAF.toISOString(),
        documentoOce: OCE_DOC,
        documentoOcf: OCF_DOC,
        productos: values.productos,
      };

      console.log('body', bodyVentaDirecta);

      await createDirectSale(bodyVentaDirecta);

      handleClose();
      handleReload();

      notification.success({ message: `La venta fue ${isEdit ? 'actualizada' : 'registrada'} correctamente` });
    } catch (error) {
      notification.error({ message: 'No se logró completa la transacción', description: `Intente mas tarde. ${error}` });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h5" color="primary" fontWeight={700}>
            {isEdit ? 'EDITAR' : 'REGISTRAR NUEVA'} VENTA
          </Typography>
          <Fab onClick={handleClose} size="small" disabled={loading}>
            <Close />
          </Fab>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Spin spinning={loading} size="large" tip="..:: Espere mientras finaliza la transacción ::..">
          <Form form={form} onFinish={handleFinish}>
            <Stack direction="column" spacing={2}>
              <InputsFirstStep form={form} />

              <InputsSecondStep form={form} />

              <InputsThirdStep form={form} />

              <InputsFourthStep form={form} />

              <InputsFifthStep />
            </Stack>
            <Button type="submit" className="d-none"></Button>
          </Form>
        </Spin>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" disabled={loading} onClick={handleClose}>
          Cancelar
        </Button>
        <Button loading={loading} onClick={() => form.submit()}>
          Finalizar y {isEdit ? 'actualizar' : 'registrar'} venta
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SalesModal;
