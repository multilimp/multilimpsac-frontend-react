import React, { useState } from 'react';

export interface SelectContainerProps {
  children: any;
  label: string;
  isFloating?: boolean;
  hasError?: boolean;
  context?: any;
  isAddonBefore?: boolean;
  labelColor?: string;
}

const SelectContainer = ({ children, label, isFloating, hasError, isAddonBefore, labelColor, ...context }: SelectContainerProps) => {
  const [focus, setFocus] = useState(false);
  const isFloatingAux = focus || (children?.props?.value && children.props.value.length !== 0);
  let labelClass = isFloatingAux || isFloating ? 'label label-float' : 'label';
  labelClass += children.props.size ? ` ${children.props.size}` : ' middle';
  labelClass += focus ? ' focus' : '';
  labelClass += hasError || children.props['aria-invalid'] === 'true' ? ' error' : '';
  labelClass += children.props.disabled ? ' disabled' : '';
  labelClass += isAddonBefore ? ` label-addon-before${focus ? '-focus' : ''}` : '';

  const contextAux = { ...context, ...children?.props };

  return (
    <div className={`input-select-form ${children.props.size}`}>
      <div className="float-label" onBlur={() => setFocus(false)} onFocus={() => setFocus(true)}>
        {React.cloneElement(children, { value: children.props.value, ...contextAux })}
        <label htmlFor={label} className={labelClass} style={labelColor ? { color: labelColor } : undefined}>
          {label}
        </label>
      </div>
    </div>
  );
};

SelectContainer.defaultProps = { hasError: false, isFloating: false, isAddonBefore: false };

export default SelectContainer;
