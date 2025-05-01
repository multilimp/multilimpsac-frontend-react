import { Button } from '@mui/material';
import { Form, FormInstance } from 'antd';
import React from 'react';

interface SubmitButtonProps {
  form: FormInstance;
  onClick?: VoidFunction;
}

const SubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({ form, children, onClick }) => {
  const [submittable, setSubmittable] = React.useState<boolean>(false);

  // Watch all values
  const values = Form.useWatch([], form);

  React.useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  return (
    <Button type="submit" disabled={!submittable} onClick={onClick}>
      {children}
    </Button>
  );
};

export default SubmitButton;
