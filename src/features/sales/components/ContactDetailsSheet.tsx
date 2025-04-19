
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface Contact {
  name: string;
  phone: string;
  email: string;
}

interface ContactDetailsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
}

export const ContactDetailsSheet: React.FC<ContactDetailsSheetProps> = ({
  isOpen,
  onOpenChange,
  contact,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Detalles del Contacto</SheetTitle>
        </SheetHeader>
        {contact && (
          <div className="space-y-4 mt-4">
            <div>
              <label className="font-medium">Nombre:</label>
              <p>{contact.name}</p>
            </div>
            <div>
              <label className="font-medium">Teléfono:</label>
              <p>{contact.phone}</p>
            </div>
            <div>
              <label className="font-medium">Email:</label>
              <p>{contact.email}</p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
