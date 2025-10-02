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
  resumeButtons?: ReactNode;
  onClickSearch?: VoidFunction;
  showSearchButton?: boolean;
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
  resumeButtons,
  onClickSearch,
  showSearchButton = true,
}: StepItemContentProps) => (
  <Box sx={{ backgroundColor: bgcolor, borderRadius: 2 }}>
    {showHeader ? (
      <Fragment>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }} bgcolor={color} color="#ffffff" px={2} height={32}>
          <Typography component="div" fontSize={12}>
            {headerLeft}
          </Typography>
          <Typography component="div" fontSize={12}>
            {headerRight}
          </Typography>
        </Stack>

        <Stack bgcolor="#2f3a4b" color="#ffffff" p={2} direction="row" justifyContent="space-between" alignItems="center" sx={{
          ...(children ? {} : { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }),
        }}>
          <Stack direction="row" spacing={2}>
            <Stack alignItems="center" justifyContent="center">
              <ResumeIcon sx={{ fontSize: 56, color }} />
            </Stack>

            <Box>
              <Divider orientation="vertical" sx={{ borderColor: color }} />
            </Box>
            <Box>{resumeContent}</Box>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            {showSearchButton && (
              <IconButton
                sx={{
                  border: '1px solid',
                  borderRadius: 1,
                  color,
                  zIndex: 900,
                  padding: 1.5,
                  minWidth: 44,
                  minHeight: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={onClickSearch}
              >
                <ResumeSearchIcon sx={{ fontSize: 20 }} />
              </IconButton>
            )}
            {resumeButtons}
          </Stack>
        </Stack>
      </Fragment>
    ) : null}

    {showFooter && footerContent ? (
      <Stack direction="row" justifyContent="space-between" alignItems="center" bgcolor="#00101e" color="#ffffff" px={2} py={1.5}>
        {footerContent}
      </Stack>
    ) : null}
    {children && (
      <Box sx={
        {
          padding: 4,
          bgcolor: 'white',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          borderBottomLeftRadius: showFooter ? 0 : 16,
          borderBottomRightRadius: showFooter ? 0 : 16,
        }
      }>{children}</Box>
    )}
  </Box>
);
