import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { heroUIColors, alpha } from '@/styles/theme/heroui-colors';

interface HeroButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'gradient' | 'glass' | 'glow' | 'outlined' | 'ghost' | 'solid';
  glow?: boolean;
  loading?: boolean;
}

export const HeroButton: React.FC<HeroButtonProps> = ({ 
  variant = 'gradient',
  glow = false,
  loading = false,
  children,
  sx,
  disabled,
  ...props 
}) => {
  const getButtonStyles = (): any => {
    const baseStyles = {
      borderRadius: heroUIColors.radius.md,
      textTransform: 'none' as const,
      fontWeight: 600,
      padding: '12px 24px',
      fontSize: '14px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative' as const,
      overflow: 'hidden' as const,
      border: 'none',
      minHeight: '44px',
      
      // Efecto de shimmer
      '&::before': {
        content: '""',
        position: 'absolute' as const,
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        transition: 'left 0.5s',
      },
      '&:hover::before': {
        left: '100%',
      },
      
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: 0.6,
        transform: 'none !important',
      }
    };

    if (disabled || loading) {
      return {
        ...baseStyles,
        opacity: 0.6,
        cursor: 'not-allowed',
        '&:hover': {
          transform: 'none',
        },
        '&:hover::before': {
          left: '-100%',
        }
      };
    }

    switch (variant) {
      case 'gradient':
        return {
          ...baseStyles,
          background: heroUIColors.gradients.success,
          color: 'white',
          boxShadow: `0 4px 15px ${alpha(heroUIColors.success[500], 0.4)}`,
          '&:hover': {
            background: heroUIColors.gradients.success,
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 25px ${alpha(heroUIColors.success[500], 0.6)}`,
          },
        };
      
      case 'glass':
        return {
          ...baseStyles,
          background: alpha('#ffffff', 0.1),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha('#ffffff', 0.2)}`,
          color: heroUIColors.neutral[700],
          boxShadow: heroUIColors.shadows.md,
          '&:hover': {
            background: alpha('#ffffff', 0.2),
            transform: 'translateY(-2px)',
            boxShadow: heroUIColors.shadows.lg,
          },
        };
      
      case 'glow':
        return {
          ...baseStyles,
          background: heroUIColors.primary[500],
          color: 'white',
          boxShadow: `0 0 20px ${alpha(heroUIColors.primary[500], 0.5)}`,
          '&:hover': {
            boxShadow: `0 0 30px ${alpha(heroUIColors.primary[500], 0.8)}`,
            transform: 'translateY(-2px)',
          },
        };
      
      case 'outlined':
        return {
          ...baseStyles,
          background: 'transparent',
          border: `2px solid ${heroUIColors.primary[300]}`,
          color: heroUIColors.primary[600],
          '&:hover': {
            background: heroUIColors.primary[50],
            borderColor: heroUIColors.primary[500],
            transform: 'translateY(-2px)',
            boxShadow: `0 4px 15px ${alpha(heroUIColors.primary[500], 0.2)}`,
          },
        };
      
      case 'ghost':
        return {
          ...baseStyles,
          background: 'transparent',
          color: heroUIColors.primary[600],
          '&:hover': {
            background: heroUIColors.primary[50],
            transform: 'translateY(-2px)',
            boxShadow: heroUIColors.shadows.md,
          },
        };
      
      case 'solid':
        return {
          ...baseStyles,
          background: heroUIColors.primary[500],
          color: 'white',
          boxShadow: heroUIColors.shadows.md,
          '&:hover': {
            background: heroUIColors.primary[600],
            transform: 'translateY(-2px)',
            boxShadow: heroUIColors.shadows.lg,
          },
        };
      
      default:
        return baseStyles;
    }
  };

  const glowWrapperStyles = glow ? {
    filter: `drop-shadow(0 0 10px ${alpha(heroUIColors.primary[500], 0.5)})`,
    '&:hover': {
      filter: `drop-shadow(0 0 20px ${alpha(heroUIColors.primary[500], 0.7)})`,
    }
  } : {};

  const combinedStyles = {
    ...getButtonStyles(),
    ...glowWrapperStyles,
    ...sx
  };

  return (
    <Button 
      sx={combinedStyles}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span 
            style={{
              width: '16px',
              height: '16px',
              border: '2px solid currentColor',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
          Cargando...
        </span>
      ) : children}
    </Button>
  );
};

export default HeroButton;
