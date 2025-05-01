import { CustomScrollBar } from '@/styles/styled';
import { Theme } from '@emotion/react';
import { SxProps } from '@mui/material';
import { ReactNode } from 'react';

interface ScrollbarProps {
  children: ReactNode;
  sx: SxProps<Theme>;
}

const Scrollbar = ({ children, sx }: ScrollbarProps) => <CustomScrollBar sx={{ overflowY: 'auto', ...sx }}>{children}</CustomScrollBar>;

export default Scrollbar;
