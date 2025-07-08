import { useState } from 'react';
import { Stack, Button as MuiButton } from '@mui/material';
import { Form, Select } from 'antd';
import heroUIColors, { alpha } from '@/styles/theme/heroui-colors';
import '@/components/ui/HeroInput.css';

interface EstadoOption {
  value: string;
  label: React.ReactNode;
}

interface EstadoSelectAndSubmitProps {
  form: any;
  name: string;
  options: EstadoOption[];
  loading?: boolean;
  onSubmit?: () => void;
  disabled?: boolean;
  buttonText?: string;
}

const estadoBgMap: Record<string, string> = {
  completo: heroUIColors.success[100],
  procesando: heroUIColors.secondary[100],
  pendiente: heroUIColors.warning[100],
  cancelado: heroUIColors.error[100],
  anulado: heroUIColors.error[100],
  rechazado: heroUIColors.error[100],
  incompleto: heroUIColors.warning[100],
};

const EstadoSelectAndSubmit: React.FC<EstadoSelectAndSubmitProps> = ({
  form,
  name,
  options,
  loading,
  onSubmit,
  disabled,
  buttonText = 'Guardar cambios',
}) => {
  const [selected, setSelected] = useState<string | undefined>(form.getFieldValue(name));

  // Actualiza el estado local y el valor del form
  const handleChange = (value: string) => {
    setSelected(value);
    form.setFieldValue(name, value);
  };

  // Determina el background según el estado seleccionado
  const selectBg = estadoBgMap[selected ?? ''] || heroUIColors.neutral[100];
  const selectBgHover = alpha(selectBg, 0.8);
  const selectBgFocus = alpha(selectBg, 0.9);

  return (
    <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" mt={3}>
      <Form.Item
        name={name}
        rules={[{ required: true, message: 'Seleccione un estado' }]}
        style={{ margin: 0, minWidth: 220 }}
      >
        <div
          style={{
            '--estado-bg': selectBg,
            '--estado-bg-hover': selectBgHover,
            '--estado-bg-focus': selectBgFocus,
          } as React.CSSProperties}
        >
          <Select
            className="hero-select hero-select-soft"
            placeholder="Selecciona el estado"
            size="large"
            value={selected}
            onChange={handleChange}
            style={{
              minWidth: 220,
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 16,
              boxShadow: '0 2px 8px rgba(4,186,107,0.07)',
              transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
            }}
            dropdownStyle={{
              borderRadius: 12,
              boxShadow: '0 10px 25px rgba(0,0,0,0.10)',
              fontSize: 16,
            }}
            options={options}
            showSearch={false}
          />
        </div>
      </Form.Item>
      <MuiButton
        variant="contained"
        color="primary"
        onClick={onSubmit}
        disabled={loading || disabled}
        sx={{
          minWidth: 180,
          fontWeight: 600,
          fontSize: 16,
          textTransform: 'none',
          borderRadius: 2,
          backgroundColor: '#4CAF50',
          boxShadow: '0 4px 15px 0 rgba(102, 126, 234, 0.15)',
        }}
      >
        {loading ? 'Guardando...' : buttonText}
      </MuiButton>
    </Stack>
  );
};

export default EstadoSelectAndSubmit;