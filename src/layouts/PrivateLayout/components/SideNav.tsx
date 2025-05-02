
import { Box } from '@mui/material';
import NavigatorList from './NavigatorList';

const SideNavbar = () => {
  return (
    <Box
      sx={{
        '--SideNav-background': 'var(--mui-palette-secondary-main)', // Using multilimpBlue
        '--SideNav-color': 'var(--mui-palette-common-white)',
        '--NavItem-color': 'var(--mui-palette-neutral-300)',
        '--NavItem-hover-background': 'rgba(255, 255, 255, 0.08)',
        '--NavItem-active-background': 'var(--mui-palette-primary-main)', // Using multilimpGreen
        '--NavItem-active-color': 'var(--mui-palette-common-white)',
        '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
        '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
        '--NavItem-icon-active-color': 'var(--mui-palette-common-white)',
        '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
        bgcolor: 'var(--SideNav-background)',
        color: 'var(--SideNav-color)',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        height: '100%',
        left: 0,
        maxWidth: '100%',
        position: 'fixed',
        scrollbarWidth: 'none',
        top: 0,
        width: 'var(--SideNav-width)',
        zIndex: 'var(--SideNav-zIndex)',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.15)',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <NavigatorList />
    </Box>
  );
};

export default SideNavbar;
