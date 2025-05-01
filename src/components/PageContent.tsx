import { ReactNode } from 'react';
import { Grid, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import Scrollbar from './Scrollbar';
import { Apps } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import sidebarConfig from '@/layouts/PrivateLayout/sidebarConfig';

interface PageContentProps {
  component?: ReactNode;
  children?: ReactNode;
}

const PageContent = ({ component, children }: PageContentProps) => {
  const location = useLocation();

  const { Icon, group, module } = sidebarConfig.reduce(
    (acum, next) => {
      const index = next.routes.findIndex((item) => item.path === location.pathname);
      if (index >= 0) {
        acum.group = next.title;
        acum.module = next.routes[index].name;
        acum.Icon = next.routes[index].icon;
      }
      return acum;
    },
    { group: '', module: '', Icon: Apps }
  );

  return (
    <>
      <Helmet>
        <title>{module ? `${module} | ` : ''}MULTILIMPSAC</title>
      </Helmet>

      <Grid container spacing={1.5} justifyContent="space-between" alignItems="center" component="main">
        <Grid>
          <Breadcrumbs>
            <MuiLink underline="hover" component={Link} color="inherit" to="/" sx={{ display: 'flex', alignItems: 'center' }}>
              <Apps sx={{ mr: 0.5 }} fontSize="inherit" />
              Dashboard
            </MuiLink>
            {group ? <Typography color="inherit">{group}</Typography> : null}
            {module ? (
              <Typography sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                <Icon sx={{ mr: 0.5 }} fontSize="inherit" />
                {module}
              </Typography>
            ) : null}
          </Breadcrumbs>

          <Typography
            mt={1}
            variant="h4"
            fontWeight={700}
            sx={{
              borderLeft: '5px solid',
              borderBottom: '1px solid',
              borderColor: 'primary.main',
              pl: 1,
              pr: 5,
              pb: 0.5,
            }}
          >
            {module || 'Modulo no definido'}
          </Typography>
        </Grid>
        {component && <Grid>{component}</Grid>}
        <Grid size={12}>
          <Scrollbar sx={{ height: 'calc((100vh) - 190px)' }}>{children}</Scrollbar>
        </Grid>
      </Grid>
    </>
  );
};

export default PageContent;
