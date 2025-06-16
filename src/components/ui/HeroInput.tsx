import React from 'react';
import { Input, InputProps, Select, SelectProps } from 'antd';
import './HeroInput.css';

interface HeroInputProps extends Omit<InputProps, 'variant'> {
  variant?: 'default' | 'glass' | 'gradient' | 'soft';
  heroSize?: 'small' | 'medium' | 'large';
}

interface HeroSelectProps extends Omit<SelectProps, 'variant'> {
  variant?: 'default' | 'glass' | 'gradient' | 'soft';
  heroSize?: 'small' | 'medium' | 'large';
}

export const HeroInput: React.FC<HeroInputProps> = ({ 
  variant = 'default',
  heroSize = 'medium',
  className,
  ...props 
}) => {
  const getInputClass = () => {
    const baseClass = 'hero-input';
    const variantClass = `hero-input-${variant}`;
    const sizeClass = `hero-input-${heroSize}`;
    
    return `${baseClass} ${variantClass} ${sizeClass} ${className || ''}`.trim();
  };

  return (
    <Input 
      className={getInputClass()}
      {...props}
    />
  );
};

export const HeroSelect: React.FC<HeroSelectProps> = ({ 
  variant = 'default',
  heroSize = 'medium',
  className,
  ...props 
}) => {
  const getSelectClass = () => {
    const baseClass = 'hero-select';
    const variantClass = `hero-select-${variant}`;
    const sizeClass = `hero-select-${heroSize}`;
    
    return `${baseClass} ${variantClass} ${sizeClass} ${className || ''}`.trim();
  };

  return (
    <Select 
      className={getSelectClass()}
      {...props}
    />
  );
};

export { Input as AntInput, Select as AntSelect };
