import { Box, Stack, Typography } from '@mui/material';
import { HeroCard } from '@/components/ui/HeroCard';
import { heroUIColors, alpha } from '@/styles/theme/heroui-colors';
import LoginForm from './components/LoginForm';

const Login = () => {
  return (
    <Box
      sx={{
        display: { xs: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100vh',
        background: `linear-gradient(135deg, 
          ${heroUIColors.neutral[50]} 0%, 
          ${heroUIColors.primary[50]} 50%, 
          ${heroUIColors.success[50]} 100%)`,
      }}
    >
            {/* Panel lateral */}
      <Box
        sx={{
          alignItems: 'center',
          background: `linear-gradient(135deg, 
            ${heroUIColors.neutral[900]} 0%, 
            ${heroUIColors.neutral[800]} 50%, 
            ${heroUIColors.neutral[900]} 100%)`,
          color: 'white',
          display: { xs: 'none', lg: 'flex' },
          justifyContent: 'center',
          p: 4,
          position: 'relative',
          overflow: 'hidden',
          
          // Efectos glassmorphism
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, 
              ${alpha('#ffffff', 0.05)} 0%, 
              ${alpha('#ffffff', 0.02)} 100%)`,
            zIndex: 1,
          },
          
          // Patrones decorativos
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background: `radial-gradient(circle, 
              ${alpha(heroUIColors.primary[500], 0.1)} 0%, 
              transparent 70%)`,
            zIndex: 0,
          }
        }}
      >
        <Stack spacing={6} sx={{ zIndex: 2, textAlign: 'center' }}>
          {/* Logo */}
          <Box 
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              '& img': {
                filter: 'brightness(0) invert(1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  filter: 'brightness(0) invert(1) drop-shadow(0 0 20px rgba(255,255,255,0.3))',
                }
              }
            }}
          >
            <img src="/images/multilimp-logo.svg" alt="logo" height={120} />
          </Box>

          {/* Texto de bienvenida */}
          <Box>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 800,
                mb: 2,
                background: heroUIColors.gradients.hero,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'white', // Fallback
              }}
            >
              Bienvenido
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 600,
                color: heroUIColors.success[400],
                mb: 3,
              }}
            >
              de nuevo
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: alpha('#ffffff', 0.8),
                fontWeight: 400,
                lineHeight: 1.6,
                maxWidth: '400px',
              }}
            >
              Accede a tu sistema ERP Multilimp y gestiona tu empresa de manera eficiente
            </Typography>
          </Box>

          {/* Características destacadas */}
          <Stack spacing={3} sx={{ mt: 4 }}>
            {[
              '🚀 Gestión integral de órdenes',
              '📊 Análisis en tiempo real', 
              '🔒 Seguridad empresarial'
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  borderRadius: heroUIColors.radius.md,
                  background: alpha('#ffffff', 0.05),
                  border: `1px solid ${alpha('#ffffff', 0.1)}`,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: alpha('#ffffff', 0.1),
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: alpha('#ffffff', 0.9),
                    fontWeight: 500,
                  }}
                >
                  {feature}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Box>
      {/* Formulario de Login */}
      <Box 
        sx={{ 
          display: 'flex', 
          flex: '1 1 auto', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          position: 'relative',
        }} 
      >
        {/* Efectos de fondo */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: heroUIColors.gradients.primary,
            opacity: 0.1,
            filter: 'blur(40px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            right: '15%',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: heroUIColors.gradients.success,
            opacity: 0.1,
            filter: 'blur(60px)',
          }}
        />

        <Box sx={{ maxWidth: '450px', width: '100%', zIndex: 1 }}>
          <HeroCard variant="glass">
            <LoginForm />
          </HeroCard>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
