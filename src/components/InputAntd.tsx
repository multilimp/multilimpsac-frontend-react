
import { Input, InputProps, InputNumber, InputNumberProps } from 'antd';
import { useState } from 'react';

interface InputAntdProps extends Omit<InputProps, 'type'> {
  label: string;
  isFloating?: boolean;
  hasError?: boolean;
  isAddonBefore?: boolean;
  type?: 'text' | 'password' | 'textarea' | 'date' | 'number';
}

const InputAntd = ({ label, isFloating, isAddonBefore, hasError, size = 'large', type, ...rest }: InputAntdProps) => {
  const [focus, setFocus] = useState(false);
  const isFloatingAux = focus || (rest?.value && String(rest?.value).length !== 0);
  let labelClass = isFloatingAux || isFloating ? 'label label-float' : 'label';
  labelClass += size ? ` ${size}` : ' middle';
  labelClass += focus ? ' focus' : '';
  labelClass += hasError || rest['aria-invalid'] === 'true' ? ' error' : '';
  labelClass += rest?.disabled ? ' disabled' : '';
  labelClass += isAddonBefore ? ` label-addon-before${focus ? '-focus' : ''}` : '';

  return (
    <div className={`input-form ${size}`}>
      <div className="float-label" onBlur={() => setFocus(false)} onFocus={() => setFocus(true)}>
        {type === 'textarea' ? (
          <Input.TextArea {...rest as any} size={size} rows={4} />
        ) : type === 'number' ? (
          <InputNumber {...rest as any} size={size} style={{ width: '100%' }} />
        ) : (
          <Input {...rest} size={size} type={type} />
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
