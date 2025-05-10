
import { useEffect, useState } from 'react';
import { notification } from 'antd';
import { getContactsByEntityType } from '@/services/contacts/contacts.requests';
import { ContactProps } from '@/services/contacts/contacts';

interface UseContactsProps {
  entityType: 'cliente' | 'proveedor' | 'transporte';
  entityId: number;
}

const useContacts = ({ entityType, entityId }: UseContactsProps) => {
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [contacts, setContacts] = useState<Array<ContactProps>>([]);

  useEffect(() => {
    if (entityId) {
      obtainContacts();
    }
  }, [entityId, entityType]);

  const obtainContacts = async () => {
    try {
      setLoadingContacts(true);
      const res = await getContactsByEntityType(entityType, entityId);
      setContacts([...res]);
    } catch (error) {
      notification.error({
        message: 'Error al obtener los contactos',
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
      setContacts([]);
    } finally {
      setLoadingContacts(false);
    }
  };

  return { loadingContacts, contacts, obtainContacts };
};

export default useContacts;
