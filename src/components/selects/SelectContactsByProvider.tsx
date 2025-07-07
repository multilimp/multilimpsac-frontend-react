import { useState } from 'react';
import { Select, SelectProps, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import SelectContainer from './SelectContainer';
import { filterOptions } from '@/utils/functions';
import useContactsByEntity from '@/hooks/useContactsByEntity';
import ContactsDrawer from '@/components/ContactsDrawer';
import { ContactTypeEnum } from '@/services/contacts/contacts.enum';

interface SelectContactsByProviderProps extends SelectProps {
  label?: string;
  providerId?: number;
  onContactCreated?: () => void;
}

const SelectContactsByProvider = ({ 
  label, 
  providerId, 
  onContactCreated,
  size = 'large', 
  ...props 
}: SelectContactsByProviderProps) => {
  const [openContactsDrawer, setOpenContactsDrawer] = useState(false);
  
  const { contacts, loadingContacts, obtainContacts } = useContactsByEntity(
    'proveedor', 
    providerId || 0
  );

  const handleContactCreated = () => {
    obtainContacts();
    onContactCreated?.();
    setOpenContactsDrawer(false);
  };

  const hasContacts = contacts.length > 0;
  const isDisabled = !providerId || loadingContacts;

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
              !providerId 
                ? 'Primero seleccione un proveedor' 
                : !hasContacts 
                  ? 'No hay contactos disponibles'
                  : 'Seleccione un contacto'
            }
            notFoundContent={
              !providerId 
                ? 'Primero seleccione un proveedor'
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
            disabled={!providerId}
            onClick={() => setOpenContactsDrawer(true)}
            title={!providerId ? 'Primero seleccione un proveedor' : 'Agregar contacto'}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              minWidth: '50px',
              minHeight: '50px',
            }}
          />
        </div>
      </SelectContainer>

      {openContactsDrawer && providerId && (
        <ContactsDrawer 
          referenceId={providerId}
          handleClose={() => setOpenContactsDrawer(false)}
          tipo={ContactTypeEnum.PROVEEDOR}
          onContactCreated={handleContactCreated}
        />
      )}
    </>
  );
};

export default SelectContactsByProvider;
