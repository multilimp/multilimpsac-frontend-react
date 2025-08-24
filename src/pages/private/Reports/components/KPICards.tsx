import React from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import { TrendingUp, TrendingDown, AttachMoney, ShoppingCart, Business, LocalShipping } from '@mui/icons-material';

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const KPICard = ({ title, value, change, icon, color }: KPICardProps) => {
  const isPositive = change >= 0;
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="h2" sx={{ mb: 1, fontWeight: 'bold' }}>
              {value}
            </Typography>
            <Box display="flex" alignItems="center">
              {isPositive ? (
                <TrendingUp sx={{ color: 'success.main', mr: 0.5 }} />
              ) : (
                <TrendingDown sx={{ color: 'error.main', mr: 0.5 }} />
              )}
              <Typography
                variant="body2"
                sx={{
                  color: isPositive ? 'success.main' : 'error.main',
                  fontWeight: 'medium'
                }}
              >
                {isPositive ? '+' : ''}{change}%
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                vs mes anterior
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const KPICards = () => {
  const kpis = [
    {
      title: 'Ingresos Totales',
      value: 'S/ 245,680',
      change: 12.5,
      icon: <AttachMoney sx={{ color: 'white', fontSize: 24 }} />,
      color: '#1976d2'
    },
    {
      title: 'Órdenes Procesadas',
      value: '1,234',
      change: 8.2,
      icon: <ShoppingCart sx={{ color: 'white', fontSize: 24 }} />,
      color: '#01a76a'
    },
    {
      title: 'Clientes Activos',
      value: '156',
      change: -2.1,
      icon: <Business sx={{ color: 'white', fontSize: 24 }} />,
      color: '#ff9800'
    },
    {
      title: 'Entregas Completadas',
      value: '98.5%',
      change: 1.8,
      icon: <LocalShipping sx={{ color: 'white', fontSize: 24 }} />,
      color: '#9c27b0'
    }
  ];

  return (
    <Grid container spacing={3}>
      {kpis.map((kpi, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <KPICard {...kpi} />
        </Grid>
      ))}
    </Grid>
  );
};

export default KPICards;
