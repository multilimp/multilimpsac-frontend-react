import { Spin } from 'antd';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { CheckCircle, Delete, Upload } from '@mui/icons-material';
import { uploadFile } from '@/services/files/file.requests';

interface InputFileProps {
  label?: string;
  onChange?: (file: null | string) => void;
  accept?: keyof typeof acceptFiles;
  defaultValue?: string;
  value?: string; // Agregar prop value para Ant Design Form
  maxSizeMB?: number;
}

const acceptFiles = {
  pdf: 'application/pdf',
  image: 'image/jpeg,image/png,image/jpg',
};

const InputFile = ({
  onChange,
  label,
  accept = 'image',
  defaultValue,
  value, // Agregar prop value
  maxSizeMB = 1,
}: InputFileProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(value || defaultValue || null);
  const [loading, setLoading] = useState(false);
  const [errorFile, setErrorFile] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Actualizar fileUrl cuando cambie el prop value o defaultValue
  useEffect(() => {
    setFileUrl(value || defaultValue || null);
  }, [value, defaultValue]);

  const validateChange = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);

      const extractedFile = event.target?.files?.[0];
      if (!extractedFile) return handleError('Selecciona un archivo.');

      const accepted = acceptFiles[accept].split(',');
      const isCorrectFile = accepted.includes(extractedFile.type);
      if (!isCorrectFile) return handleError(`Solo puedes subir: ${accepted.join(', ')}`);

      const sizeMB = extractedFile.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) return handleError(`El archivo supera el tamaño máximo de ${maxSizeMB} MB.`);

      const uploadedUrl = await uploadFile(extractedFile);
      
      onChange?.(uploadedUrl);

      setErrorFile('');
      setFile(extractedFile);
      setFileUrl(uploadedUrl);
    } catch (error) {
      handleError(`Ocurrió un error inesperado. ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (msg: string) => {
    setErrorFile(msg);
    onChange?.(null);
    setFile(null);
    setFileUrl(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDownload = () => {
    const url = file ? URL.createObjectURL(file) : fileUrl;
    if (!url) return;
  
    if (!file && fileUrl) {
      // Si es una URL (archivo subido), abrir en nueva pestaña
      window.open(fileUrl, '_blank');
    } else {
      // Si es un archivo local, descargar
      const a = document.createElement('a');
      a.href = url;
      a.download = file?.name || 'archivo';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (file) URL.revokeObjectURL(url);
    }
  };

  const showFile = !!file || !!fileUrl;

  return (
    <Spin spinning={loading} size="small">
      <Box
        sx={{
          border: '1px solid',
          borderColor: errorFile ? 'error.main' : 'grey.300',
          borderRadius: 2,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 72,
          backgroundColor: 'background.paper',
          '&:hover': {
            borderColor: errorFile ? 'error.main' : 'primary.main',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              color: showFile ? '#79c944' : 'grey.600',
            }}
          >
            {showFile ? <CheckCircle sx={{ fontSize: 36 }} /> : <Upload sx={{ fontSize: 24 }} />}
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
              {label ?? 'Seleccione un archivo'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: errorFile ? 'error.main' : 'text.secondary',
                fontSize: 11,
                lineHeight: 1.2,
                mt: 0.5,
              }}
            >
              {errorFile || 
               file?.name || 
               (fileUrl ? `Archivo: ${fileUrl.split('/').pop() || 'documento'}` : null) ||
               `Max ${maxSizeMB}MB`}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {showFile && (
            <Button
              variant="contained"
              onClick={handleDownload}
              sx={{ padding: '4px 12px', background: '#151d29' }}
            >
              <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 500 }}>
                Descargar
              </Typography>
            </Button>
          )}

          {!showFile ? (
            <Button
              variant="outlined"
              size="small"
              color="primary"
              startIcon={<Upload />}
              sx={{
                position: 'relative',
                minWidth: 120,
                textTransform: 'none',
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              Subir archivo
              <input
                type="file"
                accept={acceptFiles[accept]}
                ref={fileRef}
                onChange={validateChange}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: 0,
                  cursor: 'pointer',
                }}
              />
            </Button>
          ) : (
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<Delete />}
              onClick={() => handleError('')}
              sx={{
                minWidth: 100,
                textTransform: 'none',
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              Eliminar
            </Button>
          )}
        </Box>
      </Box>
    </Spin>
  );
};

export default InputFile;
