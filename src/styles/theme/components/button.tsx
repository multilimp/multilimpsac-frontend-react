import type { Components } from '@mui/material/styles';
import type { Theme } from '../types';

export const MuiButton = {
  styleOverrides: {
    root: () => ({
      borderRadius: 16,
      textTransform: 'none',
      boxShadow: 'none',
      fontWeight: 600,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transform: 'translateY(-1px)',
      },
    }),
    sizeSmall: { padding: '6px 16px' },
    sizeMedium: { padding: '8px 20px' },
    sizeLarge: { padding: '10px 24px' },
    textSizeSmall: { padding: '7px 12px' },
    textSizeMedium: { padding: '9px 16px' },
    textSizeLarge: { padding: '12px 16px' },
    containedPrimary: {
      background: 'linear-gradient(45deg, #039354, #04BA6B)',
      '&:hover': {
        background: 'linear-gradient(45deg, #027f47, #03a861)',
      },
    },
    containedSecondary: {
      background: 'linear-gradient(45deg, #1E293B, #3b5179)',
      '&:hover': {
        background: 'linear-gradient(45deg, #0f1a2b, #2d3f60)',
      },
    },
  },
  defaultProps: {
    variant: 'contained',
    size: 'large',
    disableElevation: true,
  },
} satisfies Components<Theme>['MuiButton'];
