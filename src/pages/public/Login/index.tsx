import { Box, Button, FormControl, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';
import InputPassword from '@/components/InputPassword';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context';
import { RolesEnum } from '@/types/global.enum';

const Login = () => {
  const { setUser } = useAppContext();
  const navigate = useNavigate();

  const handleSign = () => {
    setUser({
      id: 1,
      name: 'Aldo Ordoñez',
      rol: RolesEnum.ADMIN,
    });
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: { xs: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
        <Box sx={{ p: 3 }}>
          <img src="/images/multilimp-logo.svg" />
        </Box>
        <Box sx={{ alignItems: 'center', display: 'flex', flex: '1 1 auto', justifyContent: 'center', p: 3 }}>
          <Box sx={{ maxWidth: '450px', width: '100%' }}>
            {/* START */}
            <Stack spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Sign in</Typography>
                <Typography color="text.secondary" variant="body2">
                  Don&apos;t have an account?{' '}
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <FormControl>
                  <InputLabel>Email address</InputLabel>
                  <OutlinedInput label="Email address" type="email" />
                </FormControl>

                <InputPassword />

                <div>
                  <Link to="/recovery-password">Forgot password?</Link>
                </div>

                <Button type="submit" variant="contained" onClick={handleSign}>
                  Sign in
                </Button>
              </Stack>
            </Stack>
            {/* END */}
          </Box>
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
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography color="inherit" sx={{ fontSize: '24px', lineHeight: '32px', textAlign: 'center' }} variant="h1">
              Welcome to{' '}
              <Box component="span" sx={{ color: '#15b79e' }}>
                Devias Kit
              </Box>
            </Typography>
            <Typography align="center" variant="subtitle1">
              A professional template that comes with ready-to-use MUI components.
            </Typography>
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>IMG</Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Login;
