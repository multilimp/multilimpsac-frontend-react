import { notification, Select, SelectProps } from 'antd';
import SelectContainer from './SelectContainer';
import { filterOptions } from '@/utils/functions';
import { useEffect, useState } from 'react';
import { ContactProps } from '@/services/contacts/contacts';
import { getContacts } from '@/services/contacts/contacts.requests';

interface SelectContactsProps extends SelectProps {
  label: string;
}

const SelectContacts = ({ label, size = 'large', ...props }: SelectContactsProps) => {
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<Array<ContactProps>>([]);

  useEffect(() => {
    obtainData();
  }, []);

  const obtainData = async () => {
    try {
      setLoading(true);
      const data = await getContacts();
      setContacts([...data]);
    } catch (error) {
      notification.error({ message: `No se pudo obtener los contactos. ${String(error)}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SelectContainer label={label}>
      <Select showSearch filterOption={filterOptions} size={size} style={{ width: '100%' }} loading={loading} disabled={loading} {...props}>
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
