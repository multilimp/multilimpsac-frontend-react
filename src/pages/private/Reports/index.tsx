import { useState } from 'react';
import { Grid, Typography, Box, Card, CardContent } from '@mui/material';
import { Select, Form, Button as AntButton } from 'antd';
import { BarChart, TrendingUp, LocalShipping, Star } from '@mui/icons-material';
import PageContent from '@/components/PageContent';
import DatePickerAnt from '@/components/DatePickerAnt';
import dayjs from 'dayjs';

const { Option } = Select;

type ReportType = 'ventas' | 'cobranza' | 'entregas-oc' | 'ranking';

const Reports = () => {
  const [reportType, setReportType] = useState<ReportType>('ventas');
  const [startDate, setStartDate] = useState<any>(dayjs().startOf('month'));
  const [endDate, setEndDate] = useState<any>(dayjs().endOf('month'));
  const [form] = Form.useForm();

  const reportOptions = [
    { value: 'ventas', label: 'Ventas', icon: <TrendingUp /> },
    { value: 'cobranza', label: 'Cobranza', icon: <BarChart /> },
    { value: 'entregas-oc', label: 'Entregas OC', icon: <LocalShipping /> },
    { value: 'ranking', label: 'Ranking', icon: <Star /> },
  ];

  const handleGenerateReport = () => {
    // Aquí irá la lógica para generar el reporte
    console.log('Generando reporte:', {
      type: reportType,
      startDate: startDate?.format('YYYY-MM-DD'),
      endDate: endDate?.format('YYYY-MM-DD'),
    });
  };

  const renderReportContent = () => {
    switch (reportType) {
      case 'ventas':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Reporte de Ventas
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Análisis de ventas del período seleccionado
            </Typography>
            {/* Aquí irán los gráficos de ventas */}
            <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #ddd', borderRadius: 2 }}>
              <Typography variant="h6" color="textSecondary">
                Gráficos de Ventas - Próximamente
              </Typography>
            </Box>
          </Box>
        );

      case 'cobranza':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Reporte de Cobranza
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Estado de cobranza y pagos pendientes
            </Typography>
            {/* Aquí irán los gráficos de cobranza */}
            <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #ddd', borderRadius: 2 }}>
              <Typography variant="h6" color="textSecondary">
                Gráficos de Cobranza - Próximamente
              </Typography>
            </Box>
          </Box>
        );

      case 'entregas-oc':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Reporte de Entregas OC
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Seguimiento de órdenes de compra y entregas
            </Typography>
            {/* Aquí irán los gráficos de entregas OC */}
            <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #ddd', borderRadius: 2 }}>
              <Typography variant="h6" color="textSecondary">
                Gráficos de Entregas OC - Próximamente
              </Typography>
            </Box>
          </Box>
        );

      case 'ranking':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Reporte de Ranking
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Ranking de productos, clientes y proveedores
            </Typography>
            {/* Aquí irán los gráficos de ranking */}
            <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #ddd', borderRadius: 2 }}>
              <Typography variant="h6" color="textSecondary">
                Gráficos de Ranking - Próximamente
              </Typography>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <PageContent>
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <BarChart sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Panel de Reportes
          </Typography>
        </Box>
        <Typography variant="body1" color="textSecondary">
          Dashboard ejecutivo con métricas clave y análisis de rendimiento del negocio
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Columna Izquierda - Filtros (25% sticky) */}
        <Box sx={{ flex: '0 0 25%', minWidth: 300 }}>
          <Box sx={{
            position: 'sticky',
            top: 20,
            height: 'fit-content'
          }}>
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Filtros de Reporte
                </Typography>

                <Form form={form} layout="vertical" onFinish={handleGenerateReport}>
                  <Form.Item
                    label="Tipo de Reporte"
                    name="reportType"
                    rules={[{ required: true, message: 'Seleccione un tipo de reporte' }]}
                    initialValue={reportType}
                  >
                    <Select
                      size="large"
                      placeholder="Seleccione tipo de reporte"
                      onChange={(value) => setReportType(value as ReportType)}
                      style={{ width: '100%' }}
                    >
                      {reportOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          <Box display="flex" alignItems="center">
                            {option.icon}
                            <Typography sx={{ ml: 1 }}>{option.label}</Typography>
                          </Box>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Form.Item
                      label="Fecha de Inicio"
                      name="startDate"
                      rules={[{ required: true, message: 'Seleccione fecha de inicio' }]}
                      style={{ flex: 1 }}
                    >
                      <DatePickerAnt
                        value={startDate}
                        onChange={(date) => setStartDate(date)}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Fecha de Fin"
                      name="endDate"
                      rules={[{ required: true, message: 'Seleccione fecha de fin' }]}
                      style={{ flex: 1 }}
                    >
                      <DatePickerAnt
                        value={endDate}
                        onChange={(date) => setEndDate(date)}
                      />
                    </Form.Item>
                  </Box>

                  <Form.Item>
                    <AntButton
                      type="primary"
                      htmlType="submit"
                      size="large"
                      block
                      style={{
                        marginTop: 16,
                        height: 48,
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}
                    >
                      Generar Reporte
                    </AntButton>
                  </Form.Item>
                </Form>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Columna Derecha - Contenido Dinámico (75%) */}
        <Box sx={{ flex: '1', minWidth: 0 }}>
          <Card sx={{ borderRadius: 2, boxShadow: 2, minHeight: 600 }}>
            <CardContent sx={{ p: 3 }}>
              {renderReportContent()}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </PageContent>
  );
};

export default Reports;

