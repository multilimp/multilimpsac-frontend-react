import { Box, Typography, IconButton, Stack, Link } from '@mui/material';
import { Upload, Close } from '@mui/icons-material';
import { useRef, useState, useEffect } from 'react';
import { uploadFile } from '@/services/files/file.requests'; // Ajusta la ruta si es necesario

interface SimpleFileUploadProps {
  label?: string;
  onChange?: (fileUrl: string | null) => void;
  accept?: string;
  value?: string | null;
  editable?: boolean;
}

const SimpleFileUpload = ({
  label,
  onChange,
  accept = '*', // Tipo de archivo por defecto: Todo
  value,
  editable = true,
}: SimpleFileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(value ?? null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFileUrl(value ?? null);
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    setLoading(true);
    try {
      const uploadedUrl = await uploadFile(file); // Sube el archivo y obtiene la URL
      setFileUrl(uploadedUrl);
      onChange?.(uploadedUrl);
    } catch (err) {
      // Manejo de error (puedes mostrar un mensaje)
      setFileUrl(null);
      onChange?.(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFileUrl(null);
    if (inputRef.current) inputRef.current.value = '';
    onChange?.(null);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!fileUrl) return;
    window.open(fileUrl, '_blank'); // Siempre abre la URL en nueva pestaña
  };

  return (
    <Box>
      <Box
        sx={{
          border: '1px dashed #d9d9d9',
          borderRadius: 1,
          minHeight: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: editable ? 'pointer' : 'default',
          transition: 'all 0.2s',
          bgcolor: '#fafafa',
          '&:hover': editable ? {
            borderColor: '#1890ff',
            bgcolor: '#f0f8ff'
          } : undefined,
        }}
        onClick={() => {
          if (editable && !fileUrl) inputRef.current?.click();
        }}
      >
        {!fileUrl ? (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={label ? "space-between" : "center"}
            sx={{ width: '100%', px: 2 }}
          >
            {label && (
              <Typography sx={{
                color: 'black',
                userSelect: 'none',
                fontSize: 14,
                fontWeight: 500
              }}>
                {label}
              </Typography>
            )}
            <Stack direction="row" alignItems="center" spacing={1}>
              <Upload sx={{ color: '#1890ff', fontSize: 20 }} />
              <Typography sx={{
                color: '#1890ff',
                userSelect: 'none',
                fontSize: 14,
                fontWeight: 400
              }}>
                {loading ? 'Subiendo...' : 'Subir'}
              </Typography>
            </Stack>
          </Stack>
        ) : (
          <Stack direction="row" alignItems="center" spacing={1} width="100%" justifyContent="center" sx={{ p: 1 }}>
            <Link
              component="button"
              type='button'
              underline="none"
              sx={{
                color: '#1890ff',
                fontSize: 14,
                fontWeight: 400,
                px: 0.5,
                cursor: 'pointer',
                maxWidth: 120,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              onClick={handleDownload}
              title="Ver/Descargar archivo"
            >
              {label ? `${label} subido` : 'Archivo subido'}
            </Link>
            {editable && (
              <IconButton
                size="small"
                onClick={handleClear}
                title="Eliminar archivo"
                sx={{
                  ml: 0.5,
                  color: '#ff4d4f',
                  fontSize: 16,
                  p: 0.5,
                  borderRadius: 1,
                  '&:hover': { bgcolor: '#fff2f0' },
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            )}
          </Stack>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          disabled={!editable || loading}
        />
      </Box>
    </Box>
  );
};

export default SimpleFileUpload;