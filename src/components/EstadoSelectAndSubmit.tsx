import { useState, useEffect } from 'react';
import { Stack, Button as MuiButton } from '@mui/material';
import { Form, Select } from 'antd';
import { alpha } from '@mui/material/styles';
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

// Sistema de colores mejorado sin heroUIColors
const estadoBgMap: Record<string, string> = {
  completo: '#10B981',      // Verde éxito
  procesando: '#F59E0B',    // Naranja proceso (cambiado de azul)
  pendiente: '#F59E0B',     // Ámbar advertencia
  cancelado: '#EF4444',     // Rojo error
  anulado: '#EF4444',       // Rojo error
  rechazado: '#EF4444',     // Rojo error
  incompleto: '#F59E0B',    // Ámbar advertencia
  // Colores adicionales para otros estados
  activo: '#10B981',
  inactivo: '#6B7280',
  nuevo: '#8B5CF6',
  en_proceso: '#F59E0B',    // Naranja proceso (cambiado de azul)
  completado: '#10B981',
  retrasado: '#EF4444',
  pagado: '#10B981',
  facturado: '#10B981',     // Verde (cambiado de azul)
  cobrado: '#10B981',
  parcial: '#F59E0B',
  vencido: '#EF4444',
  // Estados específicos de facturación
  '1': '#F59E0B',          // Pendiente - Naranja
  '2': '#3B82F6',          // En Proceso - Azul
  '3': '#10B981',          // Completado - Verde
  '4': '#EF4444',          // Cancelado - Rojo
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

  // Efecto para sincronizar con cambios externos del formulario
  useEffect(() => {
    const currentValue = form.getFieldValue(name);
    setSelected(currentValue);
  }, [form, name, form.getFieldValue(name)]);

  // Actualiza el estado local y el valor del form
  const handleChange = (value: string) => {
    setSelected(value);
    form.setFieldValue(name, value);
  };

  // Determina el background según el estado seleccionado
  const selectBg = estadoBgMap[selected ?? ''] || '#F3F4F6'; // Gris neutro por defecto
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
            '--estado-text': '#FFFFFF',
            '--estado-shadow': alpha(selectBg, 0.2),
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
              color: '#fff', // Color blanco para el valor seleccionado
              backgroundColor: selectBg,
              boxShadow: `0 2px 8px ${alpha(selectBg, 0.3)}`,
              transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
              textAlign: 'center', // Centrar el texto
            }}
            dropdownStyle={{
              borderRadius: 12,
              boxShadow: '0 10px 25px rgba(0,0,0,0.10)',
              fontSize: 16,
            }}
            optionLabelProp="customLabel"
            options={options.map(opt => ({
              ...opt,
              label: <span style={{ color: estadoBgMap[opt.value] || '#222', fontWeight: 600 }}>{opt.label}</span>,
              customLabel: <span style={{ color: '#fff', fontWeight: 600 }}>{opt.label}</span>
            }))}
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
          height: 48,
          fontWeight: 600,
          fontSize: 16,
          textTransform: 'none',
          borderRadius: 2,
          backgroundColor: '#2114d8ff',
          boxShadow: '0 4px 15px 0 rgba(76, 175, 80, 0.25)',
          '&:hover': {
            backgroundColor: '#45A049',
            boxShadow: '0 6px 20px 0 rgba(76, 175, 80, 0.35)',
          },
          '&:disabled': {
            backgroundColor: '#E0E0E0',
            color: '#9E9E9E',
          },
        }}
      >
        {loading ? 'Guardando...' : buttonText}
      </MuiButton>
    </Stack>
  );
};

export default EstadoSelectAndSubmit;