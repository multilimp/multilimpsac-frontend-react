import SelectContainer from './SelectContainer';
import { Select, SelectProps } from 'antd';
import { filterOptions } from '@/utils/functions';

interface SelectGenericProps extends SelectProps {
  label: string;
}

const SelectGeneric = ({ label, style, ...rest }: SelectGenericProps) => {
  return (
    <SelectContainer label={label}>
      <Select 
        showSearch 
        filterOption={filterOptions} 
        size="large" 
        style={{ 
          width: '100%',
          // Aplicar estilos personalizados si se pasan
          ...style,
        }} 
        {...rest} 
      />
    </SelectContainer>
  );
};

export default SelectGeneric;
