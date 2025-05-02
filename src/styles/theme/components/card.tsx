
import { paperClasses } from '@mui/material/Paper';
import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiCard = {
  styleOverrides: {
    root: ({ theme }) => {
      return {
        borderRadius: '16px',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        [`&.${paperClasses.elevation1}`]: {
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 4px 20px 0 rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08)'
              : '0 4px 20px 0 rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.03)',
        },
        '&:hover': {
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 6px 24px 0 rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)'
              : '0 6px 24px 0 rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.04)',
          transform: 'translateY(-2px)',
        },
      };
    },
  },
} satisfies Components<Theme>['MuiCard'];
