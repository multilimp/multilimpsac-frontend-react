import { useEffect, useState } from 'react';
import { Form, message, notification, Spin, Select, Button, Space, Card } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';

import { CotizacionProps, CotizacionEstado, TipoPago } from '@/types/cotizacion.types';
import { getCotizacionById, createCotizacion, updateCotizacion } from '@/services/quotes/quotes.request';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import QuotesFormFirstStep from './QuotesFormFirstStep';
import QuotesFormSecondStep from './QuotesFormSecondStep';
import QuotesFormThirdStep from './QuotesFormThirdStep';
import dayjs from 'dayjs';
import { toPickerDate } from '@/utils/functions';

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

          // Helper to safely get nested ID or ID directly
          const getEmpresaId = (empresa: any) => {
            if (typeof empresa === 'object' && empresa !== null && 'id' in empresa) {
              return empresa.id;
            }
            return quoteData.empresaId;
          };

          const formValues: Record<string, unknown> = {
            codigoCotizacion: quoteData.codigoCotizacion,
            empresa: getEmpresaId(quoteData.empresa),
            cliente: quoteData.cliente,
            contactoCliente: quoteData.contactoClienteId,
            contactoClienteComplete: quoteData.contactoCliente,
            nombreContacto: quoteData.contactoCliente?.nombre ?? '',
            cargoContacto: quoteData.contactoCliente?.cargo ?? '',
            celularContacto: quoteData.contactoCliente?.telefono ?? '',
            tipoPago: quoteData.tipoPago,
            notaPago: quoteData.notaPago ?? '',
            notaPedido: quoteData.notaPedido ?? '',
            // AntD DatePicker espera un objeto dayjs; además, si llega en UTC (Z) hay que mantener UTC para no desfazar 1 día.
            fechaCotizacion: toPickerDate(quoteData.fechaCotizacion),
            fechaEntrega: toPickerDate(quoteData.fechaEntrega),
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
        fechaEntrega: dayjs.isDayjs(values.fechaEntrega)
          ? (values.fechaEntrega as dayjs.Dayjs).format('YYYY-MM-DD')
          : undefined,
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
      }

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
    <div>
      <Spin spinning={loading} size="large" tip="..:: Espere mientras finaliza la operación ::..">
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <QuotesFormFirstStep form={form} isEditing={isEditing} quoteId={id} />
            <QuotesFormSecondStep form={form} />
            <QuotesFormThirdStep form={form} />

            {/* Campos adicionales y botón de submit */}
            <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <Form.Item
                    name="estado"
                    label="Estado"
                    rules={[{ required: isEditing, message: 'Seleccione el estado' }]}
                    style={{ minWidth: 200, marginBottom: 0 }}
                  >
                    <Select placeholder="Seleccione estado">
                      {estadoOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                  <Button
                    onClick={
                      async () => {
                        await obtainQuotes();
                        form.resetFields();
                        navigate('/quotes');
                      }
                    }
                    disabled={loading}
                  >
                    Regresar
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={loading}
                    style={{
                      backgroundColor: '#1890ff',
                      borderColor: '#1890ff'
                    }}
                  >
                    {isEditing ? 'Actualizar Cotización' : 'Crear Cotización'}
                  </Button>
                </div>
              </div>
            </Card>
          </Space>
        </Form>
      </Spin>
    </div>
  );
};

export default QuotesPageForm;
