import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiStack = { 
  defaultProps: { useFlexGap: true },
  // Removemos styleOverrides para que solo se aplique cuando uses las clases CSS o sx prop
} satisfies Components<Theme>['MuiStack'];
