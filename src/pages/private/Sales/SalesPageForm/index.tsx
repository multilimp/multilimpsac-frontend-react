import { useEffect, useState } from 'react';
import { Box, Button, Collapse, Stack } from '@mui/material';
import { Form, message, notification, Spin, Select } from 'antd';
import InputsFirstStep from './InputsFirstStep';
import InputsSecondStep from './InputsSecondStep';
import InputsThirdStep from './InputsThirdStep';
import InputsFourthStep from './InputsFourthStep';
import InputsFifthStep from './InputsFifthStep';
import { createDirectSale, processPdfSales, getSaleById, updateSale } from '@/services/sales/sales.request';
import dayjs from 'dayjs';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { BlackBarKeyEnum } from '@/types/global.enum';
import { useParams, useNavigate } from 'react-router-dom';
import { SaleProps } from '@/services/sales/sales';
import { parseJSON } from '@/utils/functions';

const SalesPageForm = () => {
  const { companies, clients, saleInputValues, setSaleInputValues, setBlackBarKey, obtainSales } = useGlobalInformation();
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
            
            // Productos - asegurar que siempre sea un array usando parseJSON
            productos: Array.isArray(saleData.productos) ? saleData.productos : parseJSON(saleData.productos) || [],
            
            // Entrega - cargar directamente como strings
            direccionEntrega: saleData.direccionEntrega,
            referenciaEntrega: saleData.referenciaEntrega,
            regionEntrega: saleData.departamentoEntrega,
            provinciaEntrega: saleData.provinciaEntrega,
            distritoEntrega: saleData.distritoEntrega,
            estadoVenta: saleData.estadoVenta || 'incompleto',
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

      setSaleInputValues({ enterprise: findCompany ?? null, tipoVenta: response.ventaPrivada ? 'privada' : 'directa', file: null });
      form.setFieldsValue({
        clienteEstado: findClient,
        regionEntrega: response.regionEntrega,
        provinciaEntrega:  response.provinciaEntrega,
        distritoEntrega:  response.distritoEntrega,
        direccionEntrega: response.direccionEntrega,
        referenciaEntrega: response.referenciaEntrega,
        fechaEntrega: dayjs(response.fechaEntrega).isValid() ? dayjs(response.fechaEntrega) : null,
        fechaFormalizacion: dayjs(response.fechaForm).isValid() ? dayjs(response.fechaForm) : null,
        fechaMaxEntrega: dayjs(response.fechaMaxEntrega ?? response.fechaMaxForm).isValid()
          ? dayjs(response.fechaMaxEntrega ?? response.fechaMaxForm)
          : null,
        montoVenta: response.montoVenta,
        productos: response.productos,
        numeroSIAF: response.siaf ? String(response.siaf) : null,
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
          departamentoEntrega: values.regionEntrega || null,
          provinciaEntrega: values.provinciaEntrega || null,
          distritoEntrega: values.distritoEntrega || null,
          direccionEntrega: values.direccionEntrega || null,
          referenciaEntrega: values.referenciaEntrega || null,
          fechaForm: values.fechaFormalizacion ? values.fechaFormalizacion.toISOString() : null,
          fechaMaxForm: values.fechaMaxEntrega ? values.fechaMaxEntrega.toISOString() : null,
          montoVenta: values.montoVenta ? Number(values.montoVenta) : null,
          siaf: values.numeroSIAF ? String(values.numeroSIAF) : null,
          etapaSiaf: values.etapaSIAF || null,
          fechaSiaf: values.fechaSIAF ? values.fechaSIAF.toISOString() : null,
          estadoVenta: values.estadoVenta || 'incompleto',
          documentoOce: values.ordenCompraElectronica || null,
          documentoOcf: values.ordenCompraFisica || null,
          productos: values.productos || [],
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

        // Validar datos requeridos
        if (!saleInputValues.enterprise?.id) {
          notification.error({ message: 'Error', description: 'Debe seleccionar una empresa' });
          return;
        }
        if (!values.clienteEstado?.id) {
          notification.error({ message: 'Error', description: 'Debe seleccionar un cliente' });
          return;
        }
        if (!values.cargoContacto) {
          notification.error({ message: 'Error', description: 'Debe seleccionar un contacto' });
          return;
        }
        if (!values.catalogo) {
          notification.error({ message: 'Error', description: 'Debe seleccionar un catálogo' });
          return;
        }

        const bodyVentaDirecta = {
          empresa: { connect: { id: saleInputValues.enterprise?.id } },
          cliente: { connect: { id: values.clienteEstado?.id } },
          contactoCliente: { connect: { id: values.cargoContacto } },
          catalogoEmpresa: { connect: { id: values.catalogo } },

          ventaPrivada: bodyVentaPrivada,
          departamentoEntrega: values.regionEntrega || null,
          provinciaEntrega: values.provinciaEntrega || null,
          distritoEntrega: values.distritoEntrega || null,
          direccionEntrega: values.direccionEntrega || null,
          referenciaEntrega: values.referenciaEntrega || null,
          fechaForm: values.fechaFormalizacion ? values.fechaFormalizacion.toISOString() : null,
          fechaMaxForm: values.fechaMaxEntrega ? values.fechaMaxEntrega.toISOString() : null,
          montoVenta: values.montoVenta ? Number(values.montoVenta) : null,
          siaf: values.numeroSIAF ? String(values.numeroSIAF) : null,
          etapaSiaf: values.etapaSIAF || null,
          fechaSiaf: values.fechaSIAF ? values.fechaSIAF.toISOString() : null,
          estadoVenta: values.estadoVenta || 'incompleto',
          documentoOce: values.ordenCompraElectronica || null,
          documentoOcf: values.ordenCompraFisica || null,
          productos: values.productos || [],
        };

        console.log('Datos a enviar:', bodyVentaDirecta);
        await createDirectSale(bodyVentaDirecta);

        notification.success({ message: `La venta fue registrada correctamente` });
        form.resetFields();
        obtainSales();
      }
    } catch (error: any) {
      console.error('Error al guardar venta:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Error desconocido';
      notification.error({ 
        message: 'Error al guardar la venta', 
        description: errorMessage,
        duration: 5
      });
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

            <InputsSecondStep form={form} isEditing={isEditing} currentSale={currentSale} />

            <InputsThirdStep form={form} companyId={saleInputValues.enterprise?.id!} />

            <InputsFourthStep form={form} />

            <InputsFifthStep />
            
            {/* Estado de venta - mantener dentro del Form para sincronización */}
            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" mt={3}>
              <Form.Item 
                name="estadoVenta" 
                rules={[{ required: true, message: 'Seleccione un estado' }]}
                initialValue="incompleto"
                style={{ margin: 0 }}
              >
                <Select
                  placeholder="Estado de la venta"
                  size="large"
                  style={{ minWidth: 200 }}
                  options={[
                    { 
                      value: 'completo', 
                      label: (
                        <span style={{ color: '#006fee', fontWeight: 600 }}>
                          🟢 Completo
                        </span>
                      ) 
                    },
                    { 
                      value: 'incompleto', 
                      label: (
                        <span style={{ color: '#f5a524', fontWeight: 600 }}>
                          🟡 Incompleto
                        </span>
                      ) 
                    },
                    { 
                      value: 'rechazado', 
                      label: (
                        <span style={{ color: '#f31260', fontWeight: 600 }}>
                          🔴 Rechazado
                        </span>
                      ) 
                    },
                  ]}
                />
              </Form.Item>
            </Stack>
          </Stack>
          <Button type="submit" className="d-none"></Button>
        </Form>
      </Spin>

      <Stack direction="row" spacing={2} my={5} justifyContent="center" alignItems="center">
        <Button loading={loading} onClick={() => form.submit()}>
          {isEditing ? 'Actualizar venta' : 'Finalizar y registrar venta'}
        </Button>
      </Stack>
    </Box>
  );
};

export default SalesPageForm;
