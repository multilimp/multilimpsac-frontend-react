
import { Input, InputNumber, InputNumberProps, InputProps } from 'antd';
import { useState } from 'react';

type CommonProps = {
  label: string;
  isFloating?: boolean;
  hasError?: boolean;
  isAddonBefore?: boolean;
  size?: 'large' | 'middle' | 'small';
};

interface TextInputProps extends CommonProps, Omit<InputProps, 'type'> {
  type?: 'text' | 'password' | 'date';
}

interface TextAreaInputProps extends CommonProps {
  type: 'textarea';
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  rows?: number;
  disabled?: boolean;
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
  const { label, isFloating, isAddonBefore, hasError, size = 'large' } = props;
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

  return (
    <div className={`input-form ${size}`}>
      <div className="float-label" onBlur={() => setFocus(false)} onFocus={() => setFocus(true)}>
        {props.type === 'textarea' ? (
          <Input.TextArea 
            {...(props as TextAreaInputProps)} 
            size={size} 
            rows={4} 
          />
        ) : props.type === 'number' ? (
          <InputNumber 
            {...(props as NumberInputProps)} 
            size={size} 
            style={{ width: '100%' }} 
          />
        ) : (
          <Input 
            {...(props as TextInputProps)} 
            size={size} 
            type={props.type || 'text'} 
          />
        )}
        <label htmlFor={label} className={labelClass}>
          {label}
        </label>
      </div>
    </div>
  );
};

InputAntd.defaultProps = { 
  hasError: false, 
  isFloating: false, 
  isAddonBefore: false,
  type: 'text'
};

export default InputAntd;
