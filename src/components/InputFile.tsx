import { Spin } from 'antd';
import { ChangeEvent, useRef, useState } from 'react';
import { Card, CardHeader, IconButton } from '@mui/material';
import { Delete, FileUpload } from '@mui/icons-material';

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
      <Card variant="outlined" sx={{ borderColor: errorFile ? 'error.main' : '', borderRadius: 1 }}>
        <CardHeader
          sx={{ px: 1.5, py: 0.5 }}
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
    </Spin>
  );
};

export default InputFile;
