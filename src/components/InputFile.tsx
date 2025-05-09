import { message, Upload } from 'antd';
import { FormHelperText } from '@mui/material';

interface InputFileProps {
  onChange: (file: null | File) => void;
  label?: string;
  disabled?: boolean;
  accept?: keyof typeof acceptFiles;
}

const acceptFiles = {
  pdf: 'application/pdf',
  image: 'image/jpeg,image/png,image/jpg',
};

const InputFile = ({ onChange, label, disabled, accept = 'image' }: InputFileProps) => (
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
    <FormHelperText sx={{ lineHeight: 1, textAlign: 'center', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
      {label ?? 'Seleccione el archivo'}
    </FormHelperText>
  </Upload>
);

export default InputFile;
