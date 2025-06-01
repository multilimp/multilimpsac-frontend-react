import { Box } from '@mui/material';
import NavigatorList from './NavigatorList';

const SideNavbar: React.FC = () => (
  <Box
    component="nav"
    sx={{
      '--SideNav-width': '72px',
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
      minHeight: '100vh',
      pt: 1,
      pb: 1,
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
      position: 'sticky', // Cambiado de fixed a sticky
      top: 0,
      flexShrink: 0, // Evita que se comprima
      transition: 'all 0.3s ease',
    }}
  >
    <NavigatorList />
  </Box>
);

export default SideNavbar;
