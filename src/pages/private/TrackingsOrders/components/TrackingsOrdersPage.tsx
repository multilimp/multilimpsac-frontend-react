// src/pages/private/TrackingsOrders/components/TrackingsOrdersPage.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContent from '@/components/PageContent';
import { Button, Box, Typography } from '@mui/material';
import TrackingsOrdersForm from './TrackingsOrdersForm';

const TrackingsOrdersPage: React.FC = () => {
  const { trackingId } = useParams<{ trackingId: string }>();

  const handleSubmit = async (values: any) => {
    console.log('OC Conforme enviado para tracking', trackingId, values);
    // await api.saveOcConforme(trackingId, values);
  };

  return (
    <PageContent
      title={`Seguimiento #${trackingId}`}
      component={
        <Button component={Link} to="/private/trackings" variant="outlined">
          ← Volver a Seguimientos
        </Button>
      }
    >
      {/* Sección de Órdenes de Proveedores */}
      <Typography variant="h6" sx={{ mb: 1 }}>
        Órdenes de Proveedores
      </Typography>
      <Box
        sx={{
          border: '1px dashed',
          borderColor: 'grey.300',
          borderRadius: 1,
          py: 6,
          textAlign: 'center',
          color: 'text.secondary',
          mb: 4,
        }}
      >
        No hay órdenes de proveedores asociadas a este seguimiento.
      </Box>

      {/* Formulario OC CONFORME */}
      <TrackingsOrdersForm onSubmit={handleSubmit} />
    </PageContent>
  );
};

export default TrackingsOrdersPage;
