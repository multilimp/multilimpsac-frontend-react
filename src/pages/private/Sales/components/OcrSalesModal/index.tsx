import { useState } from 'react';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from '@mui/material';
import { Close, Save } from '@mui/icons-material';
import { notification, Spin } from 'antd';
import InputFile from '@/components/InputFile';
import { SaleProps } from '@/services/sales/sales';
import { processPdfSales } from '@/services/sales/sales.request';

interface OcrSalesModalProps {
  onClose: () => void;
  onSuccess: (data: SaleProps) => void;
}

const OcrSalesModal = ({ onClose, onSuccess }: OcrSalesModalProps) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleProcess = async () => {
    try {
      if (!selectedFile) return;
      setLoading(true);

      const response = await processPdfSales(selectedFile);

      notification.success({
        message: 'Éxito',
        description: 'Documento procesado correctamente',
      });

      onSuccess(response);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'No se pudo procesar el documento',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          },
        },
      }}
    >
      <DialogTitle variant="h5" color="primary">
        Procesar Orden de Compra con IA
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Typography variant="body1" color="textSecondary">
          Suba una imagen o documento PDF de su orden de compra. Nuestro sistema de IA extraerá automáticamente la información relevante.
        </Typography>

        <Spin size="large" tip="Procesando documento..." spinning={loading}>
          <Box sx={{ my: 3, p: 4, border: '2px dashed #ccc', borderRadius: 2, backgroundColor: '#f9f9f9' }}>
            <InputFile
              onChange={setSelectedFile}
              label="Arrastre aquí su orden de compra o haga clic para seleccionar"
              disabled={loading}
              accept="pdf"
            />
          </Box>
        </Spin>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button variant="outlined" color="inherit" onClick={onClose} disabled={loading} startIcon={<Close />}>
          Cancelar
        </Button>
        <Button color="primary" onClick={handleProcess} disabled={!selectedFile} startIcon={<Save />} loading={loading}>
          Procesar documento
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OcrSalesModal;
