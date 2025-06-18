import { useEffect, useState } from 'react';
import { message } from 'antd';
import { ContactFilterProps, ContactProps, ContactUpdateProps } from '@/services/contacts/contacts';
import { deleteContact, getContacts, updateContact } from '@/services/contacts/contacts.requests';

const useContacts = (filters?: ContactFilterProps) => {
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [contacts, setContacts] = useState<Array<ContactProps>>([]);

  useEffect(() => {
    obtainContacts();
  }, []);

  const obtainContacts = async () => {
    try {
      setLoadingContacts(true);
      const data = await getContacts(filters);
      setContacts([...data]);
    } catch (error) {
      message.error(`No se pudo obtener los contactos. ${String(error)}`);
    } finally {
      setLoadingContacts(false);
    }
  };

  const updateContactData = async (contactId: number, contactData: ContactUpdateProps) => {
    try {
      setLoadingContacts(true);
      await updateContact(contactId, contactData);
      await obtainContacts(); // Recargar lista
      message.success('Contacto actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar contacto:', error);
      message.error('Error al actualizar contacto');
    } finally {
      setLoadingContacts(false);
    }
  };

  const deleteContactData = async (contactId: number) => {
    try {
      setLoadingContacts(true);
      await deleteContact(contactId);
      await obtainContacts(); // Recargar lista
      message.success('Contacto eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar contacto:', error);
      message.error('Error al eliminar contacto');
    } finally {
      setLoadingContacts(false);
    }
  };

  return { obtainContacts, contacts, loadingContacts, updateContactData, deleteContactData };
};

export default useContacts;
