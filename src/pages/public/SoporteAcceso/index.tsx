
import { Box, Stack, Typography, Card, CardContent, Button } from '@mui/material';
import { Support, Email, Phone, AccountCircle, Business } from '@mui/icons-material';
import { heroUIColors } from '@/styles/theme/heroui-colors';
import { Link } from 'react-router-dom';

const SoporteAcceso = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${heroUIColors.neutral[50]} 0%, ${heroUIColors.neutral[100]} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '500px',
          mx: 'auto',
        }}
      >
        {/* Header */}
        <Stack alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: heroUIColors.neutral[900],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Support sx={{ fontSize: 40, color: '#ffffff' }} />
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: heroUIColors.neutral[900],
              textAlign: 'center',
              fontSize: '1.75rem'
            }}
          >
            Soporte de Acceso
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: heroUIColors.neutral[600],
              textAlign: 'center',
              fontSize: '1rem',
              lineHeight: 1.6
            }}
          >
            Sistema empresarial MULTILIMP SAC
          </Typography>
        </Stack>

        {/* Información de contacto */}
        <Card
          sx={{
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: `1px solid ${heroUIColors.neutral[200]}`,
            mb: 3
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: heroUIColors.neutral[900],
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <AccountCircle color="primary" />
                  ¿Problemas para acceder a tu cuenta?
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: heroUIColors.neutral[600],
                    lineHeight: 1.6,
                    mb: 3
                  }}
                >
                  Como empleado de MULTILIMP SAC, para recuperar el acceso a tu cuenta o restablecer tu contraseña,
                  debes contactar directamente con el administrador del sistema.
                </Typography>
              </Box>

              {/* Información de contacto del administrador */}
              <Box
                sx={{
                  backgroundColor: heroUIColors.neutral[50],
                  borderRadius: '8px',
                  p: 3,
                  border: `1px solid ${heroUIColors.neutral[200]}`
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: heroUIColors.neutral[900],
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Business color="primary" />
                  Contacta al Administrador
                </Typography>

                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Email sx={{ fontSize: 20, color: heroUIColors.neutral[600] }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: heroUIColors.neutral[900] }}>
                        Email
                      </Typography>
                      <Typography variant="body2" sx={{ color: heroUIColors.neutral[600] }}>
                        admin@multilimp.com
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Phone sx={{ fontSize: 20, color: heroUIColors.neutral[600] }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: heroUIColors.neutral[900] }}>
                        Teléfono
                      </Typography>
                      <Typography variant="body2" sx={{ color: heroUIColors.neutral[600] }}>
                        +51 (01) 234-5678
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>

              {/* Información adicional */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: heroUIColors.neutral[500],
                    fontSize: '0.875rem',
                    fontStyle: 'italic',
                    textAlign: 'center'
                  }}
                >
                  Por seguridad, solo el administrador del sistema puede gestionar accesos y contraseñas.
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Botón de regreso */}
        <Stack alignItems="center">
          <Button
            component={Link}
            to="/login"
            variant="text"
            sx={{
              color: heroUIColors.neutral[600],
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              textDecoration: 'none',
              padding: '8px 16px',

              '&:hover': {
                color: heroUIColors.neutral[900],
                backgroundColor: 'transparent',
                textDecoration: 'none',
              }
            }}
          >
            ← Volver al inicio de sesión
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default SoporteAcceso;
