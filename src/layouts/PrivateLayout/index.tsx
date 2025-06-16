import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import SideNavbar from './components/SideNav';
import MainNav from './components/MainNav';
import BlackBar from './components/BlackBar';

const PrivateLayout = () => {
  return (
    <Box
      sx={{
        bgcolor: 'var(--mui-palette-background-default)',
        display: 'flex',
        minHeight: '100vh',
      }}
    >
      <SideNavbar />

      <BlackBar />

      <Box
        component="main"
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%',
          overflow: 'auto',
          bgcolor: '#f8fafc', // Fondo más moderno
        }}
      >
        <MainNav />
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, md: 3 },
            // borderRadius: { xs: 0, sm: 2 },
            // bgcolor: 'background.paper',
            // boxShadow: { xs: 'none', sm: '0 1px 3px rgba(0, 0, 0, 0.1)' },
            transition: 'all 0.3s ease',
            m: { xs: 0, sm: 2 },
            overflow: 'auto',
            // width: '100%',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default PrivateLayout;
