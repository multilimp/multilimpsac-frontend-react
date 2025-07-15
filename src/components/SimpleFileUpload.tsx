import { Box, Typography, IconButton, Stack } from '@mui/material';
import { Upload, Delete } from '@mui/icons-material';
import { useRef, useState, useEffect } from 'react';

interface SimpleFileUploadProps {
  label?: string;
  onChange?: (file: File | null) => void;
  accept?: string;
  value?: File | null;
  editable?: boolean;
}

const SimpleFileUpload = ({
  onChange,
  accept = 'application/pdf',
  value,
  editable = true,
}: SimpleFileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(value ?? null);

  useEffect(() => {
    setSelectedFile(value ?? null);
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    onChange?.(file);
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = '';
    onChange?.(null);
  };

  return (
    <Box>
      <Box
        sx={{
          bgcolor: '#f3f6f9',
          borderRadius: 2,
          minHeight: 48,
          display: 'flex',
          // alignItems: 'center',
          justifyContent: 'center',
          cursor: editable ? 'pointer' : 'default',
          transition: 'background 0.2s',
          '&:hover': editable ? { bgcolor: '#e9eef5' } : undefined,
          // position: 'relative',
          // px: 2,
        }}
        onClick={() => {
          if (editable && !selectedFile) inputRef.current?.click();
        }}
      >
        {!selectedFile ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Upload sx={{ color: '#3B6EF6', fontSize: 28 }} />
            <Typography
              sx={{
                color: '#3B6EF6',
                userSelect: 'none',
              }}
            >
              Subir
            </Typography>
          </Stack>
        ) : (
          <Stack direction="row" alignItems="center" spacing={1} width="100%" justifyContent="center" sx={{ p: 1 }}>
            <Typography
              component="span"
              sx={{
                color: '#222',
                fontSize: 16,
                fontWeight: 500,
                textAlign: 'center',
                wordBreak: 'break-all',
                maxWidth: 260,
                flex: 1,
              }}
              title={selectedFile.name}
            >
              {selectedFile.name}
            </Typography>
            {editable && (
              <IconButton size="small" onClick={e => { e.stopPropagation(); handleClear(); }}>
                <Delete fontSize="small" />
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
          disabled={!editable}
        />
      </Box>
    </Box>
  );
};

export default SimpleFileUpload;