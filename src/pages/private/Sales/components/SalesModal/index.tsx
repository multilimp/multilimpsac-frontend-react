import { useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, Fab, Stack, Step, Stepper, Typography } from '@mui/material';
import { Form } from 'antd';
import { Close } from '@mui/icons-material';
import { SaleProps } from '@/services/sales/sales';
import InputsFirstStep from './InputsFirstStep';
import InputsSecondStep from './InputsSecondStep';
import InputsThirdStep from './InputsThirdStep';
import InputsFourthStep from './InputsFourthStep';
import InputsFifthStep from './InputsFifthStep';

interface SalesModalProps {
  data?: SaleProps;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Partial<SaleProps>;
}

// const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
// const calculatedTax = subtotal * 0.18; // 18% IGV
// const tax = calculatedTax
// const total = subtotal + calculatedTax

const SalesModal = ({ data, onClose, onSuccess, initialData }: SalesModalProps) => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1);

  const handleNext = (qty?: number) => setStep(step + (qty ?? 1));
  const handleBack = (qty?: number) => setStep(step - (qty ?? 1));

  return (
    <Dialog open fullScreen>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h5" color="primary">
            REGISTRAR NUEVA VENTA
          </Typography>
          <Fab onClick={onClose} size="small">
            <Close />
          </Fab>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Form form={form}>
          <Stepper activeStep={step} orientation="vertical">
            <Step active={step === 1}>
              <InputsFirstStep form={form} dback next={handleNext} />
            </Step>

            <Step active={step === 2}>
              <InputsSecondStep form={form} back={handleBack} next={handleNext} />
            </Step>

            <Step active={step === 3}>
              <InputsThirdStep form={form} back={handleBack} next={handleNext} />
            </Step>

            <Step active={step === 4}>
              <InputsFourthStep form={form} back={handleBack} next={handleNext} />
            </Step>

            <Step active={step === 5}>
              <InputsFifthStep form={form} back={handleBack} next={handleNext} />
            </Step>
          </Stepper>

          {step === 6 && (
            <Stack alignItems="center" justifyContent="center" my={5}>
              <Typography variant="h5">Completaste todos los pasos correctamante</Typography>
              <Stack direction="row" mt={3} spacing={2}>
                <Button variant="outlined" onClick={() => handleBack()}>
                  Volver al último paso
                </Button>
                <Button type="submit">Finalizar y registrar venta</Button>
              </Stack>
            </Stack>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SalesModal;
