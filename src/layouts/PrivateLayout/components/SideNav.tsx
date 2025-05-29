import { Box } from '@mui/material';
import NavigatorList from './NavigatorList';

const SideNavbar: React.FC = () => (
  <Box
    component="nav"
    sx={{
      '--SideNav-width': '80px',            // ← ancho aumentado
      '--SideNav-background': '#00A65A',
      '--SideNav-color': '#FFFFFF',
      '--NavItem-hover-background': 'rgba(255, 255, 255, 0.08)',
      '--NavItem-active-background': 'rgba(255,255,255,0.2)',
      '--NavItem-icon-color': 'rgba(255,255,255,0.7)',
      '--NavItem-icon-active-color': '#FFFFFF',

      width: 'var(--SideNav-width)',
      bgcolor: 'var(--SideNav-background)',
      color: 'var(--SideNav-color)',
      display: { xs: 'none', lg: 'flex' },
      flexDirection: 'column',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      pt: 2,
      boxShadow: '0 0 20px rgba(0,0,0,0.15)',
      zIndex: 1100,
    }}
  >
    <NavigatorList />
  </Box>
);

export default SideNavbar;
