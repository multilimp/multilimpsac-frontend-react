import { Select, SelectProps } from 'antd';
import SelectContainer from './SelectContainer';
import { filterOptions } from '@/utils/functions';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';

interface SelectRegionsProps extends SelectProps {
  label: string;
}

const SelectRegions = ({ label, size = 'large', ...props }: SelectRegionsProps) => {
  const { loadingRegions, regions } = useGlobalInformation();

  return (
    <SelectContainer label={label}>
      <Select
        showSearch
        filterOption={filterOptions}
        size={size}
        style={{ width: '100%' }}
        loading={loadingRegions}
        disabled={loadingRegions}
        {...props}
      >
        {regions.map((item) => (
          <Select.Option key={item.id} value={item.id} optiondata={item} title={item.name}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
    </SelectContainer>
  );
};

export default SelectRegions;
