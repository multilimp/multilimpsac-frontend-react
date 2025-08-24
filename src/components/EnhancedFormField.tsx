import React, { useState, useEffect } from 'react';
import { Form, Tooltip } from 'antd';
import { Box, Typography, Fade } from '@mui/material';
import { CheckCircle, Error, Warning, Info, HelpOutline } from '@mui/icons-material';

interface ValidationState {
  status: 'success' | 'warning' | 'error' | 'validating' | '';
  message: string;
}

interface EnhancedFormFieldProps {
  children: React.ReactElement;
  name: string;
  label?: string;
  rules?: any[];
  helpText?: string;
  tooltip?: string;
  realTimeValidation?: (value: any) => ValidationState;
  showValidationIcon?: boolean;
  required?: boolean;
  dependencies?: string[];
  onValueChange?: (value: any, allValues: any) => void;
}

const EnhancedFormField: React.FC<EnhancedFormFieldProps> = ({
  children,
  name,
  label,
  rules = [],
  helpText,
  tooltip,
  realTimeValidation,
  showValidationIcon = true,
  required = false,
  dependencies = [],
  onValueChange
}) => {
  const [validationState, setValidationState] = useState<ValidationState>({
    status: '',
    message: ''
  });
  const [isFocused, setIsFocused] = useState(false);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  const getValidationIcon = () => {
    if (!showValidationIcon || !hasBeenTouched) return null;

    switch (validationState.status) {
      case 'success':
        return <CheckCircle sx={{ color: '#52c41a', fontSize: 16 }} />;
      case 'warning':
        return <Warning sx={{ color: '#faad14', fontSize: 16 }} />;
      case 'error':
        return <Error sx={{ color: '#ff4d4f', fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const getValidationColor = () => {
    switch (validationState.status) {
      case 'success':
        return '#52c41a';
      case 'warning':
        return '#faad14';
      case 'error':
        return '#ff4d4f';
      default:
        return '#d9d9d9';
    }
  };

  const enhancedChildren = React.cloneElement(children, {
    ...children.props,
    onFocus: (e: any) => {
      setIsFocused(true);
      children.props.onFocus?.(e);
    },
    onBlur: (e: any) => {
      setIsFocused(false);
      setHasBeenTouched(true);
      children.props.onBlur?.(e);
    },
    onChange: (e: any) => {
      const value = e?.target?.value ?? e;
      setHasBeenTouched(true);
      
      if (realTimeValidation) {
        const validation = realTimeValidation(value);
        setValidationState(validation);
      }
      
      children.props.onChange?.(e);
      onValueChange?.(value, {});
    },
    style: {
      ...children.props.style,
      borderColor: hasBeenTouched ? getValidationColor() : undefined,
      transition: 'border-color 0.3s ease'
    }
  });

  return (
    <Form.Item
      name={name}
      rules={rules}
      dependencies={dependencies}
      validateTrigger={['onChange', 'onBlur']}
      hasFeedback={showValidationIcon && hasBeenTouched}
    >
      <Box>
        {/* Label personalizado con tooltip */}
        {label && (
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography
              variant="body2"
              fontWeight={500}
              color={required ? 'text.primary' : 'text.secondary'}
            >
              {label}
              {required && (
                <span style={{ color: '#ff4d4f', marginLeft: 4 }}>*</span>
              )}
            </Typography>
            {tooltip && (
              <Tooltip title={tooltip} placement="top">
                <HelpOutline sx={{ fontSize: 14, color: '#8c8c8c', cursor: 'help' }} />
              </Tooltip>
            )}
          </Box>
        )}

        {/* Campo con validación visual */}
        <Box position="relative">
          {enhancedChildren}
          
          {/* Ícono de validación */}
          {showValidationIcon && hasBeenTouched && (
            <Box
              position="absolute"
              right={8}
              top="50%"
              sx={{ transform: 'translateY(-50%)', zIndex: 10 }}
            >
              {getValidationIcon()}
            </Box>
          )}
        </Box>

        {/* Mensaje de validación en tiempo real */}
        <Fade in={hasBeenTouched && validationState.message !== ''}>
          <Box mt={0.5}>
            <Typography
              variant="caption"
              color={
                validationState.status === 'error' ? 'error' :
                validationState.status === 'warning' ? 'warning.main' :
                validationState.status === 'success' ? 'success.main' : 'text.secondary'
              }
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              {validationState.status === 'error' && <Error sx={{ fontSize: 12 }} />}
              {validationState.status === 'warning' && <Warning sx={{ fontSize: 12 }} />}
              {validationState.status === 'success' && <CheckCircle sx={{ fontSize: 12 }} />}
              {validationState.message}
            </Typography>
          </Box>
        </Fade>

        {/* Texto de ayuda */}
        {helpText && !validationState.message && (
          <Box mt={0.5}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Info sx={{ fontSize: 12 }} />
              {helpText}
            </Typography>
          </Box>
        )}

        {/* Indicador de foco */}
        {isFocused && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 2,
              backgroundColor: '#1890ff',
              borderRadius: 1,
              animation: 'pulse 2s infinite'
            }}
          />
        )}
      </Box>
    </Form.Item>
  );
};

export default EnhancedFormField;
