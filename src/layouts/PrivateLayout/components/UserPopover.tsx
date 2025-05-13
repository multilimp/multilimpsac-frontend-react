import { useAppContext } from '@/context';
import StorageService from '@/services/storageService';
import { UserProps } from '@/services/users/users';
import { STORAGE_KEY } from '@/utils/constants';
import { AccountBox, Logout } from '@mui/icons-material';
import { Box, Divider, ListItemIcon, MenuItem, MenuList, Popover, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

export function UserPopover({ anchorEl, onClose, open }: Readonly<UserPopoverProps>): React.JSX.Element {
  const { setUser, user } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    StorageService.delete(STORAGE_KEY);
    setUser({} as UserProps);
    navigate('/login');
  };

  const handleRedirect = () => {
    navigate('/profile');
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '240px' } } }}
    >
      <Box sx={{ p: '16px 20px ' }}>
        <Typography variant="subtitle1">{user.nombre}</Typography>
        <Typography color="text.secondary" variant="body2">
          {user.email}
        </Typography>
      </Box>
      <Divider />
      <MenuList disablePadding sx={{ p: '8px', '& .MuiMenuItem-root': { borderRadius: 1 } }}>
        <MenuItem onClick={handleRedirect}>
          <ListItemIcon>
            <AccountBox />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          Cerrar sesión
        </MenuItem>
      </MenuList>
    </Popover>
  );
}
