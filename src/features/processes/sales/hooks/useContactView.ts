
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export interface Contact {
  id?: string;
  name: string;
  phone: string;
  email: string;
  position?: string;
}

export const useContactView = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isContactViewOpen, setIsContactViewOpen] = useState(false);
  const { toast } = useToast();

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsContactViewOpen(true);
  };

  const handleCloseContactView = () => {
    setIsContactViewOpen(false);
    setSelectedContact(null);
  };

  return {
    selectedContact,
    isContactViewOpen,
    setIsContactViewOpen,
    handleViewContact,
    handleCloseContactView,
  };
};
