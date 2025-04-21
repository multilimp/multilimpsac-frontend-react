
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTransport, useTransportContacts, useDeleteTransportContact, useCreateTransportContact, useUpdateTransportContact } from '../services/transport.service';
import { LoadingFallback } from '@/components/common/LoadingFallback';
import { Pencil, ArrowLeft } from 'lucide-react';
import BreadcrumbNav from '@/components/layout/BreadcrumbNav';
import { ContactoTransporte, convertToTransporte } from '../models/transport.model';
import TransportInfo from '../components/TransportInfo';
import TransportContactSection from '../components/TransportContactSection';

const TransportDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: transport, isLoading } = useTransport(id || '');
  const { data: contacts = [], isLoading: loadingContacts } = useTransportContacts(id || '');
  const { mutate: deleteContact } = useDeleteTransportContact();
  const { mutate: createContact, isPending: isCreating } = useCreateTransportContact();
  const { mutate: updateContact, isPending: isUpdating } = useUpdateTransportContact();

  const breadcrumbItems = [
    { label: 'Transportes', path: '/transportes' },
    { label: transport?.name || 'Detalle', path: `/transportes/${id}`, isCurrentPage: true },
  ];

  const handleEdit = () => {
    navigate(`/transportes/${id}/edit`);
  };

  const handleContactSubmit = (data: Partial<ContactoTransporte>) => {
    if (data.id) {
      updateContact({
        contactId: data.id.toString(),
        transportId: id!,
        data
      });
    } else {
      createContact({
        transportId: id!,
        data
      });
    }
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

  // Convert to the Transporte interface for UI components
  const transporteData = convertToTransporte(transport);

  return (
    <div className="space-y-6 p-6">
      <BreadcrumbNav items={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => navigate('/transportes')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-2xl font-bold">{transport.name}</h1>
        </div>

        <div className="space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <TransportInfo transport={transporteData} />
        <TransportContactSection
          transportId={id!}
          contacts={contacts}
          onContactSubmit={handleContactSubmit}
          onContactDelete={handleDeleteContact}
          isLoading={loadingContacts}
          isSubmitting={isCreating || isUpdating}
        />
      </div>
    </div>
  );
};

export default TransportDetailsPage;
