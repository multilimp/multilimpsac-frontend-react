
import { ReactNode } from 'react';
import { Grid, Typography, Breadcrumbs, Link as MuiLink, Box, Fade } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import Scrollbar from './Scrollbar';
import { Apps } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import sidebarConfig from '@/layouts/PrivateLayout/sidebarConfig';

interface PageContentProps {
  component?: ReactNode;
  children?: ReactNode;
  title?: string;
  helper?: string;
}

const PageContent = ({ component, children, title, helper }: PageContentProps) => {
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
        <title>{title || (module ? `${module} | ` : '')}MULTILIMP</title>
      </Helmet>

      <Fade in={true} timeout={300}>
        <Grid container spacing={2} justifyContent="space-between" alignItems="center">
          <Grid xs={12} md={component ? 6 : 12}>
            <Breadcrumbs
              sx={{
                '& .MuiBreadcrumbs-ol': {
                  alignItems: 'center',
                },
                mb: 2
              }}
            >
              <MuiLink 
                underline="hover" 
                component={Link} 
                color="inherit" 
                to="/" 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  color: 'text.secondary',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                }}
              >
                <Apps sx={{ mr: 0.5, fontSize: '1rem' }} />
                Dashboard
              </MuiLink>
              {helper ? (
                <Typography 
                  color="inherit"
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                  }}
                >
                  {helper}
                </Typography>
              ) : group ? (
                <Typography 
                  color="inherit"
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                  }}
                >
                  {group}
                </Typography>
              ) : null}
              {module ? (
                <Typography 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: 'primary.main',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  <Icon sx={{ mr: 0.5, fontSize: '1rem' }} />
                  {module}
                </Typography>
              ) : null}
            </Breadcrumbs>

            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                position: 'relative',
                pl: 2,
                pb: 1,
                mb: 3,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  borderRadius: '4px',
                  backgroundColor: 'primary.main',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: '1px',
                  background: 'linear-gradient(90deg, var(--mui-palette-primary-main) 0%, transparent 100%)',
                },
              }}
            >
              {title || module || 'Módulo no definido'}
            </Typography>
          </Grid>
          
          {component && (
            <Grid xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {component}
            </Grid>
          )}
          
          <Grid xs={12}>
            <Box
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                bgcolor: 'background.level1',
                transition: 'all 0.3s ease',
                minHeight: '60vh',
              }}
            >
              <Scrollbar sx={{ 
                height: { xs: 'calc((100vh) - 250px)', lg: 'calc((100vh) - 190px)' },
                p: { xs: 1, sm: 2 }
              }}>
                {children}
              </Scrollbar>
            </Box>
          </Grid>
        </Grid>
      </Fade>
    </>
  );
};

export default PageContent;
