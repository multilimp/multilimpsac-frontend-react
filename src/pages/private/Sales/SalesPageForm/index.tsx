import { useEffect, useState } from 'react';
import { Box, Button, Collapse, Stack } from '@mui/material';
import { Form, message, notification, Spin } from 'antd';
import InputsFirstStep from './InputsFirstStep';
import InputsSecondStep from './InputsSecondStep';
import InputsThirdStep from './InputsThirdStep';
import InputsFourthStep from './InputsFourthStep';
import InputsFifthStep from './InputsFifthStep';
import { createDirectSale, processPdfSales, getSaleById, updateSale } from '@/services/sales/sales.request';
import { getProvinces, getDistricts } from '@/services/ubigeo/ubigeo.requests';
import dayjs from 'dayjs';
import { removeAccents } from '@/utils/functions';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { BlackBarKeyEnum } from '@/types/global.enum';
import { useParams, useNavigate } from 'react-router-dom';
import { SaleProps } from '@/services/sales/sales';

const SalesPageForm = () => {
  const { regions, companies, clients, saleInputValues, setSaleInputValues, setBlackBarKey, obtainSales } = useGlobalInformation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [currentSale, setCurrentSale] = useState<SaleProps | null>(null);

  useEffect(() => {
    handleAnalizeFile();
  }, [saleInputValues]);

  // Nuevo useEffect para cargar datos de venta en modo edición
  useEffect(() => {
    const loadSaleData = async () => {
      if (isEditing && id) {
        try {
          setLoading(true);
          const saleData = await getSaleById(Number(id));
          setCurrentSale(saleData);
          
          // Determinar si es venta privada y configurar el tipo
          const isPrivateSale = saleData.ventaPrivada;
          setSaleInputValues(prev => ({ 
            ...prev, 
            enterprise: saleData.empresa,
            tipoVenta: isPrivateSale ? 'privada' : 'directa' 
          }));
          
          // Prellenar el formulario con los datos de la venta
          const formValues: any = {
            // Información básica
            clienteEstado: saleData.cliente,
            catalogo: saleData.catalogoEmpresa.id,
            catalogoComplete: saleData.catalogoEmpresa,
            fechaFormalizacion: dayjs(saleData.fechaForm),
            fechaMaxEntrega: dayjs(saleData.fechaMaxForm),
            montoVenta: saleData.montoVenta,
            numeroSIAF: saleData.siaf,
            etapaSIAF: saleData.etapaSiaf,
            fechaSIAF: dayjs(saleData.fechaSiaf),
            ordenCompraElectronica: saleData.documentoOce,
            ordenCompraFisica: saleData.documentoOcf,
            
            // Datos de contacto
            cargoContactoComplete: saleData.contactoCliente,
            cargoContacto: saleData.contactoCliente.id,
            nombreContacto: saleData.contactoCliente.nombre,
            celularContacto: saleData.contactoCliente.telefono,
            
            // Productos
            productos: saleData.productos,
            
            // Entrega
            departamentoEntregaComplete: saleData.departamentoEntrega,
            departamentoEntrega: saleData.departamentoEntrega?.id,
            provinciaEntregaComplete: saleData.provinciaEntrega,
            provinciaEntrega: saleData.provinciaEntrega?.id,
            distritoEntregaComplete: saleData.distritoEntrega,
            distritoEntrega: saleData.distritoEntrega?.id,
            direccionEntrega: saleData.direccionEntrega,
            referenciaEntrega: saleData.referenciaEntrega,
          };

          // Si es venta privada, cargar datos específicos
          if (isPrivateSale && saleData.ordenCompraPrivada) {
            formValues.clientePrivate = saleData.ordenCompraPrivada.cliente;
            formValues.privateContact = saleData.ordenCompraPrivada.contactoClienteId;
            formValues.facturaStatus = saleData.ordenCompraPrivada.estadoPago;
            formValues.dateFactura = saleData.ordenCompraPrivada.fechaPago ? dayjs(saleData.ordenCompraPrivada.fechaPago) : null;
            formValues.documentoFactura = saleData.ordenCompraPrivada.documentoPago;
            
            // Cargar pagos si existen
            if (saleData.ordenCompraPrivada.pagos && saleData.ordenCompraPrivada.pagos.length > 0) {
              formValues.pagos = saleData.ordenCompraPrivada.pagos.map((pago: any) => ({
                date: dayjs(pago.fechaPago),
                bank: pago.bancoPago,
                description: pago.descripcionPago,
                file: pago.archivoPago,
                amount: pago.montoPago,
                status: pago.estadoPago ? 'activo' : 'inactivo',
              }));
            }
          }

          form.setFieldsValue(formValues);
        } catch (error) {
          console.error('Error al cargar los datos de la venta:', error);
          message.error('Error al cargar los datos de la venta');
          navigate('/sales');
        } finally {
          setLoading(false);
        }
      }
    };

    loadSaleData();
  }, [id, isEditing, form, navigate, setSaleInputValues]);

  useEffect(() => {
    setBlackBarKey(BlackBarKeyEnum.OC);
    return () => {
      setSaleInputValues({ enterprise: null, tipoVenta: 'directa', file: null });
      setBlackBarKey(null);
    };
  }, [setSaleInputValues, setBlackBarKey]);
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

      // Buscar provincia dentro de la región encontrada
      let findProvince = null;
      let findDistrict = null;

      if (findRegion && response.provinciaEntrega) {
        try {
          const provinces = await getProvinces(findRegion.id);
          findProvince = provinces.find((item) => removeAccents(item.name).toLowerCase() === removeAccents(response.provinciaEntrega).toLowerCase());

          // Buscar distrito dentro de la provincia encontrada
          if (findProvince && response.distritoEntrega) {
            const districts = await getDistricts(findProvince.id);
            findDistrict = districts.find((item) => removeAccents(item.name).toLowerCase() === removeAccents(response.distritoEntrega).toLowerCase());
          }
        } catch (error) {
          console.error('Error cargando provincias/distritos:', error);
        }
      }

      console.log('📄 PDF Analysis Results:');
      console.log('  - Región encontrada:', findRegion);
      console.log('  - Provincia encontrada:', findProvince);
      console.log('  - Distrito encontrado:', findDistrict);
      console.log('  - Response original:', response);

      setSaleInputValues({ enterprise: findCompany ?? null, tipoVenta: response.ventaPrivada ? 'privada' : 'directa', file: null });
      form.setFieldsValue({
        clienteEstado: findClient,
        regionEntregaComplete: findRegion,
        regionEntrega: findRegion?.id,
        provinciaEntrega: findProvince?.name || response.provinciaEntrega,
        distritoEntrega: findDistrict?.name || response.distritoEntrega,
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
      message.error(`El archivo no pudo ser procesado. ${error}`);
      setSaleInputValues({ ...saleInputValues, file: null });
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async (values: Record<string, any>) => {
    try {
      setLoading(true);

      if (isEditing && id) {
        // Modo edición
        const baseVentaData = {
          empresa: { connect: { id: saleInputValues.enterprise?.id || currentSale?.empresa.id } },
          cliente: { connect: { id: values.clienteEstado?.id } },
          contactoCliente: { connect: { id: values.cargoContacto } },
          catalogoEmpresa: { connect: { id: values.catalogo } },
          ventaPrivada: saleInputValues.tipoVenta === 'privada',
          departamentoEntrega: JSON.stringify(values.regionEntregaComplete),
          provinciaEntrega: JSON.stringify(values.provinciaEntregaComplete),
          distritoEntrega: JSON.stringify(values.distritoEntregaComplete),
          direccionEntrega: values.direccionEntrega,
          referenciaEntrega: values.referenciaEntrega,
          fechaForm: values.fechaFormalizacion.toISOString(),
          fechaMaxForm: values.fechaMaxEntrega.toISOString(),
          montoVenta: Number(values.montoVenta),
          siaf: values.numeroSIAF,
          etapaSiaf: values.etapaSIAF,
          fechaSiaf: values.fechaSIAF.toISOString(),
          documentoOce: values.ordenCompraElectronica,
          documentoOcf: values.ordenCompraFisica,
          productos: values.productos,
        };

        // Si es venta privada, incluir datos específicos
        if (saleInputValues.tipoVenta === 'privada') {
          const pagos = [];
          if (values.pagos && Array.isArray(values.pagos)) {
            for (const payment of values.pagos) {
              pagos.push({
                fechaPago: payment.date.toISOString(),
                bancoPago: payment.bank,
                descripcionPago: payment.description,
                archivoPago: payment.file,
                montoPago: Number(payment.amount),
                estadoPago: payment.status === 'activo',
              });
            }
          }

          const bodyVentaPrivada = {
            ...baseVentaData,
            ventaPrivada: {
              clienteId: values.clientePrivate?.id,
              contactoClienteId: values.privateContact,
              estadoPago: values.facturaStatus,
              fechaPago: values.dateFactura?.toISOString(),
              documentoPago: values.documentoFactura,
              pagos,
            },
          };

          await updateSale(Number(id), bodyVentaPrivada);
        } else {
          // Venta directa
          await updateSale(Number(id), baseVentaData);
        }

        notification.success({ message: `La venta fue actualizada correctamente` });
        obtainSales();
        navigate('/sales');
      } else {
        // Modo creación (código existente)
        let bodyVentaPrivada = null;
        if (saleInputValues.tipoVenta === 'privada') {
          const pagos = [];
          for (const payment of values.pagos) {
            pagos.push({
              fechaPago: payment.date.toISOString(),
              bancoPago: payment.bank,
              descripcionPago: payment.description,
              archivoPago: payment.file,
              montoPago: payment.amount,
              estadoPago: payment.status === 'activo',
            });
          }

          bodyVentaPrivada = {
            clienteId: values.clientePrivate.id,
            contactoClienteId: values.privateContact,
            estadoPago: values.facturaStatus,
            fechaPago: values.dateFactura.toISOString(),
            documentoPago: values.documentoFactura,
            pagos,
          };
        }

        console.log(values, saleInputValues);

        const bodyVentaDirecta = {
          empresa: { connect: { id: saleInputValues.enterprise?.id } },
          cliente: { connect: { id: values.clienteEstado?.id } },
          contactoCliente: { connect: { id: values.cargoContacto } },
          catalogoEmpresa: { connect: { id: values.catalogo } },

          ventaPrivada: bodyVentaPrivada,
          departamentoEntrega: JSON.stringify(values.regionEntregaComplete),
          provinciaEntrega: JSON.stringify(values.provinciaEntregaComplete),
          distritoEntrega: JSON.stringify(values.distritoEntregaComplete),
          direccionEntrega: values.direccionEntrega,
          referenciaEntrega: values.referenciaEntrega,
          fechaForm: values.fechaFormalizacion.toISOString(),
          fechaMaxForm: values.fechaMaxEntrega.toISOString(),
          montoVenta: Number(values.montoVenta),
          siaf: values.numeroSIAF,
          etapaSiaf: values.etapaSIAF,
          fechaSiaf: values.fechaSIAF.toISOString(),
          documentoOce: values.ordenCompraElectronica,
          documentoOcf: values.ordenCompraFisica,
          productos: values.productos,
        };

        await createDirectSale(bodyVentaDirecta);

        notification.success({ message: `La venta fue registrada correctamente` });
        form.resetFields();
        obtainSales();
      }
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
            <Collapse in={saleInputValues.tipoVenta === 'privada'} unmountOnExit>
              <InputsFirstStep form={form} />
            </Collapse>

            <InputsSecondStep form={form} />

            <InputsThirdStep form={form} companyId={saleInputValues.enterprise?.id!} />

            <InputsFourthStep form={form} />

            <InputsFifthStep />
          </Stack>
          <Button type="submit" className="d-none"></Button>
        </Form>
      </Spin>

      <Stack direction="row" spacing={2} my={5} justifyContent="center">
        <Button loading={loading} onClick={() => form.submit()}>
          {isEditing ? 'Actualizar venta' : 'Finalizar y registrar venta'}
        </Button>
      </Stack>
    </Box>
  );
};

export default SalesPageForm;
