import React from 'react';
import { Avatar, Stack, Typography, SxProps } from '@mui/material';
import { Person, KeyboardArrowDown } from '@mui/icons-material';
import usePopover from '@/hooks/usePopover';
import { useAppContext } from '@/context';
import { UserPopover } from './UserPopover';

interface ProfileButtonProps {
  showName?: boolean;
  nameOverride?: string;
  avatarSrcOverride?: string;
  sx?: SxProps;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ showName = true, nameOverride, avatarSrcOverride, sx }) => {
  const { user } = useAppContext();
  const userPopover = usePopover<HTMLDivElement>();

  const displayName = nameOverride ?? user?.nombre ?? 'Usuario';
  const avatarSrc = avatarSrcOverride ?? user?.foto ?? '/assets/avatar.png';

  const handleOpen = () => userPopover.handleOpen();

  return (
    <React.Fragment>
      <Stack direction="row" spacing={1} alignItems="center" sx={sx}>
        <Avatar
          onClick={handleOpen}
          ref={userPopover.anchorRef}
          src={avatarSrc}
          sx={{
            cursor: 'pointer',
            border: '2px solid',
            borderColor: 'primary.main',
            transition: 'transform 0.2s ease',
            '&:hover': { transform: 'scale(1.05)' },
          }}
        >
          <Person />
        </Avatar>
        {showName && (
          <Typography
            variant="body2"
            sx={{ cursor: 'pointer', fontWeight: 600 }}
            onClick={handleOpen}
          >
            {displayName}
          </Typography>
        )}
        <KeyboardArrowDown fontSize="small" onClick={handleOpen} sx={{ cursor: 'pointer' }} />
      </Stack>
      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
    </React.Fragment>
  );
};

export default ProfileButton;