import SelectContainer from './SelectContainer';
import { Select, SelectProps } from 'antd';
import { filterOptions } from '@/utils/functions';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';

interface SelectClientsProps extends SelectProps {
  label: string;
}

const SelectClients = ({ label, ...rest }: SelectClientsProps) => {
  const { clients, loadingClients } = useGlobalInformation();

  return (
    <SelectContainer label={label}>
      <Select
        showSearch
        filterOption={filterOptions}
        size="large"
        style={{ width: '100%' }}
        loading={loadingClients}
        disabled={loadingClients}
        {...rest}
      >
        {clients.map((item) => (
          <Select.Option key={item.id} value={item.id} optiondata={item} title={item.razonSocial}>
            {item.razonSocial}
          </Select.Option>
        ))}
      </Select>
    </SelectContainer>
  );
};

export default SelectClients;
