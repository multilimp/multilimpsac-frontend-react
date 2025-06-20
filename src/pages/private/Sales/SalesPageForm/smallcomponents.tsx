import { Fragment, ReactNode } from 'react';
import { Box, Divider, IconButton, Stack, SvgIconTypeMap, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

interface StepItemContentProps {
  children: ReactNode;
  color?: string;
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  ResumeIcon?: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
  ResumeSearchIcon?: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
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
  ResumeSearchIcon = Search,
  color = '#04BA6B',
  resumeContent,
  onClickSearch,
}: StepItemContentProps) => (
  <Box>
    {showHeader ? (
      <Fragment>
        <Stack direction="row" justifyContent="space-between" alignItems="center" bgcolor={color} color="#ffffff" px={2} height={32}>
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
              <ResumeIcon sx={{ fontSize: 56, color }} />
            </Stack>

            <Box>
              <Divider orientation="vertical" sx={{ borderColor: color }} />
            </Box>
            <Box>{resumeContent}</Box>
          </Stack>

          <IconButton 
            sx={{ 
              border: '1px solid', 
              borderRadius: 1, 
              color,
              zIndex: 1200 // Debajo de modales (1300) pero encima del contenido normal
            }} 
            onClick={onClickSearch}
          >
            <ResumeSearchIcon />
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
