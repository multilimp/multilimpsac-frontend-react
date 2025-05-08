import { Form, FormInstance, Input } from 'antd';
import { Controls, ControlsProps, StepItemContent } from './smallcomponents';
import { requiredField } from './InputsFirstStep';

interface InputsFifthStepProps extends ControlsProps {
  form: FormInstance;
}

const InputsFifthStep = ({ form, ...controlProps }: InputsFifthStepProps) => {
  return (
    <StepItemContent title="PRODUCTOS" subtitle="Ingrese todos los productos">
      <Form.Item name="value" rules={[requiredField]}>
        <Input.TextArea placeholder="Ingrese cualquier observación relevante" autoSize style={{ minHeight: 75 }} />
      </Form.Item>
      <Form.Item name="value" rules={[requiredField]}>
        <Input.TextArea placeholder="Ingrese cualquier observación relevante" autoSize style={{ minHeight: 75 }} />
      </Form.Item>
      <Form.Item name="value" rules={[requiredField]}>
        <Input.TextArea placeholder="Ingrese cualquier observación relevante" autoSize style={{ minHeight: 75 }} />
      </Form.Item>

      <Controls {...controlProps} />
    </StepItemContent>
  );
};

export default InputsFifthStep;
