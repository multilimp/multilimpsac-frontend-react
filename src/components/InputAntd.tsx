import { Input, InputNumber, InputProps } from 'antd';
import { useState } from 'react';

type CommonProps = {
  label?: string;
  isFloating?: boolean;
  className?: string;
  hasError?: boolean;
  isAddonBefore?: boolean;
  size?: 'large' | 'middle' | 'small';
  placeholder?: string;
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

  const isFloatingAux = focus || (value && value.length !== 0);
  let labelClass = isFloatingAux || isFloating ? 'label label-float' : 'label';
  labelClass += size ? ` ${size}` : ' middle';
  labelClass += focus ? ' focus' : '';
  labelClass += hasError || ('aria-invalid' in props && props['aria-invalid'] === 'true') ? ' error' : '';
  labelClass += 'disabled' in props && props.disabled ? ' disabled' : '';
  labelClass += isAddonBefore ? ` label-addon-before${focus ? '-focus' : ''}` : '';

  // Combinar clases del contenedor principal
  const containerClasses = [
    'input-form',
    size,
    className // Agregar className personalizado
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className="float-label" onBlur={() => setFocus(false)} onFocus={() => setFocus(true)}>
        {props.type === 'textarea' ? (
          <Input.TextArea {...(props as TextAreaInputProps)} size={size} rows={3} />
        ) : props.type === 'number' ? (
          <InputNumber {...(props as NumberInputProps)} size={size} style={{ width: '100%' }} />
        ) : (
          <Input {...(props as TextInputProps)} size={size} type={props.type || 'text'} />
        )}
        {label && (
          <label htmlFor={label} className={labelClass}>
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
};

export default InputAntd;
