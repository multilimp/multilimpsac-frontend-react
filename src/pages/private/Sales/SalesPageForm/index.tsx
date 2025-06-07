import { useEffect, useState } from 'react';
import { Box, Button, Collapse, Stack } from '@mui/material';
import { Form, message, notification, Spin } from 'antd';
import InputsFirstStep from './InputsFirstStep';
import InputsSecondStep from './InputsSecondStep';
import InputsThirdStep from './InputsThirdStep';
import InputsFourthStep from './InputsFourthStep';
import InputsFifthStep from './InputsFifthStep';
import { createDirectSale, processPdfSales } from '@/services/sales/sales.request';
import { SaleProps } from '@/services/sales/sales';
import dayjs from 'dayjs';
import { removeAccents } from '@/utils/functions';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { BlackBarKeyEnum } from '@/types/global.enum';

interface SalesPageFormProps {
  handleClose: VoidFunction;
  handleReload: VoidFunction;
  data?: SaleProps;
}

const SalesPageForm = ({ handleClose, handleReload, data }: SalesPageFormProps) => {
  const isEdit = !!data;
  const { regions, companies, clients, saleInputValues, setSaleInputValues, setBlackBarKey } = useGlobalInformation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleAnalizeFile();
  }, [saleInputValues]);

  useEffect(() => {
    setBlackBarKey(BlackBarKeyEnum.OC);
    return () => {
      setSaleInputValues({ enterprise: null, tipoVenta: 'directa', file: null });
      setBlackBarKey(null);
    };
  }, []);

  useEffect(() => {
    // if (data) {
    //   form.setFieldsValue({
    //     etapaSIAF: data.etapaSiaf,
    //     fechaSIAF: dayjs(data.fechaSiaf),
    //     empresa: data.empresaId,
    //     empresaComplete: data.empresa,
    //     tipoVenta: data.ventaPrivada ? 'privada' : 'directa',
    //     clienteEstado: data.cliente,
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

  const handleAnalizeFile = async () => {
    try {
      setLoading(true);
      if (!saleInputValues.file) return;
      const correctTypeFile = saleInputValues.file.type === 'application/pdf';
      if (!correctTypeFile) throw new Error('INCORRECT FILE');

      const response = await processPdfSales(saleInputValues.file);

      const findCompany = companies.find((item) => item.ruc === response.empresaRuc);
      const findClient = clients.find((item) => item.ruc === response.clienteRuc);
      const findRegion = regions.find((item) => removeAccents(item.name).toLowerCase() === removeAccents(response.departamentoEntrega).toLowerCase());

      // codigoCatalogo,
      // contactos,
      // distritoEntrega,
      // provinciaEntrega,
      setSaleInputValues({ enterprise: findCompany ?? null, tipoVenta: response.ventaPrivada ? 'privada' : 'directa', file: null });
      form.setFieldsValue({
        clienteEstado: findClient,
        regionEntregaComplete: findRegion,
        regionEntrega: findRegion?.id,
        direccionEntrega: response.direccionEntrega,
        referenciaEntrega: response.referenciaEntrega,
        fechaEntrega: dayjs(response.fechaEntrega).isValid() ? dayjs(response.fechaEntrega) : null,
        fechaFormalizacion: dayjs(response.fechaForm).isValid() ? dayjs(response.fechaForm) : null,
        fechaMaxEntrega: dayjs(response.fechaMaxEntrega ?? response.fechaMaxForm).isValid()
          ? dayjs(response.fechaMaxEntrega ?? response.fechaMaxForm)
          : null,
        montoVenta: response.montoVenta,
        productos: response.productos,
        numeroSIAF: response.siaf,
        fechaSIAF: dayjs(response.fechaSiaf).isValid() ? dayjs(response.fechaSiaf) : null,
      });
    } catch (error) {
      message.error(`El archivo no pudo ser procesado`);
      setSaleInputValues({ ...saleInputValues, file: null });
    } finally {
      setLoading(false);
    }
  };

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
          clienteId: values.clientePrivate.id,
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
    <Box>
      <Spin spinning={loading} size="large" tip="..:: Espere mientras finaliza la operación ::..">
        <Form form={form} onFinish={handleFinish}>
          <Stack direction="column" spacing={2}>
            <Collapse in={saleInputValues.tipoVenta === 'privada'}>
              <InputsFirstStep form={form} />
            </Collapse>

            <InputsSecondStep form={form} />

            <InputsThirdStep form={form} />

            <InputsFourthStep form={form} />

            <InputsFifthStep />
          </Stack>
          <Button type="submit" className="d-none"></Button>
        </Form>
      </Spin>

      <Stack direction="row" spacing={2} my={5} justifyContent="center">
        <Button loading={loading} onClick={() => form.submit()}>
          Finalizar y {isEdit ? 'actualizar' : 'registrar'} venta
        </Button>
      </Stack>
    </Box>
  );
};

export default SalesPageForm;
