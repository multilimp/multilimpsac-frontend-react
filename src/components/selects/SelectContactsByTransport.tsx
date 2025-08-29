import { useState } from 'react';
import { Select, SelectProps, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import SelectContainer from './SelectContainer';
import { filterOptions } from '@/utils/functions';
import useContactsByEntity from '@/hooks/useContactsByEntity';
import ContactsDrawer from '@/components/ContactsDrawer';
import { ContactTypeEnum } from '@/services/contacts/contacts.enum';

interface SelectContactsByTransportProps extends SelectProps {
  label?: string;
  transportId?: number;
  onContactCreated?: () => void;
  onChange?: (value: any, record?: any) => void;
}

const SelectContactsByTransport = ({
  label,
  transportId,
  onContactCreated,
  onChange,
  size = 'large',
  ...props
}: SelectContactsByTransportProps) => {
  const [openContactsDrawer, setOpenContactsDrawer] = useState(false);

  const { contacts, loadingContacts, obtainContacts } = useContactsByEntity(
    'transporte',
    transportId || 0
  );

  const handleContactCreated = () => {
    obtainContacts();
    onContactCreated?.();
    setOpenContactsDrawer(false);
  };

  const hasContacts = contacts.length > 0;
  const isDisabled = !transportId || loadingContacts;

  return (
    <>
      <SelectContainer label={label || ''}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
          <Select
            showSearch
            filterOption={filterOptions}
            size={size}
            style={{ flex: 1 }}
            loading={loadingContacts}
            disabled={isDisabled}
            notFoundContent={
              !transportId
                ? 'Primero seleccione un transporte'
                : 'No hay contactos disponibles'
            }
            onChange={onChange}
            {...props}
          >
            {contacts.map((item) => (
              <Select.Option
                key={item.id}
                value={item.id}
                label={`${item.cargo} - ${item.nombre}`}
                title={`${item.nombre} - ${item.cargo}`}
              >
                {item.cargo} - {item.nombre}
              </Select.Option>
            ))}
          </Select>

          <Button
            icon={<SearchOutlined />}
            size={size}
            disabled={!transportId}
            onClick={() => setOpenContactsDrawer(true)}
            title={!transportId ? 'Primero seleccione un transporte' : 'Agregar contacto'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '50px',
              minHeight: '50px'
            }}
          />
        </div>
      </SelectContainer>

      {openContactsDrawer && transportId && (
        <ContactsDrawer
          referenceId={transportId}
          handleClose={() => setOpenContactsDrawer(false)}
          tipo={ContactTypeEnum.TRANSPORTE}
          onContactCreated={handleContactCreated}
        />
      )}
    </>
  );
};

export default SelectContactsByTransport;
