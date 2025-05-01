import { AttachMoney, BarChart, Bento, North, Plagiarism, South } from '@mui/icons-material';
import { Box, Card, CardContent, CardHeader, Chip, Grid, Stack, Typography } from '@mui/material';

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
  return (
    <Box>
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
        {['Ventas mensuales', 'Distribución de órdenes'].map((title) => (
          <Grid key={title} size={{ xs: 12, md: 6 }}>
            <Card>
              <CardHeader title={title} />
              <CardContent sx={{ height: 350 }}></CardContent>
            </Card>
          </Grid>
        ))}
        <Grid size={12}>
          <Card>
            <CardHeader title="Últimos 12 meses" />
            <CardContent sx={{ height: 350 }}></CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
