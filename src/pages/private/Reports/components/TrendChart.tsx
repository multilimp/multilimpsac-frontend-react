import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';

const data = [
  {
    mes: 'Ene',
    ingresos: 45000,
    gastos: 32000,
    utilidad: 13000,
  },
  {
    mes: 'Feb',
    ingresos: 52000,
    gastos: 35000,
    utilidad: 17000,
  },
  {
    mes: 'Mar',
    ingresos: 48000,
    gastos: 33000,
    utilidad: 15000,
  },
  {
    mes: 'Abr',
    ingresos: 61000,
    gastos: 38000,
    utilidad: 23000,
  },
  {
    mes: 'May',
    ingresos: 55000,
    gastos: 36000,
    utilidad: 19000,
  },
  {
    mes: 'Jun',
    ingresos: 67000,
    gastos: 42000,
    utilidad: 25000,
  },
  {
    mes: 'Jul',
    ingresos: 72000,
    gastos: 45000,
    utilidad: 27000,
  },
  {
    mes: 'Ago',
    ingresos: 69000,
    gastos: 43000,
    utilidad: 26000,
  },
  {
    mes: 'Sep',
    ingresos: 74000,
    gastos: 46000,
    utilidad: 28000,
  },
  {
    mes: 'Oct',
    ingresos: 78000,
    gastos: 48000,
    utilidad: 30000,
  },
  {
    mes: 'Nov',
    ingresos: 76000,
    gastos: 47000,
    utilidad: 29000,
  },
  {
    mes: 'Dic',
    ingresos: 82000,
    gastos: 50000,
    utilidad: 32000,
  },
];

const TrendChart = () => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={
          <Typography variant="h6" component="h2">
            Tendencias Financieras
          </Typography>
        }
        subheader="Evolución de ingresos, gastos y utilidades"
      />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
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
                name === 'ingresos' ? 'Ingresos' : 
                name === 'gastos' ? 'Gastos' : 'Utilidad'
              ]}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="ingresos" 
              stroke="#1976d2" 
              strokeWidth={2}
              name="Ingresos"
            />
            <Line 
              type="monotone" 
              dataKey="gastos" 
              stroke="#d32f2f" 
              strokeWidth={2}
              name="Gastos"
            />
            <Line 
              type="monotone" 
              dataKey="utilidad" 
              stroke="#01a76a" 
              strokeWidth={2}
              name="Utilidad"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TrendChart;

