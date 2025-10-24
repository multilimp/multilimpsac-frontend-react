import { ReactNode, useEffect } from 'react';
import { Box, Breadcrumbs, Fade, Link as MuiLink, Typography } from '@mui/material';
import ProfileButton from '@/layouts/PrivateLayout/components/ProfileButton';

import Scrollbar from './Scrollbar';
import { Apps } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import sidebarConfig from '@/layouts/PrivateLayout/sidebarConfig';

interface PageContentProps {
  children?: ReactNode;
  title?: string;
  helper?: string;
}

const appName = 'MULTILIMP';

const PageContent = ({ children, title }: PageContentProps) => {
  const location = useLocation();

  useEffect(() => {
    document.title = `${title || module ? `${title || module} | ` : ''}${appName}`;
    return () => {
      document.title = appName;
    };
  }, [title]);

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

  const displayTitle = title || module || 'Módulo no definido';

  return (
    <Fade in={true} timeout={300}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%', minHeight: 'calc(100vh - 140px)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <Breadcrumbs sx={{ mb: 2 }}>
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
              {group ? (
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
              {displayTitle ? (
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
                  {displayTitle}
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
              {displayTitle}
            </Typography>
          </Box>

          <Box sx={{ width: { xs: '100%', md: '50%' }, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
            <ProfileButton showName={false} />
          </Box>
        </Box>

        <Scrollbar sx={{ flex: 1, minHeight: 0, pr: 2 }}>
          <Box sx={{ width: '100%' }}>{children}</Box>
        </Scrollbar>
      </Box>
    </Fade>
  );
};

export default PageContent;
