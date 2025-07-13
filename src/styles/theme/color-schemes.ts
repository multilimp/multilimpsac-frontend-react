import type { ColorSystemOptions } from '@mui/material/styles';

import { california, kepple, multilimpBlue, redOrange, shakespeare, stormGrey } from './colors';
import type { ColorScheme } from './types';

export const colorSchemes = {
  dark: {
    palette: {
      action: { disabledBackground: 'rgba(0, 0, 0, 0.12)' },
      background: {
        default: 'var(--mui-palette-neutral-950)',
        defaultChannel: '9 10 11',
        paper: 'var(--mui-palette-neutral-900)',
        paperChannel: '19 78 72',
        level1: 'var(--mui-palette-neutral-800)',
        level2: 'var(--mui-palette-neutral-700)',
        level3: 'var(--mui-palette-neutral-600)',
      },
      common: { black: '#000000', white: '#ffffff' },
      divider: 'var(--mui-palette-neutral-700)',
      dividerChannel: '50 56 62',
      error: {
        ...redOrange,
        light: redOrange[300],
        main: redOrange[400],
        dark: redOrange[500],
        contrastText: 'var(--mui-palette-common-black)',
      },
      info: {
        ...shakespeare,
        light: shakespeare[300],
        main: shakespeare[400],
        dark: shakespeare[500],
        contrastText: 'var(--mui-palette-common-black)',
      },
      neutral: { ...multilimpBlue },
      primary: {
        light: '#3B6EF6',
        main: '#3B6EF6', // color corporativo HeroUI azul
        dark: '#306df7',
        contrastText: 'var(--mui-palette-common-white)',
      },
      secondary: {
        ...multilimpBlue,
        light: multilimpBlue[600],
        main: multilimpBlue[800],
        dark: multilimpBlue[900],
        contrastText: 'var(--mui-palette-common-white)',
      },
      success: {
        ...kepple,
        light: kepple[300],
        main: kepple[400],
        dark: kepple[500],
        contrastText: 'var(--mui-palette-common-black)',
      },
      text: {
        primary: 'var(--mui-palette-neutral-100)',
        primaryChannel: '240 244 248',
        secondary: 'var(--mui-palette-neutral-400)',
        secondaryChannel: '159 166 173',
        disabled: 'var(--mui-palette-neutral-600)',
      },
      warning: {
        ...california,
        light: california[300],
        main: california[400],
        dark: california[500],
        contrastText: 'var(--mui-palette-common-black)',
      },
    },
  },
  light: {
    palette: {
      action: { disabledBackground: 'rgba(0, 0, 0, 0.06)' },
      background: {
        default: '#f8fafc', // Lighter background for better contrast
        defaultChannel: '248 250 252',
        paper: 'var(--mui-palette-common-white)',
        paperChannel: '255 255 255',
        level1: 'var(--mui-palette-neutral-50)',
        level2: 'var(--mui-palette-neutral-100)',
        level3: 'var(--mui-palette-neutral-200)',
      },
      common: { black: '#000000', white: '#ffffff' },
      divider: '#e2e8f0', // Softer divider
      dividerChannel: '226 232 240',
      error: {
        ...redOrange,
        light: redOrange[400],
        main: redOrange[500],
        dark: redOrange[600],
        contrastText: 'var(--mui-palette-common-white)',
      },
      info: {
        ...shakespeare,
        light: shakespeare[400],
        main: shakespeare[500],
        dark: shakespeare[600],
        contrastText: 'var(--mui-palette-common-white)',
      },
      neutral: { ...stormGrey },
      primary: {
        light: '#3B6EF6',
        main: '#3B6EF6', // color corporativo HeroUI azul
        dark: '#306df7',
        contrastText: 'var(--mui-palette-common-white)',
      },
      secondary: {
        ...multilimpBlue,
        light: multilimpBlue[700],
        main: multilimpBlue[800], // #1E293B - brand color
        dark: multilimpBlue[900],
        contrastText: 'var(--mui-palette-common-white)',
      },
      success: {
        ...kepple,
        light: kepple[400],
        main: kepple[500],
        dark: kepple[600],
        contrastText: 'var(--mui-palette-common-white)',
      },
      text: {
        primary: multilimpBlue[800], // Using brand blue for text
        primaryChannel: '30 41 59',
        secondary: 'var(--mui-palette-neutral-500)',
        secondaryChannel: '102 112 133',
        disabled: 'var(--mui-palette-neutral-400)',
      },
      warning: {
        ...california,
        light: california[400],
        main: california[500],
        dark: california[600],
        contrastText: 'var(--mui-palette-common-white)',
      },
    },
  },
} satisfies Partial<Record<ColorScheme, ColorSystemOptions>>;
