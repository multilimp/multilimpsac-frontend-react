import SelectContainer from './SelectContainer';
import { Select, SelectProps } from 'antd';
import { filterOptions } from '@/utils/functions';

interface SelectGenericProps extends SelectProps {
  label: string;
}

const SelectGeneric = ({ label, ...rest }: SelectGenericProps) => {
  return (
    <SelectContainer label={label}>
      <Select showSearch filterOption={filterOptions} size="large" style={{ width: '100%' }} {...rest} />
    </SelectContainer>
  );
};

export default SelectGeneric;
