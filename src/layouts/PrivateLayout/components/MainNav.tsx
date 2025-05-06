
import usePopover from '@/hooks/usePopover';
import { List, Search, Notifications, Person } from '@mui/icons-material';
import { Avatar, Badge, Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { UserPopover } from './UserPopover';
import MobileNavigator from './MobileNavigator';

const MainNav = () => {
  const [openNav, setOpenNav] = React.useState<boolean>(false);

  const userPopover = usePopover<HTMLDivElement>();

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Stack 
          direction="row" 
          spacing={2} 
          sx={{ 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            minHeight: '64px', 
            px: 3 
          }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={(): void => {
                setOpenNav(true);
              }}
              sx={{ 
                display: { lg: 'none' },
                bgcolor: 'rgba(0, 0, 0, 0.03)',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.06)' }
              }}
            >
              <List />
            </IconButton>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                borderRadius: '8px',
                bgcolor: 'rgba(0, 0, 0, 0.03)',
                p: '6px 12px',
              }}
            >
              <Search sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Buscar...
              </Typography>
            </Box>
          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <Tooltip title="Notificaciones">
              <IconButton 
                sx={{ 
                  bgcolor: 'rgba(0, 0, 0, 0.03)',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.06)' }
                }}
              >
                <Badge badgeContent={4} color="primary">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
            <Avatar 
              onClick={userPopover.handleOpen} 
              ref={userPopover.anchorRef} 
              src="/assets/avatar.png" 
              sx={{ 
                cursor: 'pointer',
                border: '2px solid',
                borderColor: 'primary.main',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}
            >
              <Person />
            </Avatar>
          </Stack>
        </Stack>
      </Box>

      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />

      <MobileNavigator onClose={() => setOpenNav(false)} open={openNav} />
    </React.Fragment>
  );
};

export default MainNav;
