import { useEffect, useState } from 'react';
import { Box, Button, Stack } from '@mui/material';
import { Form, message, notification, Spin, Input, Select } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';

import { CotizacionProps, CotizacionEstado, TipoPago } from '@/types/cotizacion.types';
import { getCotizacionById, createCotizacion, updateCotizacion } from '@/services/quotes/quotes.request';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import QuotesFormFirstStep from './QuotesFormFirstStep';
import QuotesFormSecondStep from './QuotesFormSecondStep';
import QuotesFormThirdStep from './QuotesFormThirdStep';
import dayjs from 'dayjs';

type ProductoRecord = {
  codigo: string;
  descripcion: string;
  unidadMedida: string;
  cantidad: string;
  cantidadAlmacen: string;
  precioUnitario: string;
  total: string;
};

const QuotesPageForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { obtainQuotes } = useGlobalInformation();
  const isEditing = Boolean(id);
  const [_currentQuote, setCurrentQuote] = useState<CotizacionProps | null>(null);

  useEffect(() => {
    const loadQuoteData = async () => {
      if (isEditing && id) {
        try {
          setLoading(true);
          const quoteData = await getCotizacionById(Number(id));
          setCurrentQuote(quoteData);

          const formValues: Record<string, unknown> = {
            empresa: (quoteData.empresa as { id: number })?.id || quoteData.empresaId,
            cliente: quoteData.cliente,
            contactoCliente: quoteData.contactoClienteId,
            contactoClienteComplete: quoteData.contactoCliente,
            nombreContacto: quoteData.contactoCliente?.nombre ?? '',
            cargoContacto: quoteData.contactoCliente?.cargo ?? '',
            celularContacto: quoteData.contactoCliente?.telefono ?? '',
            tipoPago: quoteData.tipoPago,
            notaPago: quoteData.notaPago ?? '',
            notaPedido: quoteData.notaPedido ?? '',
            fechaCotizacion: dayjs(quoteData.fechaCotizacion),
            fechaEntrega: quoteData.fechaEntrega ? dayjs(quoteData.fechaEntrega) : null,
            direccionEntrega: quoteData.direccionEntrega ?? '',
            distritoEntrega: quoteData.distritoEntrega ?? '',
            provinciaEntrega: quoteData.provinciaEntrega ?? '',
            departamentoEntrega: quoteData.departamentoEntrega ?? '',
            referenciaEntrega: quoteData.referenciaEntrega ?? '',
            productos: quoteData.productos || [],
            estado: quoteData.estado,
          };

          form.setFieldsValue(formValues);
        } catch (error) {
          console.error('Error al cargar los datos de la cotización:', error);
          message.error('Error al cargar los datos de la cotización');
          navigate('/quotes');
        } finally {
          setLoading(false);
        }
      }
    };

    loadQuoteData();
  }, [id, isEditing, form, navigate]);



  const handleFinish = async (values: Record<string, unknown>) => {
    try {
      setLoading(true);

      console.log('Valores del formulario:', values);
      console.log('Productos:', values.productos);
      console.log('Empresa:', values.empresa);
      console.log('Cliente:', values.cliente);
      console.log('Tipo de Pago:', values.tipoPago);
      console.log('Fecha Cotización:', values.fechaCotizacion);

      const baseQuoteData = {
        empresaId: Number(values.empresa),
        clienteId: (values.cliente as { id: number })?.id,
        contactoClienteId: values.contactoCliente ? Number(values.contactoCliente) : undefined,
        montoTotal: (() => {
          const productos = values.productos as ProductoRecord[] || [];
          const total = productos.reduce((sum: number, prod: ProductoRecord) =>
            sum + (Number(prod?.total) || 0), 0
          );
          return String(total);
        })(),
        tipoPago: String(values.tipoPago) as TipoPago,
        notaPago: values.notaPago ? String(values.notaPago) : undefined,
        notaPedido: values.notaPedido ? String(values.notaPedido) : undefined,
        direccionEntrega: values.direccionEntrega ? String(values.direccionEntrega) : undefined,
        distritoEntrega: values.distritoEntrega ? String(values.distritoEntrega) : undefined,
        provinciaEntrega: values.provinciaEntrega ? String(values.provinciaEntrega) : undefined,
        departamentoEntrega: values.departamentoEntrega ? String(values.departamentoEntrega) : undefined,
        referenciaEntrega: values.referenciaEntrega ? String(values.referenciaEntrega) : undefined,
        fechaCotizacion: dayjs.isDayjs(values.fechaCotizacion)
          ? (values.fechaCotizacion as dayjs.Dayjs).format('YYYY-MM-DD')
          : undefined,
        fechaEntrega: (values.fechaEntrega as { toISOString: () => string })?.toISOString() || undefined,
        productos: (() => {
          const productos = values.productos as ProductoRecord[] || [];
          return productos.map(prod => ({
            codigo: prod.codigo,
            descripcion: prod.descripcion,
            unidadMedida: prod.unidadMedida,
            cantidad: Number(prod.cantidad),
            cantidadAlmacen: prod.cantidadAlmacen ? Number(prod.cantidadAlmacen) : undefined,
            cantidadTotal: Number(prod.cantidad), // cantidadTotal = cantidad
            precioUnitario: String(prod.precioUnitario),
            total: String(prod.total)
          }));
        })(),
      };

      console.log('Datos a enviar:', baseQuoteData);

      // Validaciones adicionales
      if (!baseQuoteData.empresaId || isNaN(baseQuoteData.empresaId)) {
        throw new Error('Debe seleccionar una empresa válida');
      }
      if (!baseQuoteData.clienteId) {
        throw new Error('Cliente es requerido');
      }
      if (!baseQuoteData.tipoPago) {
        throw new Error('Tipo de pago es requerido');
      }
      if (!baseQuoteData.productos || baseQuoteData.productos.length === 0) {
        throw new Error('Debe agregar al menos un producto');
      }
      if (!baseQuoteData.fechaCotizacion) {
        throw new Error('Fecha de cotización es requerida');
      }

      if (isEditing && id) {
        await updateCotizacion(Number(id), {
          ...baseQuoteData,
          estado: String(values.estado) as CotizacionEstado,
        });
        notification.success({ message: 'La cotización fue actualizada correctamente' });
        // Recargar las cotizaciones en el contexto global
        await obtainQuotes();
      } else {
        await createCotizacion({
          ...baseQuoteData,
          fechaCotizacion: baseQuoteData.fechaCotizacion || dayjs().format('YYYY-MM-DD'),
        });
        notification.success({ message: 'La cotización fue creada correctamente' });
        form.resetFields();
        // Recargar las cotizaciones en el contexto global
        await obtainQuotes();
      }

      navigate('/quotes');
    } catch (error: unknown) {
      console.error('Error al guardar cotización:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        'Error desconocido';
      notification.error({
        message: 'Error al guardar la cotización',
        description: errorMessage,
        duration: 5
      });
    } finally {
      setLoading(false);
    }
  };

  const estadoOptions = [
    { value: 'COTIZADO', label: 'Cotizado' },
    { value: 'PENDIENTE', label: 'Pendiente' },
    { value: 'APROBADO', label: 'Aprobado' },
  ];

  useEffect(() => {
    if (!isEditing) {
      form.setFieldsValue({
        estado: 'COTIZADO'
      });
    }
  }, [isEditing, form]);

  return (
    <Box>
      <Spin spinning={loading} size="large" tip="..:: Espere mientras finaliza la operación ::..">
        <Form form={form} onFinish={handleFinish}>
          <Stack direction="column" spacing={2}>
            <QuotesFormFirstStep form={form} isEditing={isEditing} quoteId={id} />
            <QuotesFormSecondStep form={form} />
            <QuotesFormThirdStep form={form} />

            {/* Campos adicionales y botón de submit */}
            <Stack direction="column" spacing={2} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                <Form.Item
                  name="estado"
                  label="Estado"
                  rules={[{ required: isEditing, message: 'Seleccione el estado' }]}
                  style={{ minWidth: 200 }}
                >
                  <Select placeholder="Seleccione estado">
                    {estadoOptions.map(option => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Stack>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate('/quotes')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  {isEditing ? 'Actualizar Cotización' : 'Crear Cotización'}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Form>
      </Spin>
    </Box>
  );
};

export default QuotesPageForm;
