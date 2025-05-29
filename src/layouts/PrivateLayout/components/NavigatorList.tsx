import Scrollbar from '@/components/Scrollbar';
import { useAppContext } from '@/context';
import useSidebarConfig from '@/hooks/useSidebarConfig';
import { SidebarItemProps } from '@/types/global';
import { isNavItemActive } from '@/utils/functions';
import { Box, Divider, Stack, Tooltip } from '@mui/material';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const HEADER_HEIGHT = 80; // si cambias el header, ajusta este valor

const NavigatorList: React.FC = () => {
  const { pathname } = useLocation();
  const { user } = useAppContext();
  const sidebarList = useSidebarConfig(user.role);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Logo (opcional) */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        <Box component="img" src="/images/multilimp-logo.svg" alt="Logo" height={40} />
      </Box>

      <Divider sx={{ width: '80%', borderColor: 'rgba(255,255,255,0.2)', mb: 1 }} />

      <Scrollbar sx={{ height: `calc(100vh - ${HEADER_HEIGHT}px)`, p: 1 }}>
        <Stack spacing={1}>
          {sidebarList.flatMap(section =>
            section.routes.map(route => (
              <NavIconButton
                key={route.path}
                icon={route.icon}
                to={route.path}
                name={route.name}
                active={isNavItemActive({ path: route.path, pathname })}
              />
            ))
          )}
        </Stack>
      </Scrollbar>
    </Box>
  );
};

export default NavigatorList;

interface NavIconButtonProps {
  icon: React.ElementType;
  to: string;
  name: string;
  active: boolean;
}

const NavIconButton: React.FC<NavIconButtonProps> = ({ icon: Icon, to, name, active }) => (
  <Tooltip title={name} placement="right" arrow>
    <Box
      component={Link}
      to={to}
      sx={{
        width: '100%',
        p: 1.5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: active
          ? 'var(--NavItem-icon-active-color)'
          : 'var(--NavItem-icon-color)',
        bgcolor: active
          ? 'var(--NavItem-active-background)'
          : 'transparent',
        borderRadius: 1.5,
        transition: 'background-color 0.2s, transform 0.2s',
        '&:hover': {
          bgcolor: 'var(--NavItem-hover-background)',
          transform: 'translateX(4px)',
        },
      }}
    >
      <Icon fontSize="medium" />
    </Box>
  </Tooltip>
);
