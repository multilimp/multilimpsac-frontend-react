import { useState } from 'react';
import generatePicker from 'antd/lib/date-picker/generatePicker';
import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns';

// Create a DatePicker powered by date-fns (no dayjs)
const InternalDatePicker = generatePicker<Date>(dateFnsGenerateConfig);

interface DatePickerAntdProps {
  label?: string;
  isFloating?: boolean;
  hasError?: boolean;
  isAddonBefore?: boolean;
  size?: 'large' | 'middle' | 'small';
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (value: Date | null, dateString: string) => void;
  disabled?: boolean;
  placeholder?: string;
  picker?: 'date' | 'week' | 'month' | 'quarter' | 'year';
  format?: string;
  allowClear?: boolean;
  showNow?: boolean;
  variant?: any;
  style?: React.CSSProperties;
  [key: string]: any;
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

  return (
    <div className={`input-form ${size}`}>
      <div className="float-label" onBlur={() => setFocus(false)} onFocus={() => setFocus(true)}>
        <InternalDatePicker
          size={size}
          style={{ width: '100%', height: '50px' }}
          format={rest.format ?? 'dd/MM/yyyy'}
          variant="outlined"
          allowClear
          showNow={false}
          placeholder=""
          {...rest}
        />
        <label htmlFor={label} className={labelClass}>
          {label}
        </label>
      </div>
    </div>
  );
};

DatePickerAntd.defaultProps = { hasError: false, isFloating: false, isAddonBefore: false };

export default DatePickerAntd;
