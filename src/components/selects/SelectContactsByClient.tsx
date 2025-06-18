import { useState } from 'react';
import { Select, SelectProps, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import SelectContainer from './SelectContainer';
import { filterOptions } from '@/utils/functions';
import useContactsByEntity from '@/hooks/useContactsByEntity';
import ContactsDrawer from '@/components/ContactsDrawer';
import { ContactTypeEnum } from '@/services/contacts/contacts.enum';

interface SelectContactsByClientProps extends SelectProps {
  label?: string;
  clientId?: number;
  onContactCreated?: () => void;
}

const SelectContactsByClient = ({ 
  label, 
  clientId, 
  onContactCreated,
  size = 'large', 
  ...props 
}: SelectContactsByClientProps) => {
  const [openContactsDrawer, setOpenContactsDrawer] = useState(false);
  
  const { contacts, loadingContacts, obtainContacts } = useContactsByEntity(
    'cliente', 
    clientId || 0
  );

  const handleContactCreated = () => {
    obtainContacts();
    onContactCreated?.();
    setOpenContactsDrawer(false);
  };

  const hasContacts = contacts.length > 0;
  const isDisabled = !clientId || loadingContacts;

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
            placeholder={
              !clientId 
                ? 'Primero seleccione un cliente' 
                : !hasContacts 
                  ? 'No hay contactos disponibles'
                  : 'Seleccione un contacto'
            }
            notFoundContent={
              !clientId 
                ? 'Primero seleccione un cliente'
                : 'No hay contactos disponibles'
            }
            {...props}
          >
            {contacts.map((item) => (
              <Select.Option key={item.id} value={item.id} optiondata={item} title={`${item.nombre} - ${item.cargo}`}>
                {item.cargo} - {item.nombre}
              </Select.Option>
            ))}
          </Select>
          
          <Button
            icon={<SearchOutlined />}
            size={size}
            disabled={!clientId}
            onClick={() => setOpenContactsDrawer(true)}
            title={!clientId ? 'Primero seleccione un cliente' : 'Agregar contacto'}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              minWidth: '40px'
            }}
          />
        </div>
      </SelectContainer>

      {openContactsDrawer && clientId && (
        <ContactsDrawer 
          referenceId={clientId}
          handleClose={() => setOpenContactsDrawer(false)}
          tipo={ContactTypeEnum.CLIENTE}
          onContactCreated={handleContactCreated}
        />
      )}
    </>
  );
};

export default SelectContactsByClient;
