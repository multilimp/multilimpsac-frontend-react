
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransport, useTransportContacts, useDeleteTransportContact, useCreateTransportContact, useUpdateTransportContact } from '../services/transport.service';
import { LoadingFallback } from '@/components/common/LoadingFallback';
import { useState } from 'react';
import { Pencil, Trash2, ArrowLeft } from 'lucide-react';
import BreadcrumbNav from '@/components/layout/BreadcrumbNav';
import TransportContactList from '../components/TransportContactList';
import TransportContactDialog from '../components/TransportContactDialog';
import { ContactoTransporte } from '../models/transport.model';

const TransportDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: transport, isLoading } = useTransport(id || '');
  const { data: contacts = [], isLoading: loadingContacts } = useTransportContacts(id || '');
  const { mutate: deleteContact } = useDeleteTransportContact();
  const { mutate: createContact, isPending: isCreating } = useCreateTransportContact();
  const { mutate: updateContact, isPending: isUpdating } = useUpdateTransportContact();

  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactoTransporte | null>(null);

  const breadcrumbItems = [
    { label: 'Transportes', path: '/transportes' },
    { label: transport?.razon_social || 'Detalle', path: `/transportes/${id}`, isCurrentPage: true },
  ];

  const handleEdit = () => {
    navigate(`/transportes/${id}/edit`);
  };

  const handleContactSubmit = (data: Partial<ContactoTransporte>) => {
    if (selectedContact) {
      updateContact({
        contactId: selectedContact.id.toString(),
        transportId: id!,
        data
      }, {
        onSuccess: () => {
          setIsContactDialogOpen(false);
          setSelectedContact(null);
        }
      });
    } else {
      createContact({
        transportId: id!,
        data
      }, {
        onSuccess: () => setIsContactDialogOpen(false)
      });
    }
  };

  const handleEditContact = (contact: ContactoTransporte) => {
    setSelectedContact(contact);
    setIsContactDialogOpen(true);
  };

  const handleDeleteContact = (contact: ContactoTransporte) => {
    if (confirm('¿Está seguro de eliminar este contacto?')) {
      deleteContact({
        contactId: contact.id.toString(),
        transportId: id!
      });
    }
  };

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!transport) {
    return (
      <div className="p-4">
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          No se encontró el transporte
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <BreadcrumbNav items={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => navigate('/transportes')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-2xl font-bold">{transport.razon_social}</h1>
        </div>

        <div className="space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">RUC</p>
              <p>{transport.ruc}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dirección</p>
              <p>{transport.direccion || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ubicación</p>
              <p>
                {[transport.departamento, transport.provincia, transport.distrito]
                  .filter(Boolean)
                  .join(', ') || '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cobertura</p>
              <p>{transport.cobertura || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <p>{transport.estado ? 'Activo' : 'Inactivo'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <TransportContactList
              transportId={id!}
              contacts={contacts}
              onAdd={() => {
                setSelectedContact(null);
                setIsContactDialogOpen(true);
              }}
              onEdit={handleEditContact}
              onDelete={handleDeleteContact}
              isLoading={loadingContacts}
            />
          </CardContent>
        </Card>
      </div>

      <TransportContactDialog
        isOpen={isContactDialogOpen}
        onClose={() => {
          setIsContactDialogOpen(false);
          setSelectedContact(null);
        }}
        onSubmit={handleContactSubmit}
        contact={selectedContact || undefined}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
};

export default TransportDetailsPage;
