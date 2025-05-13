import { Box, Stack, Typography } from '@mui/material';
import LoginForm from './components/LoginForm';

const Login = () => {
  return (
    <Box
      sx={{
        display: { xs: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }} alignItems="center" justifyContent="center">
        <Box sx={{ maxWidth: '450px', width: '100%' }} width={450}>
          <LoginForm />
        </Box>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          background: 'radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)',
          color: 'var(--mui-palette-common-white)',
          display: { xs: 'none', lg: 'flex' },
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Stack spacing={10}>
          <Box component="img" src="/images/multilimp-logo.svg" alt="logo" height={100} />
          <Typography color="inherit" variant="h3">
            Bienvenido
            <Typography color="primary" variant="inherit" component="span" ml={1}>
              de nuevo
            </Typography>
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default Login;
