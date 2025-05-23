import { Select, SelectProps } from 'antd';
import SelectContainer from './SelectContainer';
import { filterOptions } from '@/utils/functions';
import useContacts from '@/hooks/useContacts';

interface SelectContactsProps extends SelectProps {
  label: string;
}

const SelectContacts = ({ label, size = 'large', ...props }: SelectContactsProps) => {
  const { contacts, loadingContacts } = useContacts();

  return (
    <SelectContainer label={label}>
      <Select
        showSearch
        filterOption={filterOptions}
        size={size}
        style={{ width: '100%' }}
        loading={loadingContacts}
        disabled={loadingContacts}
        {...props}
      >
        {contacts.map((item) => (
          <Select.Option key={item.id} value={item.id} optiondata={item} title={`${item.nombre} ${item.cargo}`}>
            {item.cargo} - {item.nombre}
          </Select.Option>
        ))}
      </Select>
    </SelectContainer>
  );
};

export default SelectContacts;
