import { InputNumber } from 'antd';
import { useState } from 'react';

interface NumberInputProps {
  label?: string;
  isFloating?: boolean;
  className?: string;
  hasError?: boolean;
  isAddonBefore?: boolean;
  size?: 'large' | 'middle' | 'small';
  placeholder?: string;
  style?: React.CSSProperties;
  value?: number;
  defaultValue?: number;
  onChange?: (value: string | number | null) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  formatter?: (value: number | string | undefined) => string;
  parser?: (value: string | undefined) => number | string;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  isCurrency?: boolean;
}

const InputNumberAntd = (props: NumberInputProps) => {
  const {
    label,
    isFloating,
    isAddonBefore,
    hasError,
    size = 'large',
    className,
    style,
    isCurrency,
    ...inputProps
  } = props;

  const [focus, setFocus] = useState(false);

  const value = props.value !== undefined ? String(props.value) : '';
  const isFloatingAux = focus || (value && value.length !== 0);

  let labelClass = isFloatingAux || isFloating ? 'label label-float' : 'label';
  labelClass += size ? ` ${size}` : ' middle';
  labelClass += focus ? ' focus' : '';
  labelClass += hasError ? ' error' : '';
  labelClass += props.disabled ? ' disabled' : '';
  labelClass += isAddonBefore ? ` label-addon-before${focus ? '-focus' : ''}` : '';

  const containerClasses = [
    'input-form',
    size,
    className
  ].filter(Boolean).join(' ');

  const solesFormatter = isCurrency ? (value: number | string | undefined) => {
    if (value === undefined || value === null || value === '') return '';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '';

    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 4
    }).format(numValue);
  } : undefined;

  const solesParser = isCurrency ? (value: string | undefined) => {
    if (!value) return '';
    const cleanValue = value.replace(/[^\d.-]/g, '');
    return cleanValue;
  } : undefined;

  return (
    <div className={containerClasses}>
      <div className="float-label" onBlur={() => setFocus(false)} onFocus={() => setFocus(true)}>
        <InputNumber
          {...inputProps}
          size={size}
          style={{ width: '100%', ...(style || {}) }}
          formatter={solesFormatter || inputProps.formatter}
          parser={solesParser || inputProps.parser}
          prefix={isCurrency ? undefined : inputProps.prefix}
        />
        {label && (
          <label htmlFor={label} className={labelClass}>
            {label}
          </label>
        )}
      </div>
    </div>
  );
};

InputNumberAntd.defaultProps = {
  hasError: false,
  isFloating: false,
  isAddonBefore: false,
  size: 'large',
  style: {},
  isCurrency: false,
};

export default InputNumberAntd;
