import { useAppContext } from '@/context';
import StorageService from '@/services/storageService';
import { authUser } from '@/services/users/user.requests';
import { EMAIL_PATTERN, STORAGE_KEY } from '@/utils/constants';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Form, Input, Button, Typography } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const LoginForm = () => {
  const { setUser } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

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
    <div style={{ width: '100%', maxWidth: 380, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Title
          level={2}
          style={{
            margin: 0,
            marginBottom: 8,
            fontWeight: 300,
            fontSize: '2rem',
            color: '#ffffff',
            letterSpacing: '-0.02em',
          }}
        >
          Iniciar Sesión
        </Title>
        <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
          Accede a tu cuenta
        </Text>
      </div>

      {/* Formulario */}
      <Form form={form} onFinish={handleSubmit} layout="vertical" size="large">
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'El email es requerido' },
            { pattern: EMAIL_PATTERN, message: 'Ingrese un email válido' },
          ]}
        >
          <Input
            placeholder="tu.email@multilimp.com"
            autoComplete="username"
            disabled={loading}
            style={{
              height: 52,
              fontSize: 15,
              borderRadius: 8,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'black',
            }}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'La contraseña es requerida' }]}
        >
          <Input.Password
            placeholder="Contraseña"
            autoComplete="current-password"
            disabled={loading}
            iconRender={(visible) =>
              visible ? (
                <EyeOutlined style={{ color: 'black' }} />
              ) : (
                <EyeInvisibleOutlined style={{ color: 'black' }} />
              )
            }
            style={{
              height: 52,
              fontSize: 15,
              borderRadius: 8,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'black',
            }}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 16, marginTop: 32 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{
              height: 52,
              fontSize: 15,
              fontWeight: 500,
              borderRadius: 8,
              backgroundColor: '#10b981',
              border: 'none',
              boxShadow: 'none',
            }}
          >
            {loading ? 'Iniciando...' : 'Ingresar'}
          </Button>
        </Form.Item>
      </Form>

      {/* Link de soporte */}
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Link
          to="/soporte-acceso"
          style={{
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '0.875rem',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
          }}
        >
          ¿Problemas para acceder?
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
