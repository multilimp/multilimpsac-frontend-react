import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import SideNavbar from './components/SideNav';
import BlackBar from './components/BlackBar';
import ChatbotButton from '@/components/ChatbotButton';

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
        }}
      >
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, md: 3 },
            transition: 'all 0.3s ease',
            m: { xs: 0, sm: 2 },
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
      {/* <ChatbotButton /> */}
    </Box>
  );
};

export default PrivateLayout;
