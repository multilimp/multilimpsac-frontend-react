import { useEffect, useState } from 'react';
import { Box, Button, Collapse, Stack, Typography } from '@mui/material';
import { Form, message, notification, Spin, Select, Card } from 'antd';
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
import { Save } from '@mui/icons-material';

const SalesPageForm = () => {
  const { companies, clients, saleInputValues, setSaleInputValues, setBlackBarKey, obtainSales, setSelectedSale } = useGlobalInformation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [currentSale, setCurrentSale] = useState<SaleProps | null>(null);

  // Estados para PaymentsList
  const [payments, setPayments] = useState<any[]>([{
    date: null,
    bank: '',
    description: '',
    file: null,
    amount: '',
    status: true,
  }]);
  const [tipoPago, setTipoPago] = useState<string>('PENDIENTE');
  const [notaPago, setNotaPago] = useState<string>('');

  // Inicializar valores por defecto si no están configurados
  useEffect(() => {
    if (!isEditing && (!saleInputValues.enterprise && !saleInputValues.tipoVenta)) {
      setSaleInputValues({
        enterprise: null,
        file: null,
        tipoVenta: 'directa'
      });
    }
  }, [isEditing, saleInputValues, setSaleInputValues]);

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

          // ✅ NUEVO: Pasar también al contexto global para BlackBar
          setSelectedSale(saleData);

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
            // Solo incluir catálogo si no es venta privada y existe
            ...((!isPrivateSale && saleData.catalogoEmpresa) && {
              catalogo: saleData.catalogoEmpresa.id,
              catalogoComplete: saleData.catalogoEmpresa,
            }),
            fechaFormalizacion: dayjs(saleData.fechaForm),
            fechaMaxEntrega: dayjs(saleData.fechaMaxForm),
            montoVenta: saleData.montoVenta,
            numeroSIAF: saleData.siaf,
            etapaSIAF: saleData.etapaSiaf,
            fechaSIAF: dayjs(saleData.fechaSiaf),
            ordenCompraElectronica: saleData.documentoOce,
            ordenCompraFisica: saleData.documentoOcf,
            codigoOcf: saleData.codigoOcf,

            // Datos de contacto - proteger acceso con validación
            ...(saleData.contactoCliente && {
              cargoContactoComplete: saleData.contactoCliente,
              cargoContacto: saleData.contactoCliente.id,
              nombreContacto: saleData.contactoCliente.nombre,
              celularContacto: saleData.contactoCliente.telefono,
            }),

            // Productos - asegurar que siempre sea un array usando parseJSON y agregar isCompleted si no existe
            productos: (Array.isArray(saleData.productos) ? saleData.productos : parseJSON(saleData.productos) || []).map((producto: any) => ({
              ...producto,
              isCompleted: producto.isCompleted ?? false, // Preservar si existe, o false por defecto
            })),

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
            formValues.facturaStatus = saleData.ordenCompraPrivada.estadoPago || 'PENDIENTE';
            formValues.dateFactura = saleData.ordenCompraPrivada.fechaPago ? dayjs(saleData.ordenCompraPrivada.fechaPago) : null;
            formValues.documentoFactura = saleData.ordenCompraPrivada.documentoPago || null;
            formValues.documentoCotizacion = (saleData.ordenCompraPrivada as any).documentoCotizacion || null;
            formValues.cotizacion = (saleData.ordenCompraPrivada as any).cotizacion || null; // Campo cotización
            formValues.notaPago = saleData.ordenCompraPrivada.notaPago || '';

            // Campos de tipo de entrega
            formValues.tipoEntrega = (saleData.ordenCompraPrivada as any).tipoDestino || null;
            formValues.nombreAgencia = (saleData.ordenCompraPrivada as any).nombreAgencia || null;
            formValues.destinoFinal = (saleData.ordenCompraPrivada as any).destinoFinal || null;
            formValues.destinoEntidad = (saleData.ordenCompraPrivada as any).nombreEntidad || null;

            // Mapeo explícito de pagos desde backend a frontend
            const mappedPayments = Array.isArray(saleData.ordenCompraPrivada.pagos) && saleData.ordenCompraPrivada.pagos.length > 0
              ? saleData.ordenCompraPrivada.pagos.map((pago: any) => ({
                date: pago.fechaPago && pago.fechaPago !== '1970-01-01T00:00:00.000Z' ? dayjs(pago.fechaPago) : null,
                bank: pago.bancoPago || '',
                description: pago.descripcionPago || '',
                file: pago.archivoPago || null,
                amount: pago.montoPago ? String(pago.montoPago) : '',
                status: pago.estadoPago,
              }))
              : []; // Array vacío si no hay pagos

            // Setear estados de pagos
            setPayments(mappedPayments.length > 0 ? mappedPayments : [{
              date: null,
              bank: '',
              description: '',
              file: null,
              amount: '',
              status: true,
            }]);
            setTipoPago(saleData.ordenCompraPrivada.estadoPago || 'PENDIENTE');
            setNotaPago(saleData.ordenCompraPrivada.notaPago || '');

            // Log para depuración
            console.log('Pagos mapeados para el estado:', mappedPayments);
            console.log('Datos originales de pagos del backend:', saleData.ordenCompraPrivada.pagos);
          }
          console.log('Venta privada:', saleData.ordenCompraPrivada);
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
  }, [id, isEditing, form, navigate, setSaleInputValues, setSelectedSale]);

  useEffect(() => {
    setBlackBarKey(BlackBarKeyEnum.OC);
    return () => {
      setSaleInputValues({ enterprise: null, tipoVenta: 'directa', file: null });
      setBlackBarKey(null);
      // ✅ NUEVO: Limpiar selectedSale al salir
      setSelectedSale(null);
    };
  }, [setSaleInputValues, setBlackBarKey, setSelectedSale]);
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
        provinciaEntrega: response.provinciaEntrega,
        distritoEntrega: response.distritoEntrega,
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
        ordenCompraElectronica: response.documentoOceUrl, // Asignar la URL del documento OCE
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
          // Solo incluir catálogo para ventas directas (no privadas)
          ...(saleInputValues.tipoVenta !== 'privada' && {
            catalogoEmpresaId: values.catalogoComplete?.id || values.catalogo?.id || values.catalogo
          }),
          clienteId: values.clienteEstado?.id || values.clienteEstado,
          contactoClienteId: values.cargoContactoComplete?.id || values.cargoContacto?.id || values.cargoContacto,
          empresaId: saleInputValues.enterprise?.id,
          direccionEntrega: values.direccionEntrega || null,
          distritoEntrega: values.distritoEntrega || null,
          provinciaEntrega: values.provinciaEntrega || null,
          departamentoEntrega: values.regionEntrega || null,
          referenciaEntrega: values.referenciaEntrega || null,
          fechaEntrega: values.fechaEntrega ? values.fechaEntrega.toISOString() : null,
          fechaForm: values.fechaFormalizacion ? values.fechaFormalizacion.toISOString() : null,
          fechaMaxForm: values.fechaMaxEntrega ? values.fechaMaxEntrega.toISOString() : null,
          montoVenta: values.montoVenta ? Number(values.montoVenta) : null,
          siaf: values.numeroSIAF ? String(values.numeroSIAF) : null,
          etapaSiaf: values.etapaSIAF || null,
          fechaSiaf: values.fechaSIAF ? values.fechaSIAF.toISOString() : null,
          estadoVenta: values.estadoVenta || 'incompleto',
          documentoOce: values.ordenCompraElectronica || null,
          documentoOcf: values.ordenCompraFisica || null,
          codigoOcf: values.codigoOcf || null,
          productos: (values.productos || []).map((producto: any) => ({
            ...producto,
            isCompleted: false, // Campo interno por defecto
          })),
        };

        // Si es venta privada, incluir datos específicos
        if (saleInputValues.tipoVenta === 'privada') {
          console.log('Datos de venta privada para actualización:', {
            tipoPago: tipoPago,
            notaPago: notaPago,
            payments: payments,
            allValues: values
          }); // Debug para edición

          console.log('Datos de tipo de entrega en edición:', {
            tipoEntrega: values.tipoEntrega,
            nombreAgencia: values.nombreAgencia,
            destinoFinal: values.destinoFinal,
            destinoEntidad: values.destinoEntidad
          }); // Debug tipo de entrega en edición

          const bodyVentaPrivada = {
            ...baseVentaData,
            ventaPrivada: {
              estadoPago: tipoPago || 'PENDIENTE',
              fechaPago: values.dateFactura ? values.dateFactura.toISOString() : null,
              documentoPago: values.documentoFactura,
              documentoCotizacion: values.documentoCotizacion, // Campo de cotización
              cotizacion: values.cotizacion || null, // Campo cotización
              notaPago: notaPago || '',
              // Campos de tipo de entrega
              tipoDestino: values.tipoEntrega || null,
              nombreAgencia: values.nombreAgencia || null,
              destinoFinal: values.destinoFinal || null,
              nombreEntidad: values.destinoEntidad || null,
              pagos: payments.map(payment => ({
                fechaPago: payment.date ? payment.date.toISOString() : null,
                bancoPago: payment.bank || '',
                descripcionPago: payment.description || '',
                archivoPago: payment.file || null,
                montoPago: parseFloat(payment.amount) || 0,
                estadoPago: Boolean(payment.status),
              }))
            },
          };

          console.log('Body completo para actualización de venta privada:', bodyVentaPrivada); // Debug

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
          console.log('Form values para venta privada:', {
            tipoPago: tipoPago,
            notaPago: notaPago,
            payments: payments,
            allValues: values
          }); // Debug

          console.log('Pagos del estado antes de procesar:', payments); // Debug adicional

          const pagos = [];
          for (const payment of payments || []) {
            console.log('Procesando pago individual:', payment); // Debug de cada pago
            // Validar que el pago tenga datos válidos
            if (payment.amount && parseFloat(payment.amount) > 0) {
              console.log('Processing payment:', payment); // Debug
              pagos.push({
                fechaPago: payment.date && dayjs(payment.date).isValid()
                  ? payment.date.toISOString()
                  : null,
                bancoPago: payment.bank || '',
                descripcionPago: payment.description || '',
                archivoPago: payment.file || null,
                montoPago: parseFloat(payment.amount) || 0,
                estadoPago: Boolean(payment.status),
              });
            }
          }
          console.log('Processed pagos for creation:', pagos); // Debug
          console.log('Datos de tipo de entrega:', {
            tipoEntrega: values.tipoEntrega,
            nombreAgencia: values.nombreAgencia,
            destinoFinal: values.destinoFinal,
            destinoEntidad: values.destinoEntidad
          }); // Debug tipo de entrega

          bodyVentaPrivada = {
            estadoPago: tipoPago || 'PENDIENTE',
            fechaPago: values.dateFactura ? values.dateFactura.toISOString() : null,
            documentoPago: values.documentoFactura,
            documentoCotizacion: values.documentoCotizacion, // Campo de cotización
            cotizacion: values.cotizacion || null, // Campo cotización
            notaPago: notaPago || '',
            // Campos de tipo de entrega
            tipoDestino: values.tipoEntrega || null,
            nombreAgencia: values.nombreAgencia || null,
            destinoFinal: values.destinoFinal || null,
            nombreEntidad: values.destinoEntidad || null,
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
        // Solo validar catálogo para ventas directas (no privadas)
        if (saleInputValues.tipoVenta !== 'privada' && !values.catalogo) {
          notification.error({ message: 'Error', description: 'Debe seleccionar un catálogo' });
          return;
        }

        const bodyVentaDirecta = {
          empresa: { connect: { id: saleInputValues.enterprise?.id } },
          cliente: { connect: { id: values.clienteEstado?.id } },
          contactoCliente: { connect: { id: values.cargoContacto } },
          // Solo incluir catálogo para ventas directas (no privadas)
          ...(saleInputValues.tipoVenta !== 'privada' && values.catalogo && {
            catalogoEmpresa: { connect: { id: values.catalogo } }
          }),

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
          codigoOcf: values.codigoOcf || null,
          productos: (values.productos || []).map((producto: any) => ({
            ...producto,
            isCompleted: false, // Campo interno por defecto
          })),
        };

        console.log('Datos a enviar:', bodyVentaDirecta);
        const nuevaVenta = await createDirectSale(bodyVentaDirecta);

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

  const estadoVentaOptions = [
    { value: 'completo', label: 'Completo' },
    { value: 'procesando', label: 'En proceso' },
    { value: 'cancelado', label: 'Cancelado' },
  ];

  // Sistema de colores para estados
  const estadoBgMap: Record<string, string> = {
    completo: '#10B981',      // Verde éxito
    procesando: '#F59E0B',    // Naranja proceso
    cancelado: '#EF4444',     // Rojo error
  };

  const [currentEstadoValue, setCurrentEstadoValue] = useState<string>('procesando');

  return (
    <Box>
      <Spin spinning={loading} size="large" tip="..:: Espere mientras finaliza la operación ::..">
        <Form form={form} onFinish={handleFinish}>
          <Stack direction="column" spacing={2}>
            <InputsSecondStep
              form={form}
              isEditing={isEditing}
              currentSale={currentSale}
              isPrivateSale={saleInputValues.tipoVenta === 'privada'}
            />

            {/* Campos de Venta Privada - Movidos después de lugar de entrega */}
            <Collapse in={saleInputValues.tipoVenta === 'privada'} unmountOnExit>
              <InputsFirstStep
                form={form}
                payments={payments}
                tipoPago={tipoPago}
                notaPago={notaPago}
                onPaymentsChange={setPayments}
                onTipoPagoChange={setTipoPago}
                onNotaPagoChange={setNotaPago}
                isPrivateSale={saleInputValues.tipoVenta === 'privada'}
                isEditing={isEditing}
              />
            </Collapse>

            <InputsThirdStep
              form={form}
              companyId={saleInputValues.enterprise?.id!}
              isPrivateSale={saleInputValues.tipoVenta === 'privada'}
            />

            <InputsFourthStep
              form={form}
              isPrivateSale={saleInputValues.tipoVenta === 'privada'}
            />

            <InputsFifthStep
              isPrivateSale={saleInputValues.tipoVenta === 'privada'}
            />

            {/* Estado de venta y botón de submit por separado */}
            <Card
              style={{
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Stack direction="row" spacing={3} alignItems="center" justifyContent="space-between">
                {/* Select de Estado */}
                <Stack direction="column" spacing={1} sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ color: '#374151', fontSize: '14px' }}
                  >
                    Estado de la Venta
                  </Typography>
                  <Form.Item
                    name="estadoVenta"
                    style={{ marginBottom: 0 }}
                    initialValue="procesando"
                  >
                    <Select
                      placeholder="Seleccione el estado"
                      size="large"
                      onChange={(value) => setCurrentEstadoValue(value)}
                      style={{
                        minWidth: 220,
                        borderRadius: 12,
                        fontWeight: 600,
                        fontSize: 16,
                      }}
                      dropdownStyle={{
                        borderRadius: 12,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.10)',
                        fontSize: 16,
                      }}
                    >
                      {estadoVentaOptions.map(option => (
                        <Select.Option
                          key={option.value}
                          value={option.value}
                          style={{
                            color: estadoBgMap[option.value] || '#222',
                            fontWeight: 600,
                            padding: '8px 12px',
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <div
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: estadoBgMap[option.value] || '#ccc'
                              }}
                            />
                            {option.label}
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Stack>

                {/* Botón de Submit */}
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<Save />}
                  onClick={() => form.submit()}
                  disabled={loading}
                  sx={{
                    minWidth: 180,
                    height: 56,
                    fontWeight: 600,
                    fontSize: 16,
                    textTransform: 'none',
                    borderRadius: 3,
                    backgroundColor: '#2563eb',
                    boxShadow: '0 4px 15px 0 rgba(37, 99, 235, 0.25)',
                    '&:hover': {
                      backgroundColor: '#1d4ed8',
                      boxShadow: '0 6px 20px 0 rgba(37, 99, 235, 0.35)',
                    },
                    '&:disabled': {
                      backgroundColor: '#E0E0E0',
                      color: '#9E9E9E',
                    },
                  }}
                >
                  {loading ? 'Guardando...' : 'Guardar Venta'}
                </Button>
              </Stack>
            </Card>
          </Stack>
          <Button type="submit" className="d-none"></Button>
        </Form>
      </Spin>
    </Box>
  );
};

export default SalesPageForm;
