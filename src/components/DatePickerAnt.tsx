import { useState } from 'react';
import { DatePicker, DatePickerProps } from 'antd';

interface DatePickerAntdProps extends DatePickerProps {
  label?: string;
  isFloating?: boolean;
  hasError?: boolean;
  isAddonBefore?: boolean;
}

const DatePickerAntd = ({ label, isFloating, isAddonBefore, hasError, size = 'large', ...rest }: DatePickerAntdProps) => {
  const [focus, setFocus] = useState(false);
  const isFloatingAux = focus || (rest?.value && String(rest?.value).length !== 0);
  let labelClass = isFloatingAux || isFloating ? 'label label-float' : 'label';
  labelClass += size ? ` ${size}` : ' middle';
  labelClass += focus ? ' focus' : '';
  labelClass += hasError || rest['aria-invalid'] === 'true' ? ' error' : '';
  labelClass += rest?.disabled ? ' disabled' : '';
  labelClass += isAddonBefore ? ` label-addon-before${focus ? '-focus' : ''}` : '';

  // Determine format based on showTime prop
  const format = rest.showTime ? "DD/MM/YYYY HH:mm" : "DD/MM/YYYY";

  const isDisabled = Boolean(rest?.disabled);
  const disabledStyles = isDisabled
    ? {
        cursor: 'not-allowed',
        background: 'linear-gradient(135deg, #f7f8fa 0%, #f0f2f5 100%)',
        border: '1px dashed #d1d5db',
        color: '#6b7280',
        WebkitTextFillColor: '#6b7280',
      }
    : {};
  return (
    <div className={`input-form ${size}`}>
      <div className="float-label" onBlur={() => setFocus(false)} onFocus={() => setFocus(true)}>
        <DatePicker
          size={size}
          style={{ width: '100%', height: '50px', ...disabledStyles }}
          format={format}
          variant="outlined"
          allowClear
          showNow={false}
          placeholder=""
          {...rest}
        />
        <label htmlFor={label} className={labelClass} style={isDisabled ? { color: '#333a45ff', opacity: 1, fontWeight: 600 } : undefined}>
          {label}
        </label>
      </div>
    </div>
  );
};

DatePickerAntd.defaultProps = { hasError: false, isFloating: false, isAddonBefore: false };

export default DatePickerAntd;
