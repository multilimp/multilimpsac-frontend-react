
import { Card, CardContent } from "@/components/ui/card";
import { ContactoTransporte } from "../models/transport.model";
import TransportContactList from "./TransportContactList";
import TransportContactDialog from "./TransportContactDialog";
import { useState } from "react";

interface TransportContactSectionProps {
  transportId: string;
  contacts: ContactoTransporte[];
  onContactSubmit: (data: Partial<ContactoTransporte>) => void;
  onContactDelete: (contact: ContactoTransporte) => void;
  isLoading?: boolean;
  isSubmitting?: boolean;
}

const TransportContactSection = ({
  transportId,
  contacts,
  onContactSubmit,
  onContactDelete,
  isLoading,
  isSubmitting
}: TransportContactSectionProps) => {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactoTransporte | null>(null);

  const handleEditContact = (contact: ContactoTransporte) => {
    setSelectedContact(contact);
    setIsContactDialogOpen(true);
  };

  const handleAddContact = () => {
    setSelectedContact(null);
    setIsContactDialogOpen(true);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <TransportContactList
          transportId={transportId}
          contacts={contacts}
          onAdd={handleAddContact}
          onEdit={handleEditContact}
          onDelete={onContactDelete}
          isLoading={isLoading}
        />

        <TransportContactDialog
          isOpen={isContactDialogOpen}
          onClose={() => {
            setIsContactDialogOpen(false);
            setSelectedContact(null);
          }}
          onSubmit={onContactSubmit}
          contact={selectedContact || undefined}
          isSubmitting={isSubmitting}
        />
      </CardContent>
    </Card>
  );
};

export default TransportContactSection;
