import SelectContainer from './SelectContainer';
import { Select, SelectProps } from 'antd';
import { filterOptions } from '@/utils/functions';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';

interface SelectTransportsProps extends SelectProps {
  label: string;
}

const SelectTransports = ({ label, ...rest }: SelectTransportsProps) => {
  const { transports, loadingTransports } = useGlobalInformation();

  return (
    <SelectContainer label={label}>
      <Select
        showSearch
        filterOption={filterOptions}
        size="large"
        style={{ width: '100%' }}
        loading={loadingTransports}
        disabled={loadingTransports}
        {...rest}
      >
        {transports.map((item) => (
          <Select.Option key={item.id} value={item.id} optiondata={item} title={item.razonSocial}>
            {item.razonSocial}
          </Select.Option>
        ))}
      </Select>
    </SelectContainer>
  );
};

export default SelectTransports;
