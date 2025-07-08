import { Spin } from 'antd';
import { ChangeEvent, useRef, useState } from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { CheckCircle, Delete, Upload, Download } from '@mui/icons-material';

interface InputFileProps {
  label?: string;
  onChange?: (file: null | string) => void;
  accept?: keyof typeof acceptFiles;
}

const acceptFiles = {
  pdf: 'application/pdf',
  image: 'image/jpeg,image/png,image/jpg',
};

const InputFile = ({ onChange, label, accept = 'image' }: InputFileProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorFile, setErrorFile] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const validateChange = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);

      const extractedFile = event.target?.files?.[0];
      if (!extractedFile) return handleError('Selecciona un archivo.');

      const accepted = acceptFiles[accept].split(',');
      const isCorrectFile = accepted.includes(extractedFile.type);
      if (!isCorrectFile) return handleError(`Solo puedes subir ${accepted.join(', ')}.`);

      const sizeMB = extractedFile.size / (1024 * 1024);
      if (sizeMB > 1) return handleError('Supera el tamaño máximo');

      // const fileUrl = await uploadFile(extractedFile);
      const fileUrl = 'https://pub-be92c56cdc1645c5aac3eb28d9ddb2c8.r2.dev/general-uploads/L73_-7HanJ-y-tYeeeO1R.pdf';
      onChange?.(fileUrl);

      setErrorFile('');
      setFile(extractedFile);
    } catch (error) {
      handleError(`Ocurrió un error inesperado. ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (msg: string) => {
    setErrorFile(msg);
    onChange?.(null);
    fileRef.current!.value = '';
  };

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
          {/* Ícono de estado */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              color: file ? '#79c944' : 'grey.600',
            }}
          >
            {file ? <CheckCircle sx={{ fontSize: 36 }} /> : <Upload sx={{ fontSize: 24 }} />}
          </Box>

          {/* Información del archivo */}
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
              {errorFile || file?.name || 'Max 1MB'}
            </Typography>
          </Box>
        </Box>

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {file && (
            <Button
              variant='contained'
              onClick={() => {
                if (file) {
                  const url = URL.createObjectURL(file);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = file.name;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }
              }}
              sx={{
                padding: '4px 12px',
                background: '#151d29',
              }}
            >
              <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 500 }}>
                Descargar
              </Typography>
            </Button>
          )}
          
          {!file ? (
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
                disabled={!!file}
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
