import { message, Upload } from 'antd';
import { FormHelperText } from '@mui/material';

interface InputFileProps {
  onChange: (file: File) => void;
  label?: string;
  disabled?: boolean;
}

const InputFile = ({ onChange, label, disabled }: InputFileProps) => (
  <Upload
    multiple={false}
    listType="picture"
    maxCount={1}
    type="drag"
    accept="image/jpeg, image/png"
    beforeUpload={(file) => {
      const isImage = file.type.startsWith('image/');
      if (isImage) onChange(file);
      else message.error('Solo puedes subir imágenes');
      return false;
    }}
    style={disabled ? { pointerEvents: 'none', backgroundColor: '#eee', opacity: 0.75 } : {}}
  >
    <FormHelperText sx={{ lineHeight: 1, textAlign: 'center', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
      {label ?? 'Seleccione el archivo'}{' '}
    </FormHelperText>
  </Upload>
);

export default InputFile;
