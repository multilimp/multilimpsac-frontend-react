import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';

const data = [
  {
    mes: 'Ene',
    cumplimiento: 85,
    calidad: 90,
    tiempoEntrega: 78,
  },
  {
    mes: 'Feb',
    cumplimiento: 88,
    calidad: 92,
    tiempoEntrega: 82,
  },
  {
    mes: 'Mar',
    cumplimiento: 82,
    calidad: 89,
    tiempoEntrega: 75,
  },
  {
    mes: 'Abr',
    cumplimiento: 91,
    calidad: 94,
    tiempoEntrega: 87,
  },
  {
    mes: 'May',
    cumplimiento: 89,
    calidad: 91,
    tiempoEntrega: 84,
  },
  {
    mes: 'Jun',
    cumplimiento: 93,
    calidad: 95,
    tiempoEntrega: 89,
  },
  {
    mes: 'Jul',
    cumplimiento: 95,
    calidad: 97,
    tiempoEntrega: 92,
  },
  {
    mes: 'Ago',
    cumplimiento: 92,
    calidad: 94,
    tiempoEntrega: 88,
  },
  {
    mes: 'Sep',
    cumplimiento: 94,
    calidad: 96,
    tiempoEntrega: 90,
  },
  {
    mes: 'Oct',
    cumplimiento: 96,
    calidad: 98,
    tiempoEntrega: 93,
  },
  {
    mes: 'Nov',
    cumplimiento: 93,
    calidad: 95,
    tiempoEntrega: 89,
  },
  {
    mes: 'Dic',
    cumplimiento: 97,
    calidad: 99,
    tiempoEntrega: 95,
  },
];

const ProviderPerformanceChart = () => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={
          <Typography variant="h6" component="h2">
            Rendimiento de Proveedores
          </Typography>
        }
        subheader="Métricas de desempeño promedio de proveedores"
      />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis domain={[0, 100]} />
            <Tooltip 
              formatter={(value, name) => [
                `${value}%`, 
                name === 'cumplimiento' ? 'Cumplimiento' : 
                name === 'calidad' ? 'Calidad' : 'Tiempo de Entrega'
              ]}
            />
            <Area
              type="monotone"
              dataKey="cumplimiento"
              stackId="1"
              stroke="#1976d2"
              fill="#1976d2"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="calidad"
              stackId="2"
              stroke="#01a76a"
              fill="#01a76a"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="tiempoEntrega"
              stackId="3"
              stroke="#ff9800"
              fill="#ff9800"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ProviderPerformanceChart;

