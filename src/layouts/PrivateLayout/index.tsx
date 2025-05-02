
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import SideNavbar from './components/SideNav';
import MainNav from './components/MainNav';

const PrivateLayout = () => {
  return (
    <Box
      sx={{
        bgcolor: 'var(--mui-palette-background-default)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      <SideNavbar />
      <Box 
        sx={{ 
          display: 'flex', 
          flex: '1 1 auto', 
          flexDirection: 'column', 
          pl: { lg: 'var(--SideNav-width)' } 
        }}
      >
        <MainNav />
        <Box 
          sx={{
            m: { xs: 1, md: 3 },
            p: { xs: 1, md: 2 },
            borderRadius: 3,
            bgcolor: 'background.paper',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.03)',
            minHeight: 'calc(100vh - 80px)', // Make it take up most of the page
            transition: 'all 0.3s ease',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default PrivateLayout;
