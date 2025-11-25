import Logo from '@/components/Logo';
import { Typography } from 'antd';
import LoginForm from './components/LoginForm';

const { Text } = Typography;

const Login = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)',
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Efecto de fondo */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(1, 167, 106, 0.15) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: 420,
          width: '100%',
          zIndex: 1,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: 16,
          padding: 40,
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Logo con nombre */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 40,
          }}
        >
          <Logo size={48} />
          <Text
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.05em',
            }}
          >
            MULTILIMPSAC
          </Text>
        </div>

        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
