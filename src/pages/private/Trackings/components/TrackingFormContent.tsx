import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Stack, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader,
  Button,
  Chip,
  Divider,
  Alert,
  LinearProgress
} from '@mui/material';
import { 
  ArrowBack, 
  CheckCircle, 
  Schedule, 
  Warning,
  LocalShipping,
  Assignment,
  Save
} from '@mui/icons-material';
import { notification, Spin, Form } from 'antd';
import { SaleProps } from '@/services/sales/sales';
import { heroUIColors, alpha } from '@/styles/theme/heroui-colors';
import { formatCurrency, formattedDate } from '@/utils/functions';

interface TrackingFormContentProps {
  sale: SaleProps;
}

// Estados de seguimiento con colores y labels
const trackingStatusConfig = {
  'PENDIENTE': {
    label: 'Pendiente',
    color: heroUIColors.warning[500],
    bgColor: alpha(heroUIColors.warning[100], 0.3),
    icon: Schedule
  },
  'EN_PROCESO': {
    label: 'En Proceso',
    color: heroUIColors.primary[500],
    bgColor: alpha(heroUIColors.primary[100], 0.3),
    icon: LocalShipping
  },
  'COMPLETADO': {
    label: 'Completado',
    color: heroUIColors.success[500],
    bgColor: alpha(heroUIColors.success[100], 0.3),
    icon: CheckCircle
  },
  'RETRASADO': {
    label: 'Retrasado',
    color: heroUIColors.error[500],
    bgColor: alpha(heroUIColors.error[100], 0.3),
    icon: Warning
  },
  'CANCELADO': {
    label: 'Cancelado',
    color: heroUIColors.neutral[500],
    bgColor: alpha(heroUIColors.neutral[100], 0.3),
    icon: Assignment
  }
};

const TrackingFormContent = ({ sale }: TrackingFormContentProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);

  // Estado simulado - en producción vendría del backend
  const currentStatus = 'EN_PROCESO';
  const statusInfo = trackingStatusConfig[currentStatus as keyof typeof trackingStatusConfig];
  const StatusIcon = statusInfo.icon;

  useEffect(() => {
    loadTrackingDetails();
  }, [sale.id]);

  const loadTrackingDetails = async () => {
    try {
      setLoading(true);
      // TODO: Implementar llamada al servicio de seguimiento
      // const data = await getTrackingBySaleId(sale.id);
      
      // Datos simulados por ahora
      const mockData = {
        id: sale.id,
        status: currentStatus,
        lastUpdate: new Date().toISOString(),
        notes: 'Seguimiento en proceso normal',
        deliveryProgress: 65,
        estimatedDelivery: sale.fechaMaxForm || new Date().toISOString(),
      };
      
      setTrackingData(mockData);

      // Pre-llenar formulario
      form.setFieldsValue({
        estado: currentStatus,
        progreso: mockData.deliveryProgress,
        observaciones: mockData.notes,
        fechaEstimada: mockData.estimatedDelivery,
      });

    } catch (error) {
      notification.error({
        message: 'Error al cargar seguimiento',
        description: 'No se pudieron cargar los detalles del seguimiento'
      });
      console.error('Error loading tracking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/tracking');
  };

  const handleFinish = async (values: Record<string, any>) => {
    try {
      setLoading(true);

      // TODO: Implementar guardado real del seguimiento
      console.log('Guardando seguimiento:', values);
      
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));

      notification.success({
        message: 'Seguimiento actualizado',
        description: 'El seguimiento se ha actualizado correctamente'
      });

      navigate('/tracking');
    } catch (error) {
      notification.error({
        message: 'Error al guardar',
        description: 'No se pudo actualizar el seguimiento'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !trackingData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Spin size="large" />
      </Box>
    );
  }

  return (
    <Spin spinning={loading}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBack}
              sx={{
                borderColor: heroUIColors.neutral[300],
                color: heroUIColors.neutral[700],
                '&:hover': {
                  borderColor: heroUIColors.neutral[400],
                  backgroundColor: alpha(heroUIColors.neutral[100], 0.5),
                }
              }}
            >
              Volver a Seguimientos
            </Button>
          </Stack>

          <Typography 
            variant="h4" 
            fontWeight={700}
            color={heroUIColors.neutral[800]}
            gutterBottom
          >
            Seguimiento de Orden de Compra
          </Typography>
          
          <Typography 
            variant="h6" 
            color={heroUIColors.neutral[600]}
            fontWeight={500}
          >
            {sale.codigoVenta}
          </Typography>
        </Box>

        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Columna Izquierda - Estado Actual */}
            <Box sx={{ flex: 1 }}>
              <Card 
                sx={{ 
                  mb: 3,
                  border: `2px solid ${statusInfo.color}`,
                  borderRadius: heroUIColors.radius.lg,
                  background: statusInfo.bgColor,
                }}
              >
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        backgroundColor: statusInfo.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    >
                      <StatusIcon />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Estado: {statusInfo.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Última actualización: {formattedDate(trackingData?.lastUpdate)}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Progreso Visual */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Progreso de Entrega
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={trackingData?.deliveryProgress || 0}
                        sx={{ 
                          flex: 1, 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: alpha(statusInfo.color, 0.2),
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: statusInfo.color,
                          }
                        }} 
                      />
                      <Typography variant="body2" fontWeight={600} minWidth={40}>
                        {trackingData?.deliveryProgress || 0}%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Información de la Venta */}
              <Card>
                <CardHeader 
                  title="Información de la Orden"
                  titleTypographyProps={{ fontWeight: 600 }}
                  sx={{ 
                    backgroundColor: alpha(heroUIColors.primary[50], 0.5),
                    borderBottom: `1px solid ${heroUIColors.neutral[200]}`
                  }}
                />
                <CardContent>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Cliente
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {sale.cliente?.razonSocial || 'N/A'}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        RUC Cliente
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {sale.cliente?.ruc || 'N/A'}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Empresa
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {sale.empresa?.razonSocial || 'N/A'}
                      </Typography>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Monto de Venta
                      </Typography>
                      <Typography variant="h6" fontWeight={600} color={heroUIColors.success[600]}>
                        {formatCurrency(parseInt(sale.montoVenta || '0'))}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Fecha Máxima de Entrega
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {formattedDate(sale.fechaMaxForm)}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Departamento de Entrega
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {sale.departamentoEntrega || 'N/A'}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        CUE
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {sale.cliente?.codigoUnidadEjecutora || 'N/A'}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>

            {/* Columna Derecha - Formulario de Actualización */}
            <Box sx={{ flex: 1 }}>
              <Card>
                <CardHeader 
                  title="Actualizar Seguimiento"
                  titleTypographyProps={{ fontWeight: 600 }}
                  sx={{ 
                    backgroundColor: alpha(heroUIColors.secondary[50], 0.5),
                    borderBottom: `1px solid ${heroUIColors.neutral[200]}`
                  }}
                />
                <CardContent>
                  <Stack spacing={3}>
                    {/* Estado */}
                    <Form.Item
                      name="estado"
                      label={<Typography variant="body2" fontWeight={500}>Estado del Seguimiento</Typography>}
                      rules={[{ required: true, message: 'Estado requerido' }]}
                    >
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {Object.entries(trackingStatusConfig).map(([key, config]) => (
                          <Chip
                            key={key}
                            label={config.label}
                            clickable
                            variant={currentStatus === key ? 'filled' : 'outlined'}
                            sx={{
                              backgroundColor: currentStatus === key ? config.color : 'transparent',
                              color: currentStatus === key ? 'white' : config.color,
                              borderColor: config.color,
                              '&:hover': {
                                backgroundColor: alpha(config.color, 0.1),
                              }
                            }}
                            onClick={() => {
                              form.setFieldValue('estado', key);
                            }}
                          />
                        ))}
                      </Box>
                    </Form.Item>

                    {/* Progreso */}
                    <Form.Item
                      name="progreso"
                      label={<Typography variant="body2" fontWeight={500}>Progreso (%)</Typography>}
                      rules={[{ required: true, message: 'Progreso requerido' }]}
                    >
                      <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue={trackingData?.deliveryProgress || 0}
                        onChange={(e) => form.setFieldValue('progreso', parseInt(e.target.value))}
                        style={{
                          width: '100%',
                          height: '8px',
                          borderRadius: '4px',
                          background: heroUIColors.neutral[200],
                          outline: 'none',
                          appearance: 'none',
                        }}
                      />
                    </Form.Item>

                    {/* Observaciones */}
                    <Form.Item
                      name="observaciones"
                      label={<Typography variant="body2" fontWeight={500}>Observaciones</Typography>}
                    >
                      <textarea
                        rows={4}
                        placeholder="Agregar observaciones del seguimiento..."
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `1px solid ${heroUIColors.neutral[300]}`,
                          borderRadius: '8px',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          fontSize: '14px',
                        }}
                        onChange={(e) => form.setFieldValue('observaciones', e.target.value)}
                      />
                    </Form.Item>

                    {trackingData?.notes && (
                      <Alert 
                        severity="info" 
                        icon={<Assignment />}
                        sx={{ mt: 2 }}
                      >
                        <Typography variant="body2">
                          <strong>Nota anterior:</strong> {trackingData.notes}
                        </Typography>
                      </Alert>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Acciones */}
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              sx={{
                borderColor: heroUIColors.neutral[300],
                color: heroUIColors.neutral[600],
                '&:hover': {
                  borderColor: heroUIColors.neutral[400],
                  backgroundColor: alpha(heroUIColors.neutral[100], 0.5),
                }
              }}
            >
              Cancelar
            </Button>

            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={() => form.submit()}
              disabled={loading}
              sx={{
                background: heroUIColors.gradients.primary,
                borderRadius: heroUIColors.radius.md,
                px: 3,
              }}
            >
              Guardar Seguimiento
            </Button>
          </Box>
        </Form>
      </Box>
    </Spin>
  );
};

export default TrackingFormContent;
