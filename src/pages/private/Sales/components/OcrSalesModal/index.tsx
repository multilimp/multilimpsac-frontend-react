
import { useState } from 'react';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from '@mui/material';
import { Close, Save } from '@mui/icons-material';
import { Form, notification, Spin } from 'antd';
import InputFile from '@/components/InputFile';
import { uploadFile } from '@/services/files/file.requests';
import { SaleProps } from '@/services/sales/sales';

interface OcrSalesModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (data: Partial<SaleProps>) => void;
}

const OcrSalesModal = ({ open, onClose, onSuccess }: OcrSalesModalProps) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      notification.error({
        message: 'Error',
        description: 'Por favor seleccione un archivo para procesar',
      });
      return;
    }

    setLoading(true);
    try {
      // Subir el archivo al servidor
      const fileUrl = await uploadFile(selectedFile);
      
      // Simular el procesamiento OCR (en un caso real, llamaríamos a una API de OCR)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Datos simulados extraídos por OCR
      const extractedData: Partial<SaleProps> = {
        client: "Empresa Extraída por OCR",
        clientRuc: "20123456789",
        companyName: "MULTILIMP SAC",
        companyRuc: "20987654321",
        contact: "Juan Pérez",
        items: [
          { productId: "P001", quantity: 3, unitPrice: 45.90 },
          { productId: "P002", quantity: 5, unitPrice: 32.50 }
        ]
      };

      notification.success({
        message: 'Éxito',
        description: 'Documento procesado correctamente',
      });

      onSuccess(extractedData);
    } catch (error) {
      console.error('Error al procesar el documento:', error);
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
      open={open}
      fullWidth
      maxWidth="md"
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" fontWeight={600} color="primary">
            Procesar Orden de Compra con IA
          </Typography>
          <Button variant="text" color="inherit" onClick={onClose} sx={{ minWidth: 'auto', p: 1 }}>
            <Close />
          </Button>
        </Box>
      </DialogTitle>
      <Divider />
      
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Typography variant="body1" paragraph>
            Suba una imagen o documento PDF de su orden de compra. 
            Nuestro sistema de IA extraerá automáticamente la información relevante.
          </Typography>
          
          <Box sx={{ my: 3, p: 4, border: '2px dashed #ccc', borderRadius: 2, backgroundColor: '#f9f9f9' }}>
            <InputFile
              onChange={handleFileChange}
              label="Arrastre aquí su orden de compra o haga clic para seleccionar"
              disabled={loading}
            />
            
            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                Archivo seleccionado: {selectedFile.name}
              </Typography>
            )}
            
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Spin tip="Procesando documento..." size="large" />
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onClose}
          disabled={loading}
          startIcon={<Close />}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleProcess}
          disabled={loading || !selectedFile}
          startIcon={<Save />}
        >
          {loading ? 'Procesando...' : 'Procesar Documento'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OcrSalesModal;
