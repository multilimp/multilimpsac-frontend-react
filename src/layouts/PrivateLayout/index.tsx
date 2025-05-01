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
        minHeight: '100%',
      }}
    >
      <SideNavbar />
      <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', pl: { lg: 'var(--SideNav-width)' } }}>
        <MainNav />
        <Box m={1} p={1} borderRadius={1} border="1px solid #ddd">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default PrivateLayout;
