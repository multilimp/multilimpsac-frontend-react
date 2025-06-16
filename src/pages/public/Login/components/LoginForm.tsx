import { useAppContext } from '@/context';
import StorageService from '@/services/storageService';
import { authUser } from '@/services/users/user.requests';
import { EMAIL_PATTERN, STORAGE_KEY } from '@/utils/constants';
import { HeroButton } from '@/components/ui/HeroButton';
import { HeroInput } from '@/components/ui/HeroInput';
import { heroUIColors, alpha } from '@/styles/theme/heroui-colors';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { Box, CardContent, IconButton, Stack, Typography, Button } from '@mui/material';
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
    <Box sx={{ p: 0 }}>
      {/* Header estilizado */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 800,
            background: heroUIColors.gradients.primary,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          Iniciar Sesión
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: heroUIColors.neutral[600],
            fontWeight: 400,
          }}
        >
          Ingrese sus credenciales para continuar
        </Typography>
      </Box>

      <CardContent sx={{ p: 4 }}>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'El email es requerido' },
              { pattern: EMAIL_PATTERN, message: 'Ingrese un email válido' },
            ]}
          >
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 1, 
                  color: heroUIColors.neutral[700] 
                }}
              >
                Email
              </Typography>
              <HeroInput 
                variant="soft"
                heroSize="large"
                placeholder="ejemplo@multilimp.com"
                autoComplete="username" 
                disabled={loading}
              />
            </Box>
          </Form.Item>

          <Form.Item 
            name="password" 
            rules={[{ required: true, message: 'La contraseña es requerida' }]}
          >
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 1, 
                  color: heroUIColors.neutral[700] 
                }}
              >
                Contraseña
              </Typography>
              <HeroInput
                variant="soft"
                heroSize="large"
                placeholder="Ingrese su contraseña"
                autoComplete="password"
                type={show ? 'text' : 'password'}
                suffix={
                  <IconButton 
                    size="small" 
                    onClick={() => setShow(!show)} 
                    disabled={loading}
                    sx={{
                      color: heroUIColors.neutral[500],
                      '&:hover': {
                        color: heroUIColors.primary[500],
                        background: alpha(heroUIColors.primary[500], 0.1),
                      }
                    }}
                  >
                    {show ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                }
                disabled={loading}
              />
            </Box>
          </Form.Item>

          <HeroButton 
            variant="gradient"
            glow
            loading={loading}
            type="submit"
            style={{ 
              width: '100%',
              height: '48px',
              fontSize: '16px',
              fontWeight: 600,
              marginBottom: '16px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LoginIcon />
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Box>
          </HeroButton>
        </Form>

        <Stack justifyContent="center" alignItems="center" mt={2}>
          <Button 
            component={Link} 
            to="/recovery-password" 
            variant="text"
            sx={{
              color: heroUIColors.neutral[600],
              textTransform: 'none',
              fontWeight: 500,
              textDecoration: 'none',
              '&:hover': {
                color: heroUIColors.primary[500],
                background: 'transparent',
                textDecoration: 'underline',
              }
            }}
          >
            ¿Olvidaste tu contraseña?
          </Button>
        </Stack>

        {/* Información adicional */}
        <Box 
          sx={{ 
            mt: 4, 
            p: 2, 
            borderRadius: heroUIColors.radius.md,
            background: alpha(heroUIColors.primary[50], 0.5),
            border: `1px solid ${alpha(heroUIColors.primary[200], 0.3)}`,
          }}
        >
          <Typography 
            variant="caption" 
            sx={{ 
              color: heroUIColors.neutral[600],
              display: 'block',
              textAlign: 'center',
              lineHeight: 1.4,
            }}
          >
            🔒 Conexión segura mediante SSL<br/>
            💼 Sistema ERP empresarial
          </Typography>
        </Box>
      </CardContent>
    </Box>
  );
};

export default LoginForm;
