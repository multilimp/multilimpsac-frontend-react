import { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Menu as MenuIcon, MenuOpen as MenuOpenIcon } from '@mui/icons-material';
import NavigatorList from './NavigatorList';
import '../../../styles/sidebar.css';

const SideNavbar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <Box
      component="nav"
      sx={{
        '--SideNav-width-collapsed': '72px',
        '--SideNav-width-expanded': '240px',
        '--SideNav-background': '#00A65A', // Color verde original
        '--SideNav-color': '#FFFFFF',
        '--NavItem-hover-background': 'rgba(255, 255, 255, 0.1)',
        '--NavItem-active-background': 'rgba(255, 255, 255, 0.15)',
        '--NavItem-icon-color': 'rgba(255,255,255,0.8)',
        '--NavItem-icon-active-color': '#FFFFFF',

        width: expanded ? 'var(--SideNav-width-expanded)' : 'var(--SideNav-width-collapsed)',
        bgcolor: 'var(--SideNav-background)',
        color: 'var(--SideNav-color)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        maxHeight: '100vh',
        boxShadow: '2px 0 20px rgba(0,0,0,0.12)',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          minHeight: 64,
        }}
      >
        <Box
          component="img"
          src="/images/multilimp-logo.svg"
          alt="MultiLimp Logo"
          sx={{
            height: expanded ? 40 : 36,
            width: 'auto',
            transition: 'height 0.3s ease',
          }}
        />
        {expanded && (
          <Box
            sx={{
              ml: 2,
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'white',
              whiteSpace: 'nowrap',
            }}
          >
            MULTILIMPSAC
          </Box>
        )}
      </Box>{' '}
      {/* Lista de navegación */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          py: 1,
        }}
        className="sidebar-scroll"
      >
        <NavigatorList expanded={expanded} />
      </Box>
      {/* Botón de toggle en la parte inferior */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          p: 2,
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Tooltip title={expanded ? 'Contraer menú' : 'Expandir menú'} placement="right">
          <IconButton
            onClick={toggleExpanded}
            size="small"
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            {expanded ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default SideNavbar;
