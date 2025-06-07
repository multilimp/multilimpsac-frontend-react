import { Fragment, ReactNode } from 'react';
import { Box, Divider, IconButton, Stack, SvgIconTypeMap, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

interface StepItemContentProps {
  children: ReactNode;
  color?: 'primary' | 'info';
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  ResumeIcon?: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
  resumeContent?: ReactNode;
  onClickSearch?: VoidFunction;
}

export const StepItemContent = ({
  children,
  headerLeft,
  headerRight,
  showHeader,
  showFooter,
  ResumeIcon = Search,
  color = 'primary',
  resumeContent,
  onClickSearch,
}: StepItemContentProps) => (
  <Box border="1px solid #f2f2f2" boxShadow="0 3px 20px -15px rgba(0,0,0,0.75);">
    {showHeader ? (
      <Fragment>
        <Stack direction="row" justifyContent="space-between" alignItems="center" bgcolor={`${color}.main`} color="#ffffff" px={2} height={32}>
          <Typography component="div" fontSize={12}>
            {headerLeft}
          </Typography>
          <Typography component="div" fontSize={12}>
            {headerRight}
          </Typography>
        </Stack>

        <Stack bgcolor="#2f3a4b" color="#ffffff" p={2} direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2}>
            <Stack alignItems="center" justifyContent="center">
              <ResumeIcon sx={{ fontSize: 56 }} color={color} />
            </Stack>

            <Box>
              <Divider orientation="vertical" sx={{ borderColor: `${color}.main` }} />
            </Box>
            <Box>{resumeContent}</Box>
          </Stack>

          <IconButton color={color} sx={{ border: '1px solid', borderRadius: 1 }} onClick={onClickSearch}>
            <Search />
          </IconButton>
        </Stack>
      </Fragment>
    ) : null}

    {showFooter ? (
      <Stack direction="row" justifyContent="space-between" alignItems="center" bgcolor="#00101e" color="#ffffff" px={2} py={1.5}>
        <Typography component="span" fontSize={13} color="#ccc">
          Código UE:
        </Typography>
        <Typography component="span" fontSize={13} color="#ccc">
          Dependencia:
        </Typography>
      </Stack>
    ) : null}
    <Box p={2}>{children}</Box>
  </Box>
);
