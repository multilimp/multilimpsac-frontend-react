import { Input, InputNumber } from 'antd';
import { useState } from 'react';

type CommonProps = {
  label?: string;
  isFloating?: boolean;
  className?: string;
  hasError?: boolean;
  isAddonBefore?: boolean;
  size?: 'large' | 'middle' | 'small';
  placeholder?: string;
  style?: React.CSSProperties;
};

interface TextInputProps extends CommonProps {
  type?: 'text' | 'password' | 'email' | 'url' | 'tel';
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  maxLength?: number;
  autoComplete?: string;
  bordered?: boolean;
}

interface TextAreaInputProps extends CommonProps {
  type: 'textarea';
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  maxLength?: number;
  rows?: number;
}

interface NumberInputProps extends CommonProps {
  type: 'number';
  value?: number;
  defaultValue?: number;
  onChange?: (value: number | null) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
}

type InputAntdProps = TextInputProps | TextAreaInputProps | NumberInputProps;

const InputAntd = (props: InputAntdProps) => {
  const { label, isFloating, isAddonBefore, hasError, size = 'large', className } = props;
  const [focus, setFocus] = useState(false);

  let value = '';
  if ('value' in props && props.value !== undefined) {
    value = String(props.value);
  }

  const isDisabled = 'disabled' in props && props.disabled;

  const isFloatingAux = focus || (value && value.length !== 0);
  let labelClass = isFloatingAux || isFloating ? 'label label-float' : 'label';
  labelClass += size ? ` ${size}` : ' middle';
  labelClass += focus ? ' focus' : '';
  labelClass += hasError || ('aria-invalid' in props && props['aria-invalid'] === 'true') ? ' error' : '';
  labelClass += isDisabled ? ' disabled' : '';
  labelClass += isAddonBefore ? ` label-addon-before${focus ? '-focus' : ''}` : '';

  const containerClasses = [
    'input-form',
    size,
    className
  ].filter(Boolean).join(' ');

  const disabledStyles = isDisabled ? {
    opacity: 0.6,
    cursor: 'not-allowed',
    backgroundColor: '#f5f5f5',
    color: '#999999',
    borderColor: '#d9d9d9'
  } : {};

  const containerStyle = isDisabled ? {
    opacity: 0.7
  } : {};

  return (
    <div className={containerClasses} style={containerStyle}>
      <div className="float-label" onBlur={() => setFocus(false)} onFocus={() => setFocus(true)}>
        {props.type === 'textarea' ? (
          <Input.TextArea
            {...(props as TextAreaInputProps)}
            size={size}
            rows={3}
            style={{ ...(props.style || {}), ...disabledStyles }}
          />
        ) : props.type === 'number' ? (
          <InputNumber
            {...(props as NumberInputProps)}
            size={size}
            style={{ width: '100%', ...(props.style || {}), ...disabledStyles }}
          />
        ) : (
          <Input
            {...(props as TextInputProps)}
            size={size}
            type={props.type || 'text'}
            style={{ ...(props.style || {}), ...disabledStyles }}
          />
        )}
        {label && (
          <label
            htmlFor={label}
            className={labelClass}
            style={isDisabled ? { color: '#666666', opacity: 0.9, fontWeight: 500 } : {}}
          >
            {label}
          </label>
        )}
      </div>
    </div>
  );
};

InputAntd.defaultProps = {
  hasError: false,
  isFloating: false,
  isAddonBefore: false,
  type: 'text',
  style: {},
};

export default InputAntd;
