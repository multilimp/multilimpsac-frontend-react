import React from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { 
  AttachMoney, 
  BarChart, 
  Inventory, 
  TrendingUp,
  Refresh,
  MoreVert
} from '@mui/icons-material';
import { HeroCard } from './HeroCard';
import { heroUIColors, alpha } from '@/styles/theme/heroui-colors';

interface DashboardMetric {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: string;
    isUp: boolean;
  };
  color: 'primary' | 'success' | 'warning' | 'error';
}

interface HeroDashboardCardProps extends DashboardMetric {}

export const HeroDashboardCard: React.FC<HeroDashboardCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color
}) => {
  const getColorScheme = () => {
    switch (color) {
      case 'success':
        return {
          gradient: heroUIColors.gradients.success,
          color: heroUIColors.success[500],
          bg: heroUIColors.success[50],
          lightBg: alpha(heroUIColors.success[500], 0.1)
        };
      case 'warning':
        return {
          gradient: heroUIColors.gradients.warning,
          color: heroUIColors.warning[500],
          bg: heroUIColors.warning[50],
          lightBg: alpha(heroUIColors.warning[500], 0.1)
        };
      case 'error':
        return {
          gradient: heroUIColors.gradients.error,
          color: heroUIColors.error[500],
          bg: heroUIColors.error[50],
          lightBg: alpha(heroUIColors.error[500], 0.1)
        };
      default:
        return {
          gradient: heroUIColors.gradients.secondary,
          color: heroUIColors.secondary[500],
          bg: heroUIColors.secondary[50],
          lightBg: alpha(heroUIColors.secondary[500], 0.1)
        };
    }
  };

  const colorScheme = getColorScheme();

  return (
    <HeroCard
      variant="soft"
      sx={{
        height: '160px',
        background: `linear-gradient(135deg, #ffffff 0%, ${colorScheme.bg} 100%)`,
        border: `1px solid ${alpha(colorScheme.color, 0.1)}`,
        boxShadow: `0 10px 30px ${alpha(colorScheme.color, 0.1)}`,
        position: 'relative',
        overflow: 'hidden',
        
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 20px 40px ${alpha(colorScheme.color, 0.2)}`,
        },
        
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: colorScheme.gradient,
        },
      }}
    >
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header con icono */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: heroUIColors.radius.md,
              background: colorScheme.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 20px ${alpha(colorScheme.color, 0.3)}`,
            }}
          >
            <Icon sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          
          <Tooltip title="Más opciones">
            <IconButton size="small" sx={{ color: heroUIColors.neutral[400] }}>
              <MoreVert fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Contenido principal */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: heroUIColors.neutral[600],
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: '0.75rem',
              mb: 1,
            }}
          >
            {title}
          </Typography>
          
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: heroUIColors.neutral[800],
              mb: 1,
              lineHeight: 1.2,
            }}
          >
            {value}
          </Typography>

          {/* Trend indicator */}
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: heroUIColors.radius.sm,
                  background: trend.isUp 
                    ? alpha(heroUIColors.success[500], 0.1)
                    : alpha(heroUIColors.error[500], 0.1),
                  color: trend.isUp ? heroUIColors.success[700] : heroUIColors.error[700],
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                {trend.isUp ? '↗' : '↘'} {trend.value}
              </Box>
              <Typography
                variant="caption"
                sx={{ color: heroUIColors.neutral[500], ml: 1, fontSize: '0.7rem' }}
              >
                vs. mes anterior
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </HeroCard>
  );
};

interface HeroDashboardProps {
  title?: string;
  subtitle?: string;
  metrics?: DashboardMetric[];
  loading?: boolean;
}

export const HeroDashboard: React.FC<HeroDashboardProps> = ({
  title = "Panel de Control",
  subtitle = "Resumen de datos y análisis en tiempo real",
  metrics = [],
  loading = false
}) => {
  const defaultMetrics: DashboardMetric[] = [
    {
      title: 'Órdenes de Compra',
      value: '24',
      icon: Inventory,
      trend: { value: '12%', isUp: true },
      color: 'primary',
    },
    {
      title: 'Ventas del Mes',
      value: 'S/. 14,832.00',
      icon: BarChart,
      trend: { value: '8%', isUp: true },
      color: 'success',
    },
    {
      title: 'Órdenes Activas',
      value: '18',
      icon: TrendingUp,
      trend: { value: '3%', isUp: false },
      color: 'warning',
    },
    {
      title: 'Ingresos Totales',
      value: 'S/. 23,558.55',
      icon: AttachMoney,
      trend: { value: '10%', isUp: true },
      color: 'success',
    },
  ];

  const dashboardMetrics = metrics.length > 0 ? metrics : defaultMetrics;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, 
          ${heroUIColors.neutral[50]} 0%, 
          ${heroUIColors.primary[50]} 50%, 
          ${heroUIColors.success[50]} 100%)`,
        p: 3,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              background: heroUIColors.gradients.hero,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: heroUIColors.neutral[600],
              fontWeight: 400,
            }}
          >
            {subtitle}
          </Typography>
        </Box>
        
        <Tooltip title="Actualizar datos">
          <IconButton
            sx={{
              background: alpha('#ffffff', 0.8),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha('#ffffff', 0.2)}`,
              '&:hover': {
                background: '#ffffff',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Dashboard Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          },
          gap: 3,
          mb: 4
        }}
      >
        {dashboardMetrics.map((metric, index) => (
          <HeroDashboardCard key={index} {...metric} />
        ))}
      </Box>

      {/* Charts Section */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '2fr 1fr'
          },
          gap: 3
        }}
      >
        <HeroCard variant="glass" sx={{ height: 400 }}>
          <Box sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: heroUIColors.neutral[800] }}>
              Análisis de Ventas
            </Typography>
            <Box
              sx={{
                height: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: alpha('#ffffff', 0.5),
                borderRadius: 2,
                color: heroUIColors.neutral[600],
                border: `1px dashed ${heroUIColors.neutral[300]}`,
              }}
            >
              {loading ? 'Cargando gráfico...' : 'Gráfico de ventas aquí'}
            </Box>
          </Box>
        </HeroCard>
        
        <HeroCard variant="bordered" sx={{ height: 400 }}>
          <Box sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: heroUIColors.neutral[800] }}>
              Actividad Reciente
            </Typography>
            <Box
              sx={{
                height: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: heroUIColors.neutral[500],
                border: `1px dashed ${heroUIColors.neutral[300]}`,
                borderRadius: 2,
              }}
            >
              Lista de actividades recientes
            </Box>
          </Box>
        </HeroCard>
      </Box>
    </Box>
  );
};

export default HeroDashboard;
