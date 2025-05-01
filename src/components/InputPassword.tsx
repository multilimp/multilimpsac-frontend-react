import { forwardRef, useState } from 'react';
import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const InputPassword = forwardRef(({ ...rest }: TextFieldProps, ref) => {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      inputRef={ref}
      inputMode="search"
      type={visible ? 'text' : 'password'}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setVisible(!visible)}>{visible ? <VisibilityOff /> : <Visibility />}</IconButton>
          </InputAdornment>
        ),
      }}
      {...rest}
    />
  );
});

export default InputPassword;
