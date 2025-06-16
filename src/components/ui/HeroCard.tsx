import React from 'react';
import { Card, CardProps } from '@mui/material';
import { heroUIColors, alpha } from '@/styles/theme/heroui-colors';

interface HeroCardProps extends Omit<CardProps, 'variant'> {
  variant?: 'elevated' | 'glass' | 'gradient' | 'bordered' | 'soft';
  glow?: boolean;
  glassEffect?: boolean;
}

export const HeroCard: React.FC<HeroCardProps> = ({ 
  variant = 'elevated', 
  glow = false,
  glassEffect = false,
  children,
  sx,
  ...props 
}) => {

  const getCardStyles = (): any => {
    const baseStyles = {
      borderRadius: heroUIColors.radius.lg,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
      position: 'relative' as const,
      border: 'none',
      '&:hover': {
        transform: 'translateY(-4px)',
      }
    };

    switch (variant) {
      case 'glass':
        return {
          ...baseStyles,
          background: glassEffect 
            ? `linear-gradient(135deg, ${alpha('#ffffff', 0.1)} 0%, ${alpha('#ffffff', 0.05)} 100%)`
            : alpha('#ffffff', 0.1),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha('#ffffff', 0.2)}`,
          boxShadow: heroUIColors.shadows.xl,
          '&:hover': {
            ...baseStyles['&:hover'],
            background: alpha('#ffffff', 0.15),
            boxShadow: heroUIColors.shadows['2xl'],
          }
        };
      
      case 'gradient':
        return {
          ...baseStyles,
          background: heroUIColors.gradients.hero,
          color: 'white',
          boxShadow: `0 20px 40px ${alpha(heroUIColors.primary[500], 0.3)}`,
          '&:hover': {
            ...baseStyles['&:hover'],
            boxShadow: `0 25px 50px ${alpha(heroUIColors.primary[500], 0.4)}`,
          }
        };
      
      case 'bordered':
        return {
          ...baseStyles,
          background: heroUIColors.neutral[50],
          border: `2px solid ${heroUIColors.neutral[200]}`,
          boxShadow: heroUIColors.shadows.md,
          '&:hover': {
            ...baseStyles['&:hover'],
            borderColor: heroUIColors.primary[300],
            boxShadow: `0 8px 25px ${alpha(heroUIColors.primary[500], 0.15)}`,
            background: '#ffffff',
          }
        };
      
      case 'soft':
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${heroUIColors.neutral[50]} 0%, #ffffff 100%)`,
          border: `1px solid ${alpha(heroUIColors.neutral[200], 0.5)}`,
          boxShadow: heroUIColors.shadows.sm,
          '&:hover': {
            ...baseStyles['&:hover'],
            background: '#ffffff',
            boxShadow: heroUIColors.shadows.lg,
            borderColor: heroUIColors.primary[200],
          }
        };
      
      default: // elevated
        return {
          ...baseStyles,
          background: '#ffffff',
          boxShadow: heroUIColors.shadows.lg,
          border: `1px solid ${alpha(heroUIColors.neutral[200], 0.3)}`,
          '&:hover': {
            ...baseStyles['&:hover'],
            boxShadow: heroUIColors.shadows.xl,
            borderColor: alpha(heroUIColors.primary[300], 0.5),
          }
        };
    }
  };

  const glowStyles = glow ? {
    '&::before': {
      content: '""',
      position: 'absolute' as const,
      top: -2,
      left: -2,
      right: -2,
      bottom: -2,
      borderRadius: 'inherit',
      background: heroUIColors.gradients.primary,
      zIndex: -1,
      opacity: 0.6,
      filter: 'blur(8px)',
      transition: 'opacity 0.3s ease',
    },
    '&:hover::before': {
      opacity: 1,
      filter: 'blur(12px)',
    }
  } : {};

  const combinedStyles = {
    ...getCardStyles(),
    ...glowStyles,
    ...sx
  };

  return (
    <Card 
      sx={combinedStyles}
      {...props}
    >
      {children}
    </Card>
  );
};

export default HeroCard;
