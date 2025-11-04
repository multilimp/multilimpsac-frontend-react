import React, { useState } from 'react';

export interface SelectContainerProps {
  children: React.ReactElement<unknown>;
  label: string;
  isFloating?: boolean;
  hasError?: boolean;
  context?: Record<string, unknown>;
  isAddonBefore?: boolean;
  labelColor?: string;
}

const SelectContainer = ({ children, label, isFloating, hasError, isAddonBefore, labelColor, ...context }: SelectContainerProps) => {
  const [focus, setFocus] = useState(false);
  const childProps = children.props as {
    value?: unknown;
    size?: 'small' | 'middle' | 'large';
    disabled?: boolean;
    ['aria-invalid']?: string;
  };
  const hasValue = (() => {
    if (childProps?.value === undefined || childProps?.value === null) return false;
    const str = String(childProps.value);
    return str.length !== 0;
  })();
  const isFloatingAux = focus || hasValue;
  let labelClass = isFloatingAux || isFloating ? 'label label-float' : 'label';
  labelClass += childProps.size ? ` ${childProps.size}` : ' middle';
  labelClass += focus ? ' focus' : '';
  labelClass += hasError || childProps['aria-invalid'] === 'true' ? ' error' : '';
  labelClass += childProps.disabled ? ' disabled' : '';
  labelClass += isAddonBefore ? ` label-addon-before${focus ? '-focus' : ''}` : '';

  const contextAux = { ...context, ...childProps };
  const isDisabled = Boolean(childProps?.disabled);
  const labelStyle = labelColor
    ? { color: labelColor }
    : isDisabled
    ? { color: '#374151', opacity: 1, fontWeight: 600 }
    : undefined;

  return (
    <div className={`input-select-form ${childProps.size ?? 'middle'}`}>
      <div className="float-label" onBlur={() => setFocus(false)} onFocus={() => setFocus(true)}>
        {React.cloneElement(children, { value: childProps.value, ...contextAux })}
        <label htmlFor={label} className={labelClass} style={labelStyle}>
          {label}
        </label>
      </div>
    </div>
  );
};

SelectContainer.defaultProps = { hasError: false, isFloating: false, isAddonBefore: false };

export default SelectContainer;
