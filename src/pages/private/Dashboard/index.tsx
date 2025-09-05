import { AttachMoney, BarChart, Bento, North, Plagiarism, South } from '@mui/icons-material';
import { Box, Card, CardContent, CardHeader, Chip, Grid, Stack, Typography } from '@mui/material';
import { LineChart, Line, BarChart as RechartsBarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import ComingSoonOverlay from '@/components/ComingSoonOverlay';

const Dashboard = () => {
  const data = [
    {
      title: 'Cotizaciones',
      Icon: Plagiarism,
      value: '24',
      percent: { up: true, value: '12' },
    },
    {
      title: 'Ventas',
      Icon: BarChart,
      value: 'S/. 14,832.00',
      percent: { up: true, value: '8' },
    },
    {
      title: 'Órdenes',
      Icon: Bento,
      value: '18',
      percent: { up: false, value: '3' },
    },
    {
      title: 'Ingresos',
      Icon: AttachMoney,
      value: 'S/. 23,558.55',
      percent: { up: true, value: '10' },
    },
  ];

  const ventasMensuales = [
    { mes: 'Ene', ventas: 12000, meta: 15000 },
    { mes: 'Feb', ventas: 19000, meta: 15000 },
    { mes: 'Mar', ventas: 16000, meta: 15000 },
    { mes: 'Abr', ventas: 22000, meta: 15000 },
    { mes: 'May', ventas: 18000, meta: 15000 },
    { mes: 'Jun', ventas: 25000, meta: 15000 },
    { mes: 'Jul', ventas: 21000, meta: 15000 },
    { mes: 'Ago', ventas: 28000, meta: 15000 },
    { mes: 'Sep', ventas: 24000, meta: 15000 },
    { mes: 'Oct', ventas: 32000, meta: 15000 },
    { mes: 'Nov', ventas: 29000, meta: 15000 },
    { mes: 'Dic', ventas: 35000, meta: 15000 },
  ];

  const distribucionOrdenes = [
    { tipo: 'Completadas', cantidad: 45, color: '#4CAF50' },
    { tipo: 'En Proceso', cantidad: 23, color: '#FF9800' },
    { tipo: 'Pendientes', cantidad: 12, color: '#F44336' },
    { tipo: 'Canceladas', cantidad: 8, color: '#9E9E9E' },
  ];

  const ultimos12Meses = [
    { mes: 'Ene', ingresos: 45000, gastos: 32000, ganancia: 13000 },
    { mes: 'Feb', ingresos: 52000, gastos: 38000, ganancia: 14000 },
    { mes: 'Mar', ingresos: 48000, gastos: 35000, ganancia: 13000 },
    { mes: 'Abr', ingresos: 61000, gastos: 42000, ganancia: 19000 },
    { mes: 'May', ingresos: 55000, gastos: 39000, ganancia: 16000 },
    { mes: 'Jun', ingresos: 68000, gastos: 45000, ganancia: 23000 },
    { mes: 'Jul', ingresos: 62000, gastos: 43000, ganancia: 19000 },
    { mes: 'Ago', ingresos: 75000, gastos: 48000, ganancia: 27000 },
    { mes: 'Sep', ingresos: 71000, gastos: 46000, ganancia: 25000 },
    { mes: 'Oct', ingresos: 82000, gastos: 52000, ganancia: 30000 },
    { mes: 'Nov', ingresos: 78000, gastos: 49000, ganancia: 29000 },
    { mes: 'Dic', ingresos: 89000, gastos: 55000, ganancia: 34000 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Box sx={{ position: 'relative' }}>
      <Typography variant="h5" fontWeight={700}>
        Panel de control
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Resumen de datos y análisis
      </Typography>

      <Grid container spacing={2} mt={4}>
        {data.map(({ Icon, percent, title, value }) => (
          <Grid key={title} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card>
              <CardHeader title={title} action={<Icon color="info" fontSize="large" />} />
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="h6" fontWeight={700}>
                  {value}
                </Typography>
                <Typography color="textSecondary" variant="body2">
                  desde el mes pasado
                </Typography>
                <Stack direction="row" mt={2} spacing={2} alignItems="center">
                  <Chip
                    label={percent.value}
                    color={percent.up ? 'success' : 'error'}
                    icon={percent.up ? <North fontSize="small" /> : <South fontSize="small" />}
                  />
                  <Typography color="textSecondary" variant="body2" lineHeight={1}>
                    desde el mes pasado
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} mt={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title="Ventas mensuales" />
            <CardContent sx={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ventasMensuales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`S/. ${value.toLocaleString()}`, '']} />
                  <Line type="monotone" dataKey="ventas" stroke="#8884d8" strokeWidth={2} name="Ventas" />
                  <Line type="monotone" dataKey="meta" stroke="#82ca9d" strokeWidth={2} name="Meta" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title="Distribución de órdenes" />
            <CardContent sx={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribucionOrdenes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ tipo, cantidad }) => `${tipo}: ${cantidad}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="cantidad"
                  >
                    {distribucionOrdenes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Cantidad']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12}>
          <Card>
            <CardHeader title="Últimos 12 meses - Flujo financiero" />
            <CardContent sx={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ultimos12Meses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`S/. ${value.toLocaleString()}`, '']} />
                  <Area type="monotone" dataKey="ingresos" stackId="1" stroke="#8884d8" fill="#8884d8" name="Ingresos" />
                  <Area type="monotone" dataKey="gastos" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Gastos" />
                  <Area type="monotone" dataKey="ganancia" stackId="1" stroke="#ffc658" fill="#ffc658" name="Ganancia" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title="Rendimiento por categoría" />
            <CardContent sx={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={[
                  { categoria: 'Productos', ventas: 45000, meta: 40000 },
                  { categoria: 'Servicios', ventas: 32000, meta: 35000 },
                  { categoria: 'Consultoría', ventas: 28000, meta: 25000 },
                  { categoria: 'Mantenimiento', ventas: 15000, meta: 12000 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`S/. ${value.toLocaleString()}`, '']} />
                  <Bar dataKey="ventas" fill="#8884d8" name="Ventas" />
                  <Bar dataKey="meta" fill="#82ca9d" name="Meta" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title="Tendencia de clientes" />
            <CardContent sx={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { mes: 'Ene', nuevos: 12, recurrentes: 45, total: 57 },
                  { mes: 'Feb', nuevos: 15, recurrentes: 48, total: 63 },
                  { mes: 'Mar', nuevos: 18, recurrentes: 52, total: 70 },
                  { mes: 'Abr', nuevos: 22, recurrentes: 55, total: 77 },
                  { mes: 'May', nuevos: 25, recurrentes: 58, total: 83 },
                  { mes: 'Jun', nuevos: 28, recurrentes: 62, total: 90 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="nuevos" stroke="#8884d8" strokeWidth={2} name="Nuevos" />
                  <Line type="monotone" dataKey="recurrentes" stroke="#82ca9d" strokeWidth={2} name="Recurrentes" />
                  <Line type="monotone" dataKey="total" stroke="#ffc658" strokeWidth={2} name="Total" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <ComingSoonOverlay />
    </Box>
  );
};

export default Dashboard;
