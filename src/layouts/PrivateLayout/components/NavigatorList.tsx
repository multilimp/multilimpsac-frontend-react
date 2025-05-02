
import Scrollbar from '@/components/Scrollbar';
import { useAppContext } from '@/context';
import useSidebarConfig from '@/hooks/useSidebarConfig';
import { SidebarItemProps } from '@/types/global';
import { isNavItemActive } from '@/utils/functions';
import { Box, Divider, FormHelperText, Stack, Typography } from '@mui/material';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const HEADER_HEIGHT = 145;

const NavigatorList = () => {
  const { pathname } = useLocation();
  const { user } = useAppContext();
  const sidebarList = useSidebarConfig(user.rol);

  return (
    <Box>
      <Stack p={3} spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
          <Box 
            component="img" 
            src="/images/multilimp-logo.svg" 
            alt="Logo" 
            height={50} 
            sx={{ filter: 'brightness(0) invert(1)' }} // Make logo white
          />
          <Typography variant="h5" fontWeight={700} sx={{ color: 'white' }}>
            MULTILIMP
          </Typography>
        </Stack>
        <Stack alignItems="center">
          <Typography fontWeight={600} sx={{ color: 'white' }}>{user.name}</Typography>
          <FormHelperText sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>{user.rol.toUpperCase()}</FormHelperText>
        </Stack>
      </Stack>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      <Box component="nav">
        <Scrollbar sx={{ height: `calc((100vh) - ${HEADER_HEIGHT}px)`, p: 2 }}>
          <Stack spacing={2}>
            {sidebarList.map((item) => (
              <Stack key={item.title} spacing={1.5}>
                <FormHelperText sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.5)', fontWeight: 500, fontSize: '0.75rem' }}>
                  {item.title.toUpperCase()}
                </FormHelperText>
                {item.routes.map((record) => (
                  <NavItem key={record.path} pathname={pathname} {...record} />
                ))}
              </Stack>
            ))}
          </Stack>
        </Scrollbar>
      </Box>
    </Box>
  );
};

export default NavigatorList;

interface NavItemProps extends SidebarItemProps {
  pathname: string;
}

function NavItem({ icon: Icon, name, path, pathname }: Readonly<NavItemProps>): React.JSX.Element {
  const active = isNavItemActive({ path, pathname });

  return (
    <Box
      component={Link}
      to={path}
      sx={{
        alignItems: 'center',
        borderRadius: 2,
        color: 'var(--NavItem-color)',
        cursor: 'pointer',
        display: 'flex',
        flex: '0 0 auto',
        gap: 1,
        p: '8px 16px',
        position: 'relative',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: 'var(--NavItem-hover-background)',
          transform: 'translateX(4px)',
        },
        ...(active && { 
          bgcolor: 'var(--NavItem-active-background)', 
          color: 'var(--NavItem-active-color)',
          '&:hover': {
            transform: 'none',
            bgcolor: 'var(--NavItem-active-background)',
          },
        }),
      }}
    >
      <Box sx={{ 
        alignItems: 'center', 
        display: 'flex', 
        justifyContent: 'center', 
        flex: '0 0 auto',
        color: active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)',
      }}>
        <Icon />
      </Box>
      <Typography 
        component="span" 
        sx={{ 
          color: 'inherit', 
          fontSize: '0.875rem', 
          fontWeight: active ? 600 : 500, 
          lineHeight: '28px', 
          flex: '1 1 auto' 
        }}
      >
        {name}
      </Typography>
    </Box>
  );
}
