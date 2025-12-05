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
  accept = 'application/pdf,image/*',
  value,
  editable = true,
}: SimpleFileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const dragCounterRef = useRef(0);
  const [fileUrl, setFileUrl] = useState<string | null>(value ?? null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Extraer nombre del archivo desde la URL
  const getFileNameFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const name = pathname.split('/').pop() || 'Archivo';
      // Decodificar caracteres especiales y limpiar
      return decodeURIComponent(name);
    } catch {
      return 'Archivo';
    }
  };

  // Validar tipo de archivo
  const isValidFileType = (file: File): boolean => {
    if (!accept) return true;
    const acceptedTypes = accept.split(',').map(t => t.trim());
    return acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        // Tipo genérico como image/* o application/*
        const baseType = type.replace('/*', '');
        return file.type.startsWith(baseType);
      }
      return file.type === type || file.name.toLowerCase().endsWith(type.replace('.', ''));
    });
  };

  // Función común para procesar archivo
  const processFile = async (file: File) => {
    if (!isValidFileType(file)) {
      console.warn('Tipo de archivo no permitido:', file.type);
      return;
    }

    setLoading(true);
    try {
      const uploadedUrl = await uploadFile(file);
      setFileUrl(uploadedUrl);
      setFileName(file.name);
      onChange?.(uploadedUrl);
    } catch (err) {
      setFileUrl(null);
      setFileName(null);
      onChange?.(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFileUrl(value ?? null);
    if (value) {
      setFileName(getFileNameFromUrl(value));
    } else {
      setFileName(null);
    }
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    await processFile(file);
  };

  // Handlers para drag and drop
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (editable && !fileUrl && !loading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    // Solo desactivar cuando realmente salimos del contenedor
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Mantener el estado de dragging activo
    if (editable && !fileUrl && !loading && !isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDragging(false);

    if (!editable || fileUrl || loading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleClear = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFileUrl(null);
    setFileName(null);
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
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        sx={{
          border: isDragging ? '2px dashed #1890ff' : '1px dashed #d9d9d9',
          borderRadius: 1,
          minHeight: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: editable ? 'pointer' : 'default',
          transition: 'all 0.35s ease-in-out',
          bgcolor: isDragging ? '#e6f7ff' : '#fafafa',
          transform: isDragging ? 'scale(1.02)' : 'none',
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
                {loading ? 'Subiendo...' : isDragging ? 'Soltar aquí' : 'Subir'}
              </Typography>
            </Stack>
          </Stack>
        ) : (
          <Stack direction="row" alignItems="center" spacing={1} width="100%" justifyContent={label ? "space-between" : "center"} sx={{ p: 1, px: 2 }}>
            {label && (
              <Typography sx={{
                color: 'black',
                userSelect: 'none',
                fontSize: 14,
                fontWeight: 500,
                flexShrink: 0,
              }}>
                {label}
              </Typography>
            )}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0, flex: label ? 1 : 'none', justifyContent: 'flex-end' }}>
              <Link
                component="button"
                type='button'
                underline="hover"
                sx={{
                  color: '#1890ff',
                  fontSize: 14,
                  fontWeight: 400,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: 200,
                }}
                onClick={handleDownload}
                title={fileName || 'Ver/Descargar archivo'}
              >
                {fileName || 'Ver archivo'}
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
                    flexShrink: 0,
                    '&:hover': { bgcolor: '#fff2f0' },
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              )}
            </Stack>
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