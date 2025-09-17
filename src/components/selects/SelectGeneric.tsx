import SelectContainer from './SelectContainer';
import { Select, SelectProps } from 'antd';
import { filterOptions } from '@/utils/functions';

interface SelectGenericProps extends SelectProps {
  label?: string;
  style?: React.CSSProperties;
  showSearch?: boolean;
}

const SelectGeneric = ({ label, style, showSearch, ...rest }: SelectGenericProps) => {
  return (
    <SelectContainer label={label || ''}>
      <Select
        showSearch={showSearch !== undefined ? showSearch : true}
        filterOption={filterOptions}
        size="large"
        style={{
          width: '100%',
          ...style,
        }}
        {...rest}
      />
    </SelectContainer>
  );
};

export default SelectGeneric;
