import React, { useState } from 'react';
import { Card, Button, Form, Input, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Divider,
  Card as MuiCard,
  CardContent
} from '@mui/material';
import {
  Person,
  Business,
  LocalPhone,
  Email,
  Edit,
  Delete,
  Cancel,
  Check,
  Event,
  Notes
} from '@mui/icons-material';
import { ContactProps, ContactUpdateProps } from '../../services/contacts/contacts.d';
import InputAntd from '../InputAntd';
import DatePickerAntd from '../DatePickerAnt'; import { heroUIColors } from '../ui';
interface ContactCardProps {
  contact: ContactProps;
  onUpdate: (contactId: number, data: ContactUpdateProps) => Promise<void>;
  onDelete: (contactId: number) => Promise<void>;
  loading?: boolean;
  readOnly?: boolean;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onUpdate,
  onDelete,
  loading = false,
  readOnly = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = () => {
    form.setFieldsValue({
      nombre: contact.nombre,
      cargo: contact.cargo,
      telefono: contact.telefono,
      email: contact.email,
      cumpleanos: contact.cumpleanos ? dayjs(contact.cumpleanos) : null,
      nota: contact.nota,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      // Procesar la fecha para enviarla en formato ISO al backend
      const processedValues = {
        ...values,
        cumpleanos: values.cumpleanos ? values.cumpleanos.toISOString() : null,
      };

      await onUpdate(contact.id, processedValues);
      setIsEditing(false);
    } catch (error) {
      console.error('Error al validar formulario:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async () => {
    await onDelete(contact.id);
  };

  if (isEditing) {
    return (
      <MuiCard
        sx={{
          background: '#1E293B',
          border: '2px solid #04BA6B',
          borderRadius: 2,
          backdropFilter: 'blur(10px)',
          mb: 1
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Edit sx={{ color: '#04BA6B', fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ color: '#04BA6B', fontWeight: 'bold' }}>
                Editando Contacto
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={handleSave}
                disabled={loading}
                size="small"
                sx={{
                  color: '#04BA6B',
                  backgroundColor: 'rgba(4, 186, 107, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(4, 186, 107, 0.2)',
                  }
                }}
              >
                <Check fontSize="small" />
              </IconButton>
              <IconButton
                onClick={handleCancel}
                size="small"
                sx={{
                  color: 'rgba(239, 68, 68, 0.8)',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  }
                }}
              >
                <Cancel fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          <Divider sx={{ borderColor: 'rgba(4, 186, 107, 0.3)', mb: 2 }} />

          <Form form={form} layout="vertical" size="small">

            {/* Sección: Información Personal */}
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Person sx={{ color: '#04BA6B', fontSize: 18 }} />
                <Typography variant="subtitle2" sx={{ color: '#04BA6B', fontWeight: 'bold' }}>
                  Información Personal
                </Typography>
              </Stack>
              <Divider sx={{ borderColor: 'rgba(4, 186, 107, 0.3)', mb: 2 }} />

              <Form.Item name="nombre" rules={[{ required: true }]} style={{ marginBottom: 12 }}>
                <InputAntd label="Nombre completo" size="small" />
              </Form.Item>
              <Form.Item name="cargo" rules={[{ required: true }]} style={{ marginBottom: 12 }}>
                <InputAntd label="Cargo / Posición" size="small" />
              </Form.Item>
            </Box>

            {/* Sección: Información de Contacto */}
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <LocalPhone sx={{ color: '#04BA6B', fontSize: 18 }} />
                <Typography variant="subtitle2" sx={{ color: '#04BA6B', fontWeight: 'bold' }}>
                  Información de Contacto
                </Typography>
              </Stack>
              <Divider sx={{ borderColor: 'rgba(4, 186, 107, 0.3)', mb: 2 }} />

              <Form.Item name="telefono" style={{ marginBottom: 12 }}>
                <InputAntd label="Teléfono / Celular" size="small" />
              </Form.Item>
              <Form.Item name="email" style={{ marginBottom: 12 }}>
                <InputAntd label="Correo electrónico" size="small" />
              </Form.Item>
            </Box>

            {/* Sección: Información Adicional */}
            <Box sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Event sx={{ color: '#04BA6B', fontSize: 18 }} />
                <Typography variant="subtitle2" sx={{ color: '#04BA6B', fontWeight: 'bold' }}>
                  Información Adicional
                </Typography>
              </Stack>
              <Divider sx={{ borderColor: 'rgba(4, 186, 107, 0.3)', mb: 2 }} />

              <Form.Item name="cumpleanos" style={{ marginBottom: 12 }}>
                <DatePickerAntd label="Fecha de cumpleaños" type="date" size="small" />
              </Form.Item>
              <Form.Item name="nota" style={{ marginBottom: 0 }}>
                <InputAntd label="Notas adicionales" type="textarea" rows={2} size="small" />
              </Form.Item>
            </Box>
          </Form>
        </CardContent>
      </MuiCard>
    );
  }

  return (
    <MuiCard
      sx={{
        background: 'rgba(15, 26, 43, 0.8)',
        border: '2px solid rgba(4, 186, 107, 0.3)',
        borderRadius: 2,
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        mb: 1,
        '&:hover': {
          borderColor: '#04BA6B',
          boxShadow: '0 4px 20px rgba(4, 186, 107, 0.2)',
          transform: 'translateY(-2px)',
        }
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ flex: 1 }}>
            {/* Header con nombre y cargo */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  color: heroUIColors.secondary[500],
                  fontWeight: 'bold',
                  mb: 0.5,
                  fontSize: '1rem'
                }}
              >
                {contact.nombre}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Business sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 16 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontStyle: 'italic'
                  }}
                >
                  {contact.cargo}
                </Typography>
              </Stack>
            </Box>

            <Divider sx={{ borderColor: 'rgba(4, 186, 107, 0.2)', mb: 2 }} />

            {/* Información de contacto */}
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <LocalPhone sx={{ color: heroUIColors.secondary[500], fontSize: 16 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  {contact.telefono || 'No especificado'}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={2}>
                <Email sx={{ color: '#d1b322ff', fontSize: 16 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    wordBreak: 'break-word'
                  }}
                >
                  {contact.email || 'No especificado'}
                </Typography>
              </Stack>

              {contact.cumpleanos && (
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Event sx={{ color: '#04BA6B', fontSize: 16 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    {new Date(contact.cumpleanos).toLocaleDateString('es-PE', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </Typography>
                </Stack>
              )}

              {contact.nota && (
                <Box sx={{ mt: 1 }}>
                  <Stack direction="row" alignItems="flex-start" spacing={2}>
                    <Notes sx={{ color: '#04BA6B', fontSize: 16, mt: 0.2 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontStyle: 'italic',
                        lineHeight: 1.4
                      }}
                    >
                      {contact.nota}
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Stack>
          </Box>

          {/* Botones de acción */}
          {!readOnly && (
            <Stack direction="row" spacing={0.5}>
              <IconButton
                onClick={handleEdit}
                size="small"
                sx={{
                  color: '#04BA6B',
                  backgroundColor: 'rgba(4, 186, 107, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(4, 186, 107, 0.2)',
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <Edit fontSize="small" />
              </IconButton>

              <Popconfirm
                title="¿Eliminar contacto?"
                description="Esta acción no se puede deshacer"
                onConfirm={handleDelete}
                okText="Eliminar"
                cancelText="Cancelar"
                okButtonProps={{ danger: true }}
              >
                <IconButton
                  size="small"
                  sx={{
                    color: 'rgba(239, 68, 68, 0.8)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    '&:hover': {
                      color: '#ef4444',
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      transform: 'scale(1.1)',
                    }
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Popconfirm>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </MuiCard>
  );
};