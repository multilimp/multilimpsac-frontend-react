import InputAntd from '@/components/InputAntd';
import { useAppContext } from '@/context';
import StorageService from '@/services/storageService';
import { authUser } from '@/services/users/user.requests';
import { EMAIL_PATTERN, STORAGE_KEY } from '@/utils/constants';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, Card, CardContent, CardHeader, IconButton, Stack } from '@mui/material';
import { Form } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { setUser } = useAppContext();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // TODO: Eliminar este useEffect
  useEffect(() => {
    form.setFieldsValue({
      email: 'usuario@example.com',
      password: 'passwordSeguro123',
    });
  }, []);

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      setLoading(true);

      const { token, user } = await authUser(values);

      setUser({ ...user });
      StorageService.set(STORAGE_KEY, token);
      navigate('/');
    } catch (error) {
      form.setFields([
        { name: 'email', errors: ['Email incorrecto'] },
        { name: 'password', errors: ['Contraseña incorrecta'] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Iniciar Sesión"
        subheader="Ingrese sus credenciales para continuar"
        slotProps={{ title: { variant: 'h4', fontWeight: 700 }, subheader: { variant: 'body1' } }}
      />
      <CardContent>
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'El email es requerido' },
              { pattern: EMAIL_PATTERN, message: 'Ingrese un email válido' },
            ]}
          >
            <InputAntd label="Email" autoComplete="username" disabled={loading} />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'La contraseña es requerida' }]}>
            <InputAntd
              label="Contraseña"
              autoComplete="password"
              type={show ? 'text' : 'password'}
              suffix={
                <IconButton size="small" onClick={() => setShow(!show)} disabled={loading}>
                  {show ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              }
              style={{ paddingTop: 0, paddingBottom: 0 }}
              disabled={loading}
            />
          </Form.Item>

          <Button type="submit" fullWidth sx={{ mt: 2 }} loading={loading}>
            Sign in
          </Button>
        </Form>

        <Stack justifyContent="flex-end" alignItems="flex-end" mt={2}>
          <Button component={Link} to="/recovery-password" variant="text">
            ¿Olvidaste tu contraseña?
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
