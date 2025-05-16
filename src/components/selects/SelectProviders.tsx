import SelectContainer from './SelectContainer';
import { Select, SelectProps } from 'antd';
import { filterOptions } from '@/utils/functions';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';

interface SelectProvidersProps extends SelectProps {
  label: string;
}

const SelectProviders = ({ label, ...rest }: SelectProvidersProps) => {
  const { providers, loadingProviders } = useGlobalInformation();

  return (
    <SelectContainer label={label}>
      <Select
        showSearch
        filterOption={filterOptions}
        size="large"
        style={{ width: '100%' }}
        loading={loadingProviders}
        disabled={loadingProviders}
        {...rest}
      >
        {providers.map((item) => (
          <Select.Option key={item.id} value={item.id} optiondata={item} title={item.razonSocial}>
            {item.razonSocial}
          </Select.Option>
        ))}
      </Select>
    </SelectContainer>
  );
};

export default SelectProviders;
