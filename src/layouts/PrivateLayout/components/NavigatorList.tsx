import { useAppContext } from '@/context';
import useSidebarConfig from '@/hooks/useSidebarConfig';
import { isNavItemActive } from '@/utils/functions';
import { Box, Divider, Stack, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavigatorListProps {
  expanded: boolean;
}

const NavigatorList: React.FC<NavigatorListProps> = ({ expanded }) => {
  const { pathname } = useLocation();
  const { user } = useAppContext();
  const sidebarList = useSidebarConfig(user.role, user.permisos || []);
  return (
    <Box sx={{ width: '100%', px: 1, height: '100%', overflow: 'auto' }}>
      <Stack spacing={expanded ? 2 : 1}>
        {sidebarList.map((section, sectionIndex) => (
          <Box key={section.title}>
            {/* Título de sección */}
            {expanded && (
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  px: 2,
                  py: 1,
                  display: 'block',
                }}
              >
                {section.title}
              </Typography>
            )}

            {/* Divider visual para secciones cuando está colapsado */}
            {!expanded && sectionIndex > 0 && (
              <Divider
                sx={{
                  borderColor: 'rgba(255,255,255,0.2)',
                  my: 1,
                  mx: 2,
                }}
              />
            )}

            {/* Rutas de la sección */}
            <Stack spacing={0.5}>
              {section.routes.map((route) => (
                <NavIconButton
                  key={route.path}
                  icon={route.icon}
                  to={route.path}
                  name={route.name}
                  active={isNavItemActive({ path: route.path, pathname })}
                  expanded={expanded}
                />
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default NavigatorList;

interface NavIconButtonProps {
  icon: React.ElementType;
  to: string;
  name: string;
  active: boolean;
  expanded: boolean;
}

const NavIconButton: React.FC<NavIconButtonProps> = ({ icon: Icon, to, name, active, expanded }) => {
  const baseStyles = {
    width: '100%',
    p: expanded ? '12px 16px' : '12px',
    display: 'flex',
    alignItems: 'center',
    gap: expanded ? 2 : 0,
    color: active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)',
    bgcolor: active ? 'var(--NavItem-active-background)' : 'transparent',
    borderRadius: 2,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textDecoration: 'none',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      bgcolor: 'var(--NavItem-hover-background)',
      transform: 'translateX(4px)',
      color: '#111826', // Azul oscuro en lugar de azul claro
    },
    '&::before': active
      ? {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '4px',
          bgcolor: '#111826', // Azul oscuro
          borderRadius: '0 4px 4px 0',
        }
      : {},
  };

  const content = (
    <>
      <Icon fontSize="small" />
      {expanded && (
        <Typography
          variant="body2"
          sx={{
            fontWeight: active ? 600 : 400,
            fontSize: '0.875rem',
            whiteSpace: 'nowrap',
            opacity: expanded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          {name}
        </Typography>
      )}
    </>
  );

  return expanded ? (
    <Box component={Link} to={to} sx={baseStyles}>
      {content}
    </Box>
  ) : (
    <Tooltip title={name} placement="right" arrow>
      <Box
        component={Link}
        to={to}
        sx={{
          ...baseStyles,
          justifyContent: 'center',
        }}
      >
        {content}
      </Box>
    </Tooltip>
  );
};
