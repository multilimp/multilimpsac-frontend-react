import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContent from '@/components/PageContent';
import { Button } from '@mui/material';
import TrackingsOrdersForm from './TrackingsOrdersForm';

const TrackingsOrdersPage: React.FC = () => {
  const { trackingId } = useParams<{ trackingId: string }>();

  const handleSubmit = async (values: any) => {
    console.log('OC Conforme enviado para tracking', trackingId, values);
    // Aquí invocas tu API:
    // await api.saveOcConforme(trackingId, values);
  };

  return (
    <PageContent
      title={`Seguimiento #${trackingId} · OC CONFORME`}
      component={
        <Button component={Link} to="/private/trackings" variant="outlined">
          ← Volver a Seguimientos
        </Button>
      }
    >
      <TrackingsOrdersForm onSubmit={handleSubmit} />
    </PageContent>
  );
};

export default TrackingsOrdersPage;
