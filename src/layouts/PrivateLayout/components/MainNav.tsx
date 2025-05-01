import usePopover from '@/hooks/usePopover';
import { List, Search, VerifiedUserSharp } from '@mui/icons-material';
import { Avatar, Badge, Box, IconButton, Stack, Tooltip } from '@mui/material';
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
        }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={(): void => {
                setOpenNav(true);
              }}
              sx={{ display: { lg: 'none' } }}
            >
              <List />
            </IconButton>
            <Tooltip title="Search">
              <IconButton>
                <Search />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <Tooltip title="Contacts">
              <IconButton>
                <VerifiedUserSharp />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <Badge badgeContent={4} color="success" variant="dot">
                <IconButton>
                  <VerifiedUserSharp />
                </IconButton>
              </Badge>
            </Tooltip>
            <Avatar onClick={userPopover.handleOpen} ref={userPopover.anchorRef} src="/assets/avatar.png" sx={{ cursor: 'pointer' }} />
          </Stack>
        </Stack>
      </Box>

      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />

      <MobileNavigator onClose={() => setOpenNav(false)} open={openNav} />
    </React.Fragment>
  );
};

export default MainNav;
