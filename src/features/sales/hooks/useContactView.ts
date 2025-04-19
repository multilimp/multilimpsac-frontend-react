
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export interface Contact {
  name: string;
  phone: string;
  email: string;
}

export const useContactView = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isContactViewOpen, setIsContactViewOpen] = useState(false);

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsContactViewOpen(true);
  };

  return {
    selectedContact,
    isContactViewOpen,
    setIsContactViewOpen,
    handleViewContact,
  };
};
