import { Input, InputProps } from 'antd';
import { useState } from 'react';

interface SelectContainerProps extends InputProps {
  label: string;
  isFloating?: boolean;
  hasError?: boolean;
  isAddonBefore?: boolean;
}

const InputAntd = ({ label, isFloating, isAddonBefore, hasError, size = 'large', ...rest }: SelectContainerProps) => {
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
        <Input {...rest} size={size} />
        <label htmlFor={label} className={labelClass}>
          {label}
        </label>
      </div>
    </div>
  );
};

InputAntd.defaultProps = { hasError: false, isFloating: false, isAddonBefore: false };

export default InputAntd;
