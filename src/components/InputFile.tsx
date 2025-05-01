import { message, Upload } from 'antd';
import { FormHelperText } from '@mui/material';

interface InputFileProps {
  onChange: (file: File) => void;
}

const InputFile = ({ onChange }: InputFileProps) => (
  <Upload
    multiple={false}
    listType="picture"
    maxCount={1}
    type="drag"
    accept="image/jpeg, image/png"
    beforeUpload={(file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Solo puedes subir imágenes');
        return;
      }
      onChange(file);
      return false;
    }}
  >
    <FormHelperText sx={{ lineHeight: 1, textAlign: 'center' }}>Seleccione el archivo</FormHelperText>
  </Upload>
);

export default InputFile;
