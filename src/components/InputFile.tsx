import { ChangeEvent, useRef, useState } from 'react';
import { Card, CardHeader, IconButton } from '@mui/material';
import { Delete, FileUpload } from '@mui/icons-material';

interface InputFileProps {
  label?: string;
  onChange?: (file: null | File) => void;
  accept?: keyof typeof acceptFiles;
}

const acceptFiles = {
  pdf: 'application/pdf',
  image: 'image/jpeg,image/png,image/jpg',
};

const InputFile = ({ onChange, label, accept = 'image' }: InputFileProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [errorFile, setErrorFile] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const validateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target?.files?.[0];
    if (!selected) return handleError('Selecciona un archivo.');

    const accepted = acceptFiles[accept].split(',');
    const isCorrectFile = accepted.includes(selected.type);
    if (!isCorrectFile) return handleError(`Solo puedes subir ${accepted.join(', ')}.`);

    const sizeMB = selected.size / (1024 * 1024);
    if (sizeMB > 1) return handleError('Supera el tamaño máximo');

    setErrorFile('');
    setFile(selected);
    onChange?.(selected);
  };

  const handleError = (msg: string) => {
    setErrorFile(msg);
    setFile(null);
    onChange?.(null);
    fileRef.current!.value = '';
  };

  return (
    <Card variant="outlined" sx={{ borderColor: errorFile ? 'error.main' : '', borderRadius: 1 }}>
      <CardHeader
        sx={{ px: 1.5, py: 0.5 }}
        // avatar={<InsertDriveFile color="success" />}
        title={label ?? 'Seleccione un archivo'}
        subheader={(errorFile || file?.name) ?? 'Max 1MB'}
        slotProps={{
          title: {
            variant: 'subtitle2',
            lineHeight: 0.9,
          },
          subheader: {
            color: errorFile ? 'error.main' : 'text.secondary',
            fontSize: 11,
            mt: 0.5,
            fontWeight: 400,
            lineHeight: 0.9,
          },
        }}
        action={
          !file ? (
            <IconButton size="large" color="success">
              <FileUpload />
              <input
                type="file"
                accept={acceptFiles[accept]}
                ref={fileRef}
                disabled={!!file}
                onChange={validateChange}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0, cursor: 'pointer' }}
              />
            </IconButton>
          ) : (
            <IconButton size="large" color="error" onClick={() => handleError('')}>
              <Delete />
            </IconButton>
          )
        }
      />
    </Card>
  );
};

export default InputFile;
