import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Button, Card, CardContent, Stack, StepContent, StepLabel } from '@mui/material';
import { Fragment, ReactNode } from 'react';

export interface ControlsProps {
  next?: VoidFunction;
  back?: VoidFunction;
  dnext?: boolean;
  dback?: boolean;
}

export const Controls = ({ back, next, dnext, dback }: ControlsProps) => (
  <Stack direction="row" spacing={2} mt={4}>
    <Button variant="outlined" disabled={dback} onClick={() => back?.()} startIcon={<ArrowBackIos />}>
      Volver
    </Button>
    <Button disabled={dnext} onClick={() => next?.()} endIcon={<ArrowForwardIos />}>
      Continuar
    </Button>
  </Stack>
);

interface StepItemContentProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  customTitle?: ReactNode;
}

export const StepItemContent = ({ children, title, subtitle, customTitle }: StepItemContentProps) => (
  <Fragment>
    {customTitle}
    {title ? <StepLabel optional={subtitle}>{title}</StepLabel> : null}
    <StepContent slotProps={{ transition: { unmountOnExit: false } }}>
      <Card>
        <CardContent>{children}</CardContent>
      </Card>
    </StepContent>
  </Fragment>
);
