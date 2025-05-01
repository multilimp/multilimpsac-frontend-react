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
      <Stack p={2} spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
          <Box component="img" src="/images/multilimp-logo.svg" alt="Logo" height={50} />
          <Typography variant="h5" fontWeight={700}>
            MULTILIMPSAC
          </Typography>
        </Stack>
        <Stack alignItems="center">
          <Typography fontWeight={600}>{user.name}</Typography>
          <FormHelperText>{user.rol.toUpperCase()}</FormHelperText>
        </Stack>
      </Stack>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
      <Box component="nav">
        <Scrollbar sx={{ height: `calc((100vh) - ${HEADER_HEIGHT}px)`, p: 2 }}>
          <Stack spacing={2}>
            {sidebarList.map((item) => (
              <Stack key={item.title} spacing={1}>
                <FormHelperText sx={{ mb: 1 }}>{item.title.toUpperCase()}</FormHelperText>
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
        borderRadius: 1,
        color: 'var(--NavItem-color)',
        cursor: 'pointer',
        display: 'flex',
        flex: '0 0 auto',
        gap: 1,
        p: '6px 16px',
        position: 'relative',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        ...(active && { bgcolor: 'var(--NavItem-active-background)', color: 'var(--NavItem-active-color)' }),
      }}
    >
      <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
        <Icon />
      </Box>
      <Typography component="span" sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px', flex: '1 1 auto' }}>
        {name}
      </Typography>
    </Box>
  );
}
