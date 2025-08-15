import { Box, Typography, Button, Container } from '@mui/material';
import { Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Page401 = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Lock 
          sx={{ 
            fontSize: 60, 
            color: 'text.secondary',
            mb: 3
          }} 
        />

        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 500,
            mb: 2
          }}
        >
          Acceso Denegado
        </Typography>

        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ mb: 4 }}
        >
          No tienes permisos para acceder a esta sección.
          <br />
          Contacta al administrador del sistema.
        </Typography>

        <Button
          variant="contained"
          onClick={handleGoHome}
          sx={{ mt: 2 }}
        >
          Volver al Inicio
        </Button>
      </Box>
    </Container>
  );
};

export default Page401;
