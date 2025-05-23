import { useEffect, useState } from 'react';
import { message } from 'antd';
import { ContactFilterProps, ContactProps } from '@/services/contacts/contacts';
import { getContacts } from '@/services/contacts/contacts.requests';

const useContacts = (filters?: ContactFilterProps) => {
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [contacts, setContacts] = useState<Array<ContactProps>>([]);

  useEffect(() => {
    obtainContacts();
  }, []);

  const obtainContacts = async () => {
    try {
      console.log(1);
      setLoadingContacts(true);
      const data = await getContacts(filters);
      setContacts([...data]);
    } catch (error) {
      message.error(`No se pudo obtener los contactos. ${String(error)}`);
    } finally {
      setLoadingContacts(false);
    }
  };

  return { obtainContacts, contacts, loadingContacts };
};

export default useContacts;
