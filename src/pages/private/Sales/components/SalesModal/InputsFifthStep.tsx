import { Fragment } from 'react';
import { Form, Input } from 'antd';
import { ControlActionsProps, Controls, StepItemContent } from './smallcomponents';
import { requiredField } from './InputsFirstStep';
import { Button, Fab, FormHelperText, Stack } from '@mui/material';
import { Delete } from '@mui/icons-material';

interface InputsFifthStepProps extends ControlActionsProps {}

const InputsFifthStep = ({ form, next, ...controlProps }: InputsFifthStepProps) => {
  const handleFinalValidation = () => {
    form.validateFields().then(() => next?.());
  };

  return (
    <StepItemContent title="PRODUCTOS" subtitle="Ingrese todos los productos">
      <Form.List
        name="productos"
        initialValue={['']}
        rules={[
          {
            validator(_, arr) {
              if (!arr.length) {
                return Promise.reject(new Error('Debe ingresar por lo menos 1 producto para continuar.'));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <Fragment>
            {fields.map((field) => (
              <Stack key={field.name} direction="row" spacing={2}>
                <Form.Item name={[field.name]} rules={[requiredField]} className="flex-1">
                  <Input.TextArea placeholder="Ingrese cualquier observación relevante" autoSize style={{ minHeight: 75 }} />
                </Form.Item>
                <Fab size="small" color="error" sx={{ mt: 2 }} onClick={() => remove(field.name)}>
                  <Delete />
                </Fab>
              </Stack>
            ))}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              {errors.length ? <FormHelperText error>{(errors as Array<string>).join(' - ')}</FormHelperText> : null}
              <Button size="medium" color="warning" variant="outlined" onClick={() => add('')}>
                AGREGAR PRODUCTO
              </Button>
            </Stack>
          </Fragment>
        )}
      </Form.List>

      <Controls fieldsToValidate={['productos']} next={handleFinalValidation} form={form} {...controlProps} />
    </StepItemContent>
  );
};

export default InputsFifthStep;
