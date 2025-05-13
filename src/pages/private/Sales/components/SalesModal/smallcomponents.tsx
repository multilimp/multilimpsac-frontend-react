import { Fragment, ReactNode, useState } from 'react';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Alert, Box, Button, Card, CardContent, Collapse, Stack, StepContent, StepLabel } from '@mui/material';
import { FormInstance } from 'antd';

export interface ControlActionsProps {
  next?: VoidFunction;
  back?: VoidFunction;
  dnext?: boolean;
  dback?: boolean;
  form: FormInstance;
}

interface ControlsProps extends ControlActionsProps {
  fieldsToValidate: Array<string>;
}

export const Controls = ({ back, next, dnext, dback, form, fieldsToValidate }: ControlsProps) => {
  const [hasErrors, setHasErrors] = useState(false);

  const handleNext = async () => {
    try {
      setHasErrors(false);
      await form.validateFields({ validateOnly: true });
      next?.();
    } catch (errors: any) {
      const hassErrors = fieldsToValidate.map((item) => errors.values[item]).filter((item) => !item);
      if (hassErrors.length) {
        setHasErrors(true);
        return;
      }
      next?.();
    }
  };

  return (
    <Box mt={2}>
      <Collapse in={hasErrors}>
        <Alert color="error">Completa todos los campos antes de continuar...</Alert>
      </Collapse>

      <Stack direction="row" spacing={2} mt={2}>
        <Button variant="outlined" disabled={dback} onClick={() => back?.()} startIcon={<ArrowBackIos />}>
          Volver
        </Button>
        <Button disabled={dnext} onClick={handleNext} endIcon={<ArrowForwardIos />}>
          Continuar
        </Button>
      </Stack>
    </Box>
  );
};

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
