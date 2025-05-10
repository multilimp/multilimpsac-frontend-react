
import { useEffect, useState } from 'react';
import { notification } from 'antd';
import { ContactProps } from '@/services/contacts/contacts';
import { getContactsByEntityType } from '@/services/contacts/contacts.requests';

const useContactsByEntity = (
  entityType: 'cliente' | 'proveedor' | 'transporte', 
  entityId: number
) => {
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
      setContacts(res);
    } catch (error) {
      notification.error({
        message: `Error al obtener los contactos de ${entityType}`,
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setLoadingContacts(false);
    }
  };

  return { loadingContacts, contacts, obtainContacts };
};

export default useContactsByEntity;
