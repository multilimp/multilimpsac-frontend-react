import { Form, InputNumber, FormInstance, Button, Space, Typography as AntTypography, Divider as AntDivider, Row, Col } from 'antd';
import { Add, DeleteOutlineOutlined, LocalShipping, Search } from '@mui/icons-material';
import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  FormHelperText,
  Grid,
  IconButton,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import InputAntd from '@/components/InputAntd';
import SelectGeneric from '@/components/selects/SelectGeneric';
import SelectTransports from '@/components/selects/SelectTransports';
import SelectContactsByTransport from '@/components/selects/SelectContactsByTransport';
import SimpleFileUpload from '@/components/SimpleFileUpload';
import PaymentsList from '@/components/PaymentsList';
import { usePayments } from '@/hooks/usePayments';
import { notification } from 'antd';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';

// Opciones para el tipo de entrega (similar a ventas privadas)
const tipoEntregaOptions = [
  { label: 'Recojo en almacén', value: 'RECOJO_ALMACEN' },
  { label: 'Entrega a domicilio', value: 'ENTREGA_DOMICILIO' },
  { label: 'Entrega en agencia', value: 'ENTREGA_AGENCIA' }
];

interface TransportsSectionProps {
  form: FormInstance;
  isTreasury?: boolean;
  isPrivateSale?: boolean; // Nueva prop para determinar si es venta privada
  privateSaleData?: {
    tipoEntrega?: string;
    nombreAgencia?: string;
    destinoFinal?: string;
    nombreEntidad?: string;
  };
}

const getEmptyTransformRecord = () => ({
  transporte: null,
  contacto: null,
  codigoTransporte: null, // Campo para mostrar código generado por el backend
  destino: null,
  region: '',
  provincia: '',
  distrito: '',
  direccion: '',
  nota: '',
  flete: '',
  cotizacion: null,
});

export { getEmptyTransformRecord };

const requiredField = { required: true, message: 'Requerido' };

interface TransportPaymentsProps {
  transporteId: number;
  montoFlete: number;
  form: FormInstance;
  fieldName: number;
}

const TransportPayments = ({ transporteId, montoFlete, form, fieldName }: TransportPaymentsProps) => {
  const { handlePaymentsUpdate } = usePayments({
    entityType: 'transporteAsignado',
    entityId: transporteId,
    onSuccess: () => {
      notification.success({
        message: 'Pagos de transporte actualizados',
        description: 'Los pagos se han actualizado correctamente'
      });
    }
  });

  const handlePaymentsChange = async (payments: any[]) => {
    const formattedPayments = payments.map(payment => ({
      fechaPago: payment.date ? payment.date.toDate() : null,
      bancoPago: payment.bank,
      descripcionPago: payment.description,
      archivoPago: typeof payment.file === 'string' ? payment.file : null,
      montoPago: payment.amount ? Number(payment.amount) : 0,
      estadoPago: payment.status
    }));

    const tipoPago = form.getFieldValue(['transportes', fieldName, 'estadoPago']);
    const notaPago = form.getFieldValue(['transportes', fieldName, 'notaPago']);

    await handlePaymentsUpdate(formattedPayments, tipoPago, notaPago);

    // Actualizar el formulario local
    form.setFieldValue(['transportes', fieldName, 'pagosTransporte'], payments);
  };

  const handleTipoPagoChange = (tipoPago: string) => {
    form.setFieldValue(['transportes', fieldName, 'estadoPago'], tipoPago);
  };

  const handleNotaPagoChange = (notaPago: string) => {
    form.setFieldValue(['transportes', fieldName, 'notaPago'], notaPago);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => {
          const pagosTransporte = getFieldValue(['transportes', fieldName, 'pagosTransporte']) || [];
          const estadoPago = getFieldValue(['transportes', fieldName, 'estadoPago']) || '';
          const notaPago = getFieldValue(['transportes', fieldName, 'notaPago']) || '';

          return (
            <PaymentsList
              title="Pagos Transporte"
              payments={pagosTransporte}
              tipoPago={estadoPago}
              notaPago={notaPago}
              montoTotal={montoFlete}
              mode="edit"
              onPaymentsChange={handlePaymentsChange}
              onTipoPagoChange={handleTipoPagoChange}
              onNotaPagoChange={handleNotaPagoChange}
            />
          );
        }}
      </Form.Item>
    </Box>
  );
};

const TransportsSection = ({ form, isTreasury, isPrivateSale = false, privateSaleData }: TransportsSectionProps) => {
  const { transports } = useGlobalInformation();

  // 🔍 DEBUG: Agregar console.log para diagnosticar
  console.log('TransportsSection - Props recibidas:', {
    isPrivateSale,
    privateSaleData
  });

  return (
    <Form.List
      name="transportes"
      initialValue={[getEmptyTransformRecord()]}
      rules={[
        {
          validator(_, arr) {
            if (!arr.length) {
              return Promise.reject(new Error('Debe ingresar por lo menos 1 transporte para continuar.'));
            }
            return Promise.resolve();
          },
        },
      ]}
    >
      {(fields, { add, remove }, { errors }) => (
        <div>
          {/* Header similar a StepItemContent */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            bgcolor="#887bad"
            color="#ffffff"
            px={2}
            height={24}
          >
          </Stack>

          {/* Sección de resumen similar a StepItemContent */}
          <Stack
            bgcolor="#2f3a4b"
            color="#ffffff"
            p={2}
            mb={3}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
              <Stack alignItems="center" justifyContent="center">
                <LocalShipping sx={{ fontSize: 56, color: '#887bad' }} />
              </Stack>

              <Box>
                <Divider orientation="vertical" sx={{ borderColor: '#887bad' }} />
              </Box>

              <Stack height="100%" sx={{ justifyContent: 'center', my: 'auto' }}>
                <Typography variant="h5">TRANSPORTE</Typography>
                {errors.length ? <FormHelperText error>{(errors as Array<string>).join(' - ')}</FormHelperText> : null}
              </Stack>

              {/* ✅ CAMPOS DE VENTA PRIVADA AL COSTADO DEL TÍTULO */}
              {isPrivateSale && (
                <>
                  <Box>
                    <Divider orientation="vertical" sx={{ borderColor: '#887bad' }} />
                  </Box>

                  <Stack sx={{ justifyContent: 'center', minWidth: 400 }}>
                    {/* Diseño lineal sin título - solo mostrar campos con valores */}
                    <Stack spacing={1}>
                      {/* Tipo de entrega - solo mostrar si tiene valor */}
                      {privateSaleData?.tipoEntrega && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#a8a4a4ff', minWidth: 80 }}>
                            Tipo:
                          </Typography>
                          <Typography variant="body2" sx={{
                            bgcolor: '#f5f5f5',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            color: '#666',
                            fontSize: '0.875rem'
                          }}>
                            {tipoEntregaOptions.find(opt => opt.value === privateSaleData.tipoEntrega)?.label ||
                              (privateSaleData.tipoEntrega === 'RECOJO_ALMACEN' ? 'Recojo en almacén' :
                                privateSaleData.tipoEntrega === 'ENTREGA_DOMICILIO' ? 'Entrega a domicilio' :
                                  privateSaleData.tipoEntrega === 'ENTREGA_AGENCIA' ? 'Entrega en agencia' :
                                    privateSaleData.tipoEntrega)}
                          </Typography>
                        </Stack>
                      )}

                      {/* Agencia - solo mostrar si tiene valor */}
                      {privateSaleData?.nombreAgencia && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', minWidth: 80 }}>
                            Agencia:
                          </Typography>
                          <Typography variant="body2" sx={{
                            bgcolor: '#f5f5f5',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            color: '#666',
                            fontSize: '0.875rem'
                          }}>
                            {privateSaleData.nombreAgencia}
                          </Typography>
                        </Stack>
                      )}

                      {/* Destino final - solo mostrar si tiene valor */}
                      {privateSaleData?.destinoFinal && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', minWidth: 80 }}>
                            Destino:
                          </Typography>
                          <Typography variant="body2" sx={{
                            bgcolor: '#f5f5f5',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            color: '#666',
                            fontSize: '0.875rem'
                          }}>
                            {privateSaleData.destinoFinal}
                          </Typography>
                        </Stack>
                      )}

                      {/* Entidad - solo mostrar si tiene valor */}
                      {privateSaleData?.nombreEntidad && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', minWidth: 80 }}>
                            Entidad:
                          </Typography>
                          <Typography variant="body2" sx={{
                            bgcolor: '#f5f5f5',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            color: '#666',
                            fontSize: '0.875rem'
                          }}>
                            {privateSaleData.nombreEntidad}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Stack>
                </>
              )}
            </Stack>

            {isTreasury !== true && (

              <IconButton
                sx={{
                  border: 'none',
                  bgcolor: '#887bad',
                  borderRadius: 1,
                  color: 'white',
                  zIndex: 900
                }}
                onClick={() => add(getEmptyTransformRecord())}
              >
                <Add sx={{ fontWeight: 700 }} />
                <Typography variant="body2" sx={{ ml: 1, fontWeight: 700 }}>AGREGAR</Typography>
              </IconButton>
            )}
          </Stack>

          {/* Contenido principal */}
          <Box>
            <Stack direction="column" spacing={3}>
              {fields.map((field) => (
                <Card
                  key={field.name}
                  sx={{
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    bgcolor: '#f8f9fa'
                  }}
                >
                  {/* Header del Transporte con información principal */}
                  <CardHeader
                    sx={{
                      py: 2,
                      px: 3,
                      bgcolor: '#887bad'
                    }}
                    title={
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                        <Form.Item noStyle shouldUpdate>
                          {({ getFieldValue }) => {
                            // const transporteData = getFieldValue(['transportes', field.name, 'transporte']);
                            // Buscar si existe código de transporte generado por el backend
                            const codigoTransporte = getFieldValue(['transportes', field.name, 'codigoTransporte']);

                            let displayName;
                            if (codigoTransporte) {
                              // Si ya tiene código generado, mostrar el código
                              displayName = codigoTransporte;
                            } else {
                              // Si no tiene código, mostrar nombre genérico
                              displayName = `TRANSPORTE #${field.name + 1}`;
                            }

                            return (
                              <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', flexGrow: 1 }}>
                                {displayName}
                              </Typography>
                            );
                          }}
                        </Form.Item>
                      </Stack>
                    }
                    action={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {/* Select de destino al lado izquierdo del botón eliminar */}
                        <Typography variant="subtitle1" fontWeight={600} color="white">
                          Destino:
                        </Typography>
                        <Form.Item
                          name={[field.name, 'destino']}
                          style={{ margin: 0, minWidth: 130 }}
                          initialValue="CLIENTE"
                        >
                          <SelectGeneric
                            label=""
                            placeholder="Destino"
                            size="small"
                            style={{ color: "black" }}
                            options={[
                              { value: 'CLIENTE', label: 'Cliente' },
                              { value: 'ALMACEN', label: 'Almacén' },
                              { value: 'AGENCIA', label: 'Agencia' }
                            ]}
                          />
                        </Form.Item>

                        {/* Botón eliminar */}
                        <IconButton
                          color="error"
                          onClick={() => remove(field.name)}
                          sx={{
                            border: '1px solid #fff',
                            borderRadius: 1,
                            minWidth: '40px',
                            minHeight: '32px',
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,0.1)',
                              transform: 'scale(1.05)',
                              transition: 'all 0.2s ease'
                            }
                          }}
                        >
                          <DeleteOutlineOutlined sx={{ color: '#fff', fontSize: 18 }} />
                        </IconButton>
                      </Stack>
                    }
                  />

                  <CardContent sx={{ p: 3, bgcolor: 'white' }}>
                    {/* Sección de selects - Primera fila */}
                    {isTreasury !== true && (
                      <Grid container spacing={2}>
                        {/* Empresa de Transporte */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Form.Item name={[field.name, 'transporte']} rules={[requiredField]}>
                            <SelectTransports
                              label="Empresa de Transporte"
                              onChange={(value, record: any) => {
                                // Guardar tanto el ID como el objeto completo para sincronización
                                form.setFieldsValue({
                                  [`transportes[${field.name}].transporte`]: value,
                                  [`transportes[${field.name}].transporteCompleto`]: record?.optiondata,
                                });

                                // Limpiar el contacto cuando cambie el transporte
                                form.setFieldsValue({
                                  [`transportes[${field.name}].contacto`]: null,
                                  [`transportes[${field.name}].contactoCompleto`]: null,
                                });
                              }}
                            />
                          </Form.Item>
                        </Grid>

                        {/* Contacto de Transporte */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) => {
                              const transporteId = getFieldValue(['transportes', field.name, 'transporte']);
                              const transporteData = typeof transporteId === 'object' ? transporteId?.id : transporteId;

                              return (
                                <Form.Item
                                  name={[field.name, 'contacto']}
                                  rules={[]}
                                >
                                  <SelectContactsByTransport
                                    transportId={transporteData}
                                    onChange={(value, record: any) => {
                                      // Establecer tanto el ID como el objeto completo para sincronización
                                      form.setFieldsValue({
                                        [`transportes[${field.name}].contacto`]: value,
                                        [`transportes[${field.name}].contactoCompleto`]: record?.optiondata,
                                        [`transportes[${field.name}].nombreContactoTransporte`]: record?.optiondata?.nombre,
                                        [`transportes[${field.name}].telefonoContactoTransporte`]: record?.optiondata?.telefono,
                                      });
                                    }}
                                    onContactCreated={() => {
                                      // Recargar contactos si es necesario
                                    }}
                                  />
                                </Form.Item>
                              );
                            }}
                          </Form.Item>
                        </Grid>
                      </Grid>
                    )}

                    {/* Sección de información principal - 3 columnas */}
                    <Grid container spacing={3} sx={{ mb: 3, mx: 1 }}>
                      <Grid size={4}>
                        <Form.Item noStyle shouldUpdate>
                          {({ getFieldValue }) => {
                            const transporteId = getFieldValue(['transportes', field.name, 'transporte']);
                            const transporteCompleto = getFieldValue(['transportes', field.name, 'transporteCompleto']);

                            // Usar el objeto completo si está disponible, sino buscar en la lista global
                            const transporteData = transporteCompleto ||
                              (typeof transporteId === 'number'
                                ? transports.find(t => t.id === transporteId)
                                : (typeof transporteId === 'object' ? transporteId : null));

                            return (
                              <Stack spacing={1}>
                                <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                                  Empresa de Transporte
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                  {transporteData?.razonSocial || '---'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  RUC: {transporteData?.ruc || '---'}
                                </Typography>
                              </Stack>
                            );
                          }}
                        </Form.Item>
                      </Grid>

                      <Grid size={4}>
                        <Form.Item noStyle shouldUpdate>
                          {({ getFieldValue }) => {
                            const transporteId = getFieldValue(['transportes', field.name, 'transporte']);
                            const transporteCompleto = getFieldValue(['transportes', field.name, 'transporteCompleto']);

                            // Usar el objeto completo si está disponible, sino buscar en la lista global
                            const transporteData = transporteCompleto ||
                              (typeof transporteId === 'number'
                                ? transports.find(t => t.id === transporteId)
                                : (typeof transporteId === 'object' ? transporteId : null));

                            return (
                              <Stack spacing={1}>
                                <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                                  Dirección y Ubicación
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                  {transporteData?.direccion || '---'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {[transporteData?.departamento, transporteData?.provincia, transporteData?.distrito].filter(Boolean).join(' / ') || 'Sin ubicación especificada'}
                                </Typography>
                              </Stack>
                            );
                          }}
                        </Form.Item>
                      </Grid>

                      <Grid size={4}>
                        <Form.Item noStyle shouldUpdate>
                          {({ getFieldValue }) => {
                            const contactoId = getFieldValue(['transportes', field.name, 'contacto']);
                            const contactoCompleto = getFieldValue(['transportes', field.name, 'contactoCompleto']);

                            // Usar el objeto completo si está disponible, sino el objeto almacenado directamente
                            const contactoData = contactoCompleto || (typeof contactoId === 'object' ? contactoId : null);

                            return (
                              <Stack spacing={1}>
                                <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                                  Conductor
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                  {contactoData?.nombre || '---'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {contactoData?.telefono || '---'}
                                </Typography>
                              </Stack>
                            );
                          }}
                        </Form.Item>
                      </Grid>
                    </Grid>

                    {/* Sección de formulario - campos editables */}
                    <Grid container spacing={2}>
                      {/* Nota de transporte */}
                      <Grid size={12}>
                        <Form.Item
                          name={[field.name, 'nota']}
                          rules={[]}
                        >
                          <InputAntd
                            label="Nota de transporte"
                            type="textarea"
                            size="large"
                            style={{
                              border: '1px solid #007bff',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }}
                          />
                        </Form.Item>
                      </Grid>

                      {/* Cuarta fila: Subir Cotización y Flete Cotizado */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={{ textAlign: 'center', mb: 1, fontWeight: 600 }}>Subir Cotización</Typography>
                        <Form.Item
                          name={[field.name, 'cotizacion']}
                          // Hacer cotización opcional
                          rules={[]}
                        >
                          <SimpleFileUpload
                            accept=".pdf,application/pdf"
                          />
                        </Form.Item>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={{ textAlign: 'center', mb: 1, fontWeight: 600 }}>
                          Flete Cotizado
                        </Typography>
                        <Form.Item
                          name={[field.name, 'flete']}
                          // Hacer flete opcional
                          rules={[]}
                        >
                          <InputNumber
                            min={0}
                            step={0.01}
                            placeholder="0.00"
                            style={{
                              width: '100%',
                              border: '1px solid #007bff',
                              borderRadius: '8px',
                              fontWeight: 'bold',
                              textAlign: 'center',
                              padding: '6px',
                            }}
                            prefix="S/ "
                          />
                        </Form.Item>
                      </Grid>
                      {isTreasury && (
                        <Grid size={12}>
                          <Divider sx={{ mx: 2 }} />
                          <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) => {
                              const transporteData = getFieldValue(['transportes', field.name]);
                              const transporteId = transporteData?.id;
                              const montoFlete = Number(transporteData?.flete || 0);

                              if (!transporteId) {
                                return (
                                  <Box sx={{ mt: 2, p: 3, bgcolor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
                                    <Typography color="text.secondary">
                                      Guarda el transporte primero para gestionar pagos
                                    </Typography>
                                  </Box>
                                );
                              }

                              return (
                                <TransportPayments
                                  transporteId={transporteId}
                                  montoFlete={montoFlete}
                                  form={form}
                                  fieldName={field.name}
                                />
                              );
                            }}
                          </Form.Item>
                        </Grid>
                      )}

                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        </div>
      )}
    </Form.List>
  );
};

export default TransportsSection;
