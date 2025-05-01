import { styled } from '@mui/material';

export const MainStyled = styled('main')(() => ({
  minHeight: '100vh',
  width: '100%',
  position: 'relative',
  backgroundImage: `linear-gradient(90deg, rgba(215,231,255,1) 0%, rgba(233,252,255,1) 100%)`,
}));

export const CustomScrollBar = styled('div')(({ theme }) => ({
  '&::-webkit-scrollbar': {
    width: 5,
    height: 5,
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.dark,
    borderRadius: 5,
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: theme.palette.primary.main,
  },
  '&::-webkit-scrollbar-thumb:active': {
    backgroundColor: theme.palette.primary.light,
  },
  '&::-webkit-scrollbar-track': {
    background: '#BBB',
    borderRadius: 5,
  },
  '&::-webkit-scrollbar-track:hover': {
    background: '#AAA',
  },
  '&::-webkit-scrollbar-track:active': {
    background: '#CCC',
  },
}));
