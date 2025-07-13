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
  footerContent?: ReactNode;
  ResumeIcon?: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
  ResumeSearchIcon?: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
  resumeContent?: ReactNode;
  onClickSearch?: VoidFunction;
  bgcolor?: string;
}

export const StepItemContent = ({
  children,
  headerLeft,
  headerRight,
  showHeader,
  showFooter,
  footerContent,
  ResumeIcon = Search,
  ResumeSearchIcon = Search,
  color = '#04BA6B',
  bgcolor = 'white',
  resumeContent,
  onClickSearch,
}: StepItemContentProps) => (
  <Box sx={{ backgroundColor: bgcolor, borderRadius: 2 }}>
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
              zIndex: 900 
            }} 
            onClick={onClickSearch}
          >
            <ResumeSearchIcon />
          </IconButton>
        </Stack>
      </Fragment>
    ) : null}

    {showFooter && footerContent ? (
      <Stack direction="row" justifyContent="space-between" alignItems="center" bgcolor="#00101e" color="#ffffff" px={2} py={1.5}>
        {footerContent}
      </Stack>
    ) : null}
    <Box p={2}>{children}</Box>
  </Box>
);
