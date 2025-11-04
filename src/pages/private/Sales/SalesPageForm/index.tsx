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
import type { Dayjs } from 'dayjs';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { BlackBarKeyEnum } from '@/types/global.enum';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { SaleProps } from '@/services/sales/sales';
import { parseJSON } from '@/utils/functions';
import { Save } from '@mui/icons-material';
import { estadoOptions, estadoBgMap } from '@/utils/constants';
import { Producto } from '@/types/almacen.types';

const SalesPageForm = () => {
  const { companies, clients, saleInputValues, setSaleInputValues, setBlackBarKey, obtainSales, setSelectedSale } = useGlobalInformation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = Boolean(id);
  const [currentSale, setCurrentSale] = useState<SaleProps | null>(null);

  type PaymentItem = {
    date: Dayjs | null;
    bank: string;
    description: string;
    file: string | null;
    amount: string;
    status: boolean;
  };

  const [payments, setPayments] = useState<PaymentItem[]>([
    {
      date: null,
      bank: '',
      description: '',
      file: null,
      amount: '',
      status: true,
    },
  ]);
  const [tipoPago, setTipoPago] = useState<string>('PENDIENTE');
  const [notaPago, setNotaPago] = useState<string>('');

  const searchParams = new URLSearchParams(location.search);
  const fromParam = searchParams.get('from');
  const isBillingMode = fromParam === 'billing';
  const isSalesMode = !fromParam || fromParam === 'sales';

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
            fechaFormalizacion: saleData.fechaForm ? dayjs(saleData.fechaForm) : null,
            fechaMaxEntrega: saleData.fechaMaxForm ? dayjs(saleData.fechaMaxForm) : null,
            montoVenta: saleData.montoVenta,
            numeroSIAF: saleData.siaf,
            etapaSIAF: saleData.etapaSiaf,
            fechaSIAF: saleData.fechaSiaf ? dayjs(saleData.fechaSiaf) : null,
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
            estadoVenta: saleData.estadoVenta || 'PENDIENTE',
            multipleFuentesFinanciamiento: saleData.multipleFuentesFinanciamiento || false,
          };

          // Si es venta privada, cargar datos específicos
          if (isPrivateSale && saleData.ordenCompraPrivada) {
            formValues.facturaStatus = (saleData.ordenCompraPrivada as any).estadoFactura || 'PENDIENTE';
            formValues.fechaFactura = saleData.ordenCompraPrivada.fechaFactura ? dayjs(saleData.ordenCompraPrivada.fechaFactura) : null;
            formValues.documentoFactura = saleData.ordenCompraPrivada.documentoPago || null;
            formValues.documentoCotizacion = (saleData.ordenCompraPrivada as any).documentoCotizacion || null;
            formValues.cotizacion = (saleData.ordenCompraPrivada as any).cotizacion || null; // Campo cotización
            formValues.notaPago = saleData.ordenCompraPrivada.notaPago || '';

            // Campos de tipo de entrega
            formValues.tipoEntrega = (saleData.ordenCompraPrivada as any).tipoDestino || null;
            formValues.nombreAgencia = (saleData.ordenCompraPrivada as any).nombreAgencia || null;
            formValues.destinoFinal = (saleData.ordenCompraPrivada as any).destinoFinal || null;
            formValues.destinoEntidad = (saleData.ordenCompraPrivada as any).nombreEntidad || null;
            formValues.multipleFuentesFinanciamiento = (saleData.ordenCompraPrivada as any).multipleFuentesFinanciamiento || false;

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
          ...(saleInputValues.tipoVenta !== 'privada' && (values.catalogoComplete?.id || values.catalogo?.id || values.catalogo) && {
            catalogoEmpresa: { connect: { id: values.catalogoComplete?.id || values.catalogo?.id || values.catalogo } }
          }),
          ...(values.clienteEstado?.id || values.clienteEstado) && {
            cliente: { connect: { id: values.clienteEstado?.id || values.clienteEstado } }
          },
          ...(values.cargoContactoComplete?.id || values.cargoContacto?.id || values.cargoContacto) && {
            contactoCliente: { connect: { id: values.cargoContactoComplete?.id || values.cargoContacto?.id || values.cargoContacto } }
          },
          ...(saleInputValues.enterprise?.id) && {
            empresa: { connect: { id: saleInputValues.enterprise.id } }
          },
          direccionEntrega: values.direccionEntrega || null,
          distritoEntrega: values.distritoEntrega || null,
          provinciaEntrega: values.provinciaEntrega || null,
          departamentoEntrega: values.regionEntrega || null,
          referenciaEntrega: values.referenciaEntrega || null,
          fechaEntrega: dayjs(values.fechaEntrega).isValid() ? dayjs(values.fechaEntrega).toISOString() : undefined,
          fechaForm: dayjs(values.fechaFormalizacion).isValid() ? dayjs(values.fechaFormalizacion).toISOString() : undefined,
          fechaMaxForm: dayjs(values.fechaMaxEntrega).isValid() ? dayjs(values.fechaMaxEntrega).toISOString() : undefined,
          montoVenta: values.montoVenta ? Number(values.montoVenta) : null,
          siaf: values.numeroSIAF ? String(values.numeroSIAF) : null,
          etapaSiaf: values.etapaSIAF || null,
          fechaSiaf: dayjs(values.fechaSIAF).isValid() ? dayjs(values.fechaSIAF).toISOString() : undefined,
          estadoVenta: values.estadoVenta || 'PENDIENTE',
          multipleFuentesFinanciamiento: values.multipleFuentesFinanciamiento || false,
          documentoOce: values.ordenCompraElectronica || null,
          documentoOcf: values.ordenCompraFisica || null,
          codigoOcf: values.codigoOcf || null,
          productos: (values.productos || []).map((producto: Producto) => ({
            ...producto,
            isCompleted: false, // Campo interno por defecto
          }))
        };

        // Si es venta privada, incluir datos específicos
        if (saleInputValues.tipoVenta === 'privada') {

          const bodyVentaPrivada = {
            ...baseVentaData,
            multipleFuentesFinanciamiento: values.multipleFuentesFinanciamiento || false,
            ventaPrivada: {
              estadoPago: tipoPago || 'PENDIENTE',
              estadoFactura: values.facturaStatus || 'PENDIENTE',
              fechaFactura: values.fechaFactura && dayjs(values.fechaFactura).isValid() ? dayjs(values.fechaFactura).toISOString() : undefined,
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
                fechaPago: payment.date && dayjs(payment.date).isValid()
                  ? dayjs(payment.date).toISOString()
                  : undefined,
                bancoPago: payment.bank || '',
                descripcionPago: payment.description || '',
                archivoPago: payment.file || null,
                montoPago: parseFloat(payment.amount) || 0,
                estadoPago: Boolean(payment.status),
              }))
            },
          };
          await updateSale(Number(id), bodyVentaPrivada);
        } else {
          await updateSale(Number(id), baseVentaData);
        }

        notification.success({ message: `La venta fue actualizada correctamente` });
      } else {
        // Modo creación (código existente)
        let bodyVentaPrivada = null;
        if (saleInputValues.tipoVenta === 'privada') {

          const pagos = [];
          for (const payment of payments || []) {
            if (payment.amount && parseFloat(payment.amount) > 0) {
              pagos.push({
                fechaPago: payment.date && dayjs(payment.date).isValid()
                  ? payment.date.toISOString()
                  : undefined,
                bancoPago: payment.bank || '',
                descripcionPago: payment.description || '',
                archivoPago: payment.file || null,
                montoPago: parseFloat(payment.amount) || 0,
                estadoPago: Boolean(payment.status),
              });
            }
          }

          bodyVentaPrivada = {
            estadoPago: tipoPago || 'PENDIENTE',
            estadoFactura: values.facturaStatus || 'PENDIENTE',
            fechaFactura: dayjs(values.fechaFactura).isValid() ? dayjs(values.fechaFactura).toISOString() : undefined,
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
          multipleFuentesFinanciamiento: values.multipleFuentesFinanciamiento || false,
          departamentoEntrega: values.regionEntrega || null,
          provinciaEntrega: values.provinciaEntrega || null,
          distritoEntrega: values.distritoEntrega || null,
          direccionEntrega: values.direccionEntrega || null,
          referenciaEntrega: values.referenciaEntrega || null,
          fechaForm: dayjs(values.fechaFormalizacion).isValid() ? dayjs(values.fechaFormalizacion).toISOString() : undefined,
          fechaMaxForm: dayjs(values.fechaMaxEntrega).isValid() ? dayjs(values.fechaMaxEntrega).toISOString() : undefined,
          montoVenta: values.montoVenta ? Number(values.montoVenta) : null,
          siaf: values.numeroSIAF ? String(values.numeroSIAF) : null,
          etapaSiaf: values.etapaSIAF || null,
          fechaSiaf: dayjs(values.fechaSIAF).isValid() ? dayjs(values.fechaSIAF).toISOString() : undefined,
          estadoVenta: values.estadoVenta || 'PENDIENTE',
          documentoOce: values.ordenCompraElectronica || null,
          documentoOcf: values.ordenCompraFisica || null,
          codigoOcf: values.codigoOcf || null,
          productos: (values.productos || []).map((producto: any) => ({
            ...producto,
            isCompleted: false,
          })),
        };

        const nuevaVenta = await createDirectSale(bodyVentaDirecta);

        notification.success({ message: `La venta fue registrada correctamente` });
        navigate(`/sales/${nuevaVenta.id}/edit`);
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

  // Estados para el formulario

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
              disabledAll={isBillingMode}
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
                disableInvoiceFields={isSalesMode}
                fromBilling={isBillingMode}
              />
            </Collapse>

            <InputsThirdStep
              form={form}
              companyId={saleInputValues.enterprise ? saleInputValues.enterprise.id : undefined}
              isPrivateSale={saleInputValues.tipoVenta === 'privada'}
              disabledAll={isBillingMode}
            />

            <InputsFourthStep
              form={form}
              isPrivateSale={saleInputValues.tipoVenta === 'privada'}
              disabledAll={isBillingMode}
            />

            <InputsFifthStep
              isPrivateSale={saleInputValues.tipoVenta === 'privada'}
              disabledAll={isBillingMode}
            />

            {/* Estado de venta y botón de submit por separado */}
            <Card
              style={{
                borderRadius: 12,
                backgroundColor: 'inherit',
                border: 'none',
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
                    initialValue="PENDIENTE"
                  >
                    <Select
                      placeholder="Seleccione el estado"
                      size="large"
                      style={{
                        maxWidth: 220,
                        borderRadius: 12,
                        fontWeight: 600,
                        fontSize: 16,
                      }}
                      dropdownStyle={{
                        borderRadius: 12,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.10)',
                        fontSize: 16,
                      }}
                      disabled={isBillingMode}
                    >
                      {estadoOptions.map(option => (
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
                  disabled={loading || isBillingMode}
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