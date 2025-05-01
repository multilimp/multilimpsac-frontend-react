import { Menu } from '@mui/icons-material';
import { Box, Divider, ListItemIcon, MenuItem, MenuList, Popover, Typography } from '@mui/material';

export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

export function UserPopover({ anchorEl, onClose, open }: Readonly<UserPopoverProps>): React.JSX.Element {
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '240px' } } }}
    >
      <Box sx={{ p: '16px 20px ' }}>
        <Typography variant="subtitle1">Sofia Rivers</Typography>
        <Typography color="text.secondary" variant="body2">
          sofia.rivers@devias.io
        </Typography>
      </Box>
      <Divider />
      <MenuList disablePadding sx={{ p: '8px', '& .MuiMenuItem-root': { borderRadius: 1 } }}>
        <MenuItem onClick={onClose}>
          <ListItemIcon>
            <Menu />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={onClose}>
          <ListItemIcon>
            <Menu />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Menu />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </MenuList>
    </Popover>
  );
}
