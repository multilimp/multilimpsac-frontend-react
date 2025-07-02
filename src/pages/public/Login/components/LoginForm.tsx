import { useAppContext } from '@/context';
import StorageService from '@/services/storageService';
import { authUser } from '@/services/users/user.requests';
import { EMAIL_PATTERN, STORAGE_KEY } from '@/utils/constants';
import { HeroInput } from '@/components/ui/HeroInput';
import { heroUIColors } from '@/styles/theme/heroui-colors';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography, Button } from '@mui/material';
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
    <Box 
      sx={{ 
        width: '100%',
        maxWidth: '380px',
        mx: 'auto',
        my: 5,
        p: 0,
      }}
    >
      {/* Header ultra minimalista */}
      <Stack spacing={0.5} sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 300,
            fontSize: '2rem',
            color: heroUIColors.neutral[800],
            letterSpacing: '-0.02em',
          }}
        >
          Iniciar Sesión
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: heroUIColors.neutral[500],
            fontWeight: 400,
            fontSize: '0.875rem',
          }}
        >
          Accede a tu cuenta
        </Typography>
      </Stack>

      {/* Formulario limpio */}
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Stack spacing={4}>
          {/* Campo Email - Sin label visible */}
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'El email es requerido' },
              { pattern: EMAIL_PATTERN, message: 'Ingrese un email válido' },
            ]}
          >
            <HeroInput 
              variant="soft"
              heroSize="large"
              placeholder="tu.email@multilimp.com"
              autoComplete="username" 
              disabled={loading}
              style={{
                fontSize: '15px',
                padding: '16px 20px',
                border: `1px solid ${heroUIColors.neutral[200]}`,
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                transition: 'all 0.2s ease',
              }}
            />
          </Form.Item>

          {/* Campo Contraseña - Sin label visible */}
          <Form.Item 
            name="password" 
            rules={[{ required: true, message: 'La contraseña es requerida' }]}
          >
            <HeroInput
              variant="soft"
              heroSize="large"
              placeholder="Contraseña"
              autoComplete="current-password"
              type={show ? 'text' : 'password'}
              suffix={
                <IconButton 
                  size="small" 
                  onClick={() => setShow(!show)} 
                  disabled={loading}
                  sx={{
                    color: heroUIColors.neutral[400],
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: heroUIColors.neutral[600],
                      backgroundColor: 'transparent',
                    }
                  }}
                >
                  {show ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                </IconButton>
              }
              disabled={loading}
              style={{
                fontSize: '15px',
                padding: '16px 20px',
                border: `1px solid ${heroUIColors.neutral[200]}`,
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                transition: 'all 0.2s ease',
              }}
            />
          </Form.Item>

          {/* Botón de envío ultra limpio */}
          <Button
            type="submit"
            disabled={loading}
            onClick={() => form.submit()}
            sx={{
              width: '100%',
              height: '48px',
              fontSize: '15px',
              fontWeight: 500,
              borderRadius: '8px',
              backgroundColor: heroUIColors.neutral[900],
              color: '#ffffff',
              textTransform: 'none',
              border: 'none',
              boxShadow: 'none',
              transition: 'all 0.2s ease',
              
              '&:hover': {
                backgroundColor: heroUIColors.neutral[800],
                boxShadow: 'none',
                transform: 'none',
              },
              
              '&:active': {
                backgroundColor: heroUIColors.neutral[900],
                transform: 'scale(0.98)',
              },
              
              '&:disabled': {
                backgroundColor: heroUIColors.neutral[300],
                color: heroUIColors.neutral[500],
                cursor: 'not-allowed',
              }
            }}
          >
            {loading ? 'Iniciando...' : 'Continuar'}
          </Button>
        </Stack>
      </Form>

      {/* Link de recuperación ultra sutil */}
      <Stack alignItems="center" sx={{ mt: 4 }}>
        <Button 
          component={Link} 
          to="/recovery-password" 
          variant="text"
          size="small"
          sx={{
            color: heroUIColors.neutral[500],
            textTransform: 'none',
            fontWeight: 400,
            fontSize: '0.875rem',
            textDecoration: 'none',
            padding: '4px 8px',
            
            '&:hover': {
              color: heroUIColors.neutral[700],
              backgroundColor: 'transparent',
              textDecoration: 'none',
            }
          }}
        >
          ¿Olvidaste tu contraseña?
        </Button>
      </Stack>
    </Box>
  );
};

export default LoginForm;
