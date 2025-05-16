import { message, Upload } from 'antd';
import { FormHelperText } from '@mui/material';

interface InputFileProps {
  onChange: (file: null | File) => void;
  label?: string;
  disabled?: boolean;
  accept?: keyof typeof acceptFiles;
  height?: string | number;
}

const acceptFiles = {
  pdf: 'application/pdf',
  image: 'image/jpeg,image/png,image/jpg',
};

const InputFile = ({ onChange, label, disabled, accept = 'image', height = 'auto' }: InputFileProps) => (
  <Upload
    multiple={false}
    listType="picture"
    maxCount={1}
    type="drag"
    accept={acceptFiles[accept]}
    beforeUpload={(file) => {
      const isCorrectFile = acceptFiles[accept].split(',').includes(file.type);
      if (isCorrectFile) {
        onChange(file);
      } else {
        message.error(`Solo puedes subir ${accept === 'image' ? 'imágenes' : 'archivos PDF'}`);
        return Upload.LIST_IGNORE;
      }
      return false;
    }}
    // onChange={(info) => {
    //   console.log(typeof info.file, typeof info.fileList);
    //   console.log(info.file, info.fileList);
    //   // onChange(file);
    // }}
    style={disabled ? { pointerEvents: 'none', backgroundColor: '#eee', opacity: 0.75 } : {}}
  >
    <FormHelperText
      sx={{
        textAlign: 'center',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height,
      }}
    >
      {label ?? 'Seleccione el archivo'}
    </FormHelperText>
  </Upload>
);

export default InputFile;
