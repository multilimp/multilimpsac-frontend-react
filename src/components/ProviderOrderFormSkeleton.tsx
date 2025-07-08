import { Skeleton, Stack, Box, Grid, Card, CardContent, Divider } from '@mui/material';

const ProviderOrderFormSkeleton = () => {
  return (
    <Stack direction="column" spacing={3}>
      {/* Select de empresa compradora */}
      {/* <Box>
        <Skeleton variant="rectangular" width={300} height={56} sx={{ borderRadius: 2 }} />
      </Box> */}

      {/* Sección principal del proveedor */}
      <Card sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #f0f0f0' }}>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Skeleton variant="text" width={200} height={32} />
              <Skeleton variant="text" width={120} height={20} />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Campos principales */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
              </Grid>
              <Grid size={12}>
                <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
              </Grid>
            </Grid>

            {/* Información del cliente */}
            <Box sx={{ bgcolor: '#fafafa', borderRadius: 2, p: 2, mt: 2 }}>
              <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} divider={<Divider orientation="vertical" flexItem />}>
                <Box flex={1}>
                  <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="80%" height={18} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="60%" height={16} />
                </Box>
                <Box flex={1}>
                  <Skeleton variant="text" width={120} height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="70%" height={18} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="90%" height={16} />
                </Box>
                <Box flex={1}>
                  <Skeleton variant="text" width={90} height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="85%" height={18} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="95%" height={16} />
                </Box>
              </Stack>
            </Box>

            {/* Contactos del proveedor */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      {/* Sección de Pagos Proveedor */}
      <Card sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #f0f0f0' }}>
        <CardContent sx={{ p: 3 }}>
          <Skeleton variant="text" width={180} height={28} sx={{ mb: 2 }} />
          <Stack spacing={2}>
            {[1, 2].map((i) => (
              <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={200} height={40} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
                <Skeleton variant="circular" width={32} height={32} />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Sección de Transportes */}
      <Card sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #f0f0f0' }}>
        <CardContent sx={{ p: 3 }}>
          <Skeleton variant="text" width={120} height={28} sx={{ mb: 2 }} />
          <Stack spacing={2}>
            {[1, 2].map((i) => (
              <Box key={i} sx={{ border: '1px solid #f0f0f0', borderRadius: 2, p: 2 }}>
                <Skeleton variant="text" width={150} height={24} sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
                  </Grid>
                  <Grid size={12}>
                    <Skeleton variant="rectangular" width="100%" height={80} sx={{ borderRadius: 2 }} />
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Botón de guardado */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Skeleton variant="rectangular" width={180} height={48} sx={{ borderRadius: 2 }} />
      </Box>
    </Stack>
  );
};

export default ProviderOrderFormSkeleton;