import { ReactNode } from 'react';
import { Grid, Typography, FormHelperText } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import Scrollbar from './Scrollbar';

interface PageContentProps {
  title: string;
  helper: string;
  component?: ReactNode;
  children: ReactNode;
}

const PageContent = ({ title, helper, component, children }: PageContentProps) => (
  <>
    <Helmet>
      <title>{title}</title>
    </Helmet>

    <Grid container spacing={1.5} justifyContent="space-between" alignItems="center" component="main">
      <Grid>
        {helper && <FormHelperText>{helper}</FormHelperText>}
        {title && <Typography variant="h4">{title}</Typography>}
      </Grid>
      {component && <Grid>{component}</Grid>}
      <Grid size={12}>
        <Scrollbar sx={{ height: 'calc((100vh) - 170px)' }}>{children}</Scrollbar>
      </Grid>
    </Grid>
  </>
);

export default PageContent;
