import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import SideNavbar from './components/SideNav';
import MainNav from './components/MainNav';

const PrivateLayout = () => {
  return (    <Box
      sx={{
        bgcolor: 'var(--mui-palette-background-default)',
        display: 'flex',
        minHeight: '100vh',
      }}
    >
      <SideNavbar />
      <Box
        component="main"
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%', // Usar todo el ancho disponible
          overflow: 'auto', // Permitir scroll si es necesario
        }}
      >
        <MainNav />        <Box
          sx={{
            flex: 1,
            p: { xs: 2, md: 3 },
            borderRadius: { xs: 0, sm: 2 },
            bgcolor: 'background.paper',
            boxShadow: { xs: 'none', sm: '0 0 20px rgba(0, 0, 0, 0.03)' },
            transition: 'all 0.3s ease',
            m: { xs: 0, sm: 2 },
            overflow: 'auto', // Permitir scroll horizontal y vertical
            width: '100%', // Asegurar que use todo el ancho
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default PrivateLayout;
