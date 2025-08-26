import React from 'react';
import { Grid, Typography, Box, Paper } from '@mui/material';
import PageContent from '@/components/PageContent';
import KPICards from './components/KPICards';
import SalesChart from './components/SalesChart';
import TrendChart from './components/TrendChart';
import ClientDistributionChart from './components/ClientDistributionChart';
import ProviderPerformanceChart from './components/ProviderPerformanceChart';
import { BarChart } from '@mui/icons-material';

const Reports = () => {
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

      {/* KPIs Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'medium' }}>
          Métricas Clave
        </Typography>
        <KPICards />
      </Box>

      {/* Charts Section */}
      <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'medium' }}>
        Análisis y Tendencias
      </Typography>
      
      <Grid container spacing={3}>
        {/* Sales Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <SalesChart />
        </Grid>

        {/* Client Distribution */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <ClientDistributionChart />
        </Grid>

        {/* Trend Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <TrendChart />
        </Grid>

        {/* Provider Performance */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <ProviderPerformanceChart />
        </Grid>

        {/* Additional Information */}
        <Grid size={{ xs: 12 }}>
          <Paper
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, #1976d2 0%, #01a76a 100%)',
              color: 'white',
              borderRadius: 2
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              🎯 Resumen Ejecutivo
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                  📈 <strong>Crecimiento:</strong> Las ventas han aumentado un 12.5% este mes, 
                  superando las proyecciones iniciales.
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                  🎯 <strong>Eficiencia:</strong> El 98.5% de las entregas se completaron a tiempo, 
                  manteniendo la excelencia operativa.
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                  💼 <strong>Oportunidad:</strong> Los proveedores muestran un rendimiento 
                  consistente con margen de mejora en tiempos de entrega.
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </PageContent>
  );
};

export default Reports;

