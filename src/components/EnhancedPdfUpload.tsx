import { Box, Typography, Button, Stack, IconButton, Alert } from '@mui/material';
import { Upload, PictureAsPdf, Close, Info } from '@mui/icons-material';
import { useRef, useState, useEffect } from 'react';
import { uploadFile } from '@/services/files/file.requests';
import { validateOcamPdf, validateGenericPdf, PdfValidationOptions } from '@/utils/pdfValidation';

interface EnhancedPdfUploadProps {
  label?: string;
  onChange?: (fileUrl: string | null) => void;
  value?: string | null;
  disabled?: boolean;
  required?: boolean;
  validationOptions?: PdfValidationOptions;
  showInfo?: boolean;
  acceptOcamOnly?: boolean;
}

const EnhancedPdfUpload = ({
  label = 'Subir PDF',
  onChange,
  value,
  disabled = false,
  required = false,
  validationOptions,
  showInfo = true,
  acceptOcamOnly = false,
}: EnhancedPdfUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(value ?? null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    setFileUrl(value ?? null);
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limpiar errores previos
    setValidationError('');

    // Validar archivo
    const validation = acceptOcamOnly 
      ? validateOcamPdf(file)
      : validateGenericPdf(file, validationOptions?.maxSizeMB);

    if (!validation.isValid) {
      setValidationError(validation.message);
      // Limpiar el input
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      return;
    }

    setLoading(true);
    try {
      const uploadedUrl = await uploadFile(file);
      setFileUrl(uploadedUrl);
      setFileName(file.name);
      onChange?.(uploadedUrl);
    } catch (error) {
      console.error('Error al subir archivo:', error);
      setValidationError('Error al subir el archivo');
      onChange?.(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFileUrl(null);
    setFileName('');
    setValidationError('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onChange?.(null);
  };

  const handleDownload = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  const handleClick = () => {
    if (!disabled && !loading) {
      inputRef.current?.click();
    }
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: required ? 'error.main' : 'text.primary' }}>
        {label} {required && '*'}
      </Typography>
      
      {showInfo && acceptOcamOnly && (
        <Alert 
          severity="info" 
          icon={<Info />}
          sx={{ mb: 2, fontSize: '0.875rem' }}
        >
          Solo se aceptan archivos PDF que comiencen con "OCAM"
        </Alert>
      )}
      
      {validationError && (
        <Alert 
          severity="error" 
          sx={{ mb: 2, fontSize: '0.875rem' }}
        >
          {validationError}
        </Alert>
      )}
      
      <Box
        sx={{
          border: '2px dashed',
          borderColor: validationError ? 'error.main' : fileUrl ? 'success.main' : 'grey.300',
          borderRadius: 2,
          p: 2,
          textAlign: 'center',
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          transition: 'all 0.2s',
          '&:hover': !disabled && !loading ? {
            borderColor: validationError ? 'error.main' : 'primary.main',
            bgcolor: 'action.hover'
          } : {},
        }}
        onClick={handleClick}
      >
        {!fileUrl ? (
          <Stack spacing={1} alignItems="center">
            <Upload sx={{ fontSize: 32, color: 'grey.500' }} />
            <Typography variant="body2" color="text.secondary">
              {loading ? 'Subiendo...' : 'Haz clic para subir PDF'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {acceptOcamOnly ? 'Solo archivos PDF que comiencen con "OCAM"' : 'Solo archivos PDF'}
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={1} alignItems="center">
            <PictureAsPdf sx={{ fontSize: 32, color: 'success.main' }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {fileName || 'PDF subido'}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
              >
                Ver PDF
              </Button>
              {!disabled && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                >
                  <Close />
                </IconButton>
              )}
            </Stack>
          </Stack>
        )}
        
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          disabled={disabled || loading}
        />
      </Box>
    </Box>
  );
};

export default EnhancedPdfUpload; 