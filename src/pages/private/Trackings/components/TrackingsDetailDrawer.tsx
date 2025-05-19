// src/pages/private/Trackings/components/TrackingsDetailDrawer.tsx
import React from 'react';
import { TrackingProps } from '@/services/trackings/trackings.d';
import { Delete, RemoveRedEye } from '@mui/icons-material';
import { Button, Card, CardActions, CardContent, CardHeader, Drawer, Stack } from '@mui/material';
import { Empty } from 'antd';

interface TrackingsDetailDrawerProps {
  open: boolean;
  data: TrackingProps;
  onClose: VoidFunction;
  onDeleteDoc?: (type: 'oce' | 'ocf' | 'peruPurchases') => void;
}

const TrackingsDetailDrawer: React.FC<TrackingsDetailDrawerProps> = ({
  open,
  data,
  onClose,
  onDeleteDoc,
}) => {
  const docs: Array<{
    key: 'oce' | 'ocf' | 'peruPurchases';
    label: string;
    url?: string;
  }> = [
    { key: 'oce', label: 'OCE', url: data.oce },
    { key: 'ocf', label: 'OCF', url: data.ocf },
    {
      key: 'peruPurchases',
      label: 'Perú Compras',
      url: data.peruPurchases ? data.peruPurchasesDate : undefined,
    },
  ];

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Card sx={{ borderRadius: 0, width: 400 }} variant="outlined">
        <CardHeader
          title="DETALLE DEL SEGUIMIENTO"
          slotProps={{ title: { fontWeight: 700, fontSize: 20, textAlign: 'center' } }}
        />
        <CardContent sx={{ height: 'calc(100vh - 225px)', overflow: 'auto', pt: 0.1 }}>
          {docs.some(d => d.url) ? (
            <Stack direction="column" spacing={2}>
              {docs.map(doc =>
                doc.url ? (
                  <Card key={doc.key} variant="outlined">
                    <CardHeader
                      title={doc.label}
                      slotProps={{ title: { textAlign: 'center', fontSize: 20, fontWeight: 700 } }}
                    />
                    <CardActions>
                      <Button
                        fullWidth
                        size="small"
                        color="info"
                        variant="outlined"
                        startIcon={<RemoveRedEye />}
                        component="a"
                        href={doc.url}
                        target="_blank"
                      >
                        VER {doc.label}
                      </Button>
                      <Button
                        fullWidth
                        size="small"
                        color="error"
                        variant="outlined"
                        endIcon={<Delete />}
                        onClick={() => onDeleteDoc?.(doc.key)}
                      >
                        ELIMINAR
                      </Button>
                    </CardActions>
                  </Card>
                ) : null
              )}
            </Stack>
          ) : (
            <Empty description="No hay documentos disponibles" />
          )}
        </CardContent>
        <CardActions sx={{ flexDirection: 'column', gap: 2, p: 2 }}>
          <Button fullWidth onClick={onClose}>
            CERRAR
          </Button>
        </CardActions>
      </Card>
    </Drawer>
  );
};

export default TrackingsDetailDrawer;
