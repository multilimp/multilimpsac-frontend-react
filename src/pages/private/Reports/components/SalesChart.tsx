import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';

const data = [
  {
    mes: 'Ene',
    ventas: 4000,
    ordenes: 2400,
  },
  {
    mes: 'Feb',
    ventas: 3000,
    ordenes: 1398,
  },
  {
    mes: 'Mar',
    ventas: 2000,
    ordenes: 9800,
  },
  {
    mes: 'Abr',
    ventas: 2780,
    ordenes: 3908,
  },
  {
    mes: 'May',
    ventas: 1890,
    ordenes: 4800,
  },
  {
    mes: 'Jun',
    ventas: 2390,
    ordenes: 3800,
  },
  {
    mes: 'Jul',
    ventas: 3490,
    ordenes: 4300,
  },
  {
    mes: 'Ago',
    ventas: 4200,
    ordenes: 3200,
  },
  {
    mes: 'Sep',
    ventas: 3800,
    ordenes: 2900,
  },
  {
    mes: 'Oct',
    ventas: 4100,
    ordenes: 3100,
  },
  {
    mes: 'Nov',
    ventas: 3600,
    ordenes: 2800,
  },
  {
    mes: 'Dic',
    ventas: 4500,
    ordenes: 3500,
  },
];

const SalesChart = () => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={
          <Typography variant="h6" component="h2">
            Ventas y Órdenes por Mes
          </Typography>
        }
        subheader="Comparación mensual de ventas vs órdenes de proveedor"
      />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                new Intl.NumberFormat('es-PE', { 
                  style: 'currency', 
                  currency: 'PEN' 
                }).format(Number(value)), 
                name === 'ventas' ? 'Ventas' : 'Órdenes'
              ]}
            />
            <Legend />
            <Bar dataKey="ventas" fill="#1976d2" name="Ventas" />
            <Bar dataKey="ordenes" fill="#01a76a" name="Órdenes" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SalesChart;

