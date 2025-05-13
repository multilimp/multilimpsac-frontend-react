import React from 'react';
import Loader from '@/router/Loader';
import { Box, Stack } from '@mui/material';

const LoaderPage = () => {
  return (
    <React.Fragment>
      <Loader />
      <Stack
        height="100vh"
        width="100%"
        justifyContent="center"
        alignItems="center"
        bgcolor="red"
        sx={{ background: 'linear-gradient(135deg,rgba(4, 186, 107, 1) 25%, rgba(255, 255, 255, 1) 100%);' }}
      >
        <Box width={200} height={200} className="zoom-in">
          <Box component="img" src="/images/multilimp-logo.svg" alt="Logo" />
        </Box>
      </Stack>
    </React.Fragment>
  );
};

export default LoaderPage;
