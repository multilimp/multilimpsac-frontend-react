
import { useEffect, useState } from 'react';
import { notification } from 'antd';
import { ContactProps, ContactUpdateProps } from '@/services/contacts/contacts';
import { getContactsByEntityType, updateContact, deleteContact } from '@/services/contacts/contacts.requests';

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

  const updateContactData = async (contactId: number, contactData: ContactUpdateProps) => {
    try {
      setLoadingContacts(true);
      await updateContact(contactId, contactData);
      await obtainContacts(); // Recargar lista
      notification.success({
        message: 'Contacto actualizado exitosamente',
      });
    } catch (error) {
      console.error('Error al actualizar contacto:', error);
      notification.error({
        message: 'Error al actualizar contacto',
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setLoadingContacts(false);
    }
  };

  const deleteContactData = async (contactId: number) => {
    try {
      setLoadingContacts(true);
      await deleteContact(contactId);
      await obtainContacts(); // Recargar lista
      notification.success({
        message: 'Contacto eliminado exitosamente',
      });
    } catch (error) {
      console.error('Error al eliminar contacto:', error);
      notification.error({
        message: 'Error al eliminar contacto',
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setLoadingContacts(false);
    }
  };

  return { 
    loadingContacts, 
    contacts, 
    obtainContacts, 
    updateContactData, 
    deleteContactData 
  };
};

export default useContactsByEntity;
