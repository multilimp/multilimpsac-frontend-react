import useContactsByEntity from '@/hooks/useContactsByEntity';
import { ContactTypeEnum } from '@/services/contacts/contacts.enum';
import { AddBox, Close, Person, Business, LocalPhone, Email, Event, Notes } from '@mui/icons-material';
import { Button, Card, CardActionArea, CardContent, CardHeader, Drawer, IconButton, Stack, Typography, Box, Divider } from '@mui/material';
import { Empty, Form, message, Skeleton } from 'antd';
import { useState } from 'react';
import InputAntd from './InputAntd';
import DatePickerAntd from './DatePickerAnt';
import { createContact } from '@/services/contacts/contacts.requests';
import { ContactCard } from './contacts/ContactCard';
import { heroUIColors } from './ui';

interface ContactsDrawerProps {
  handleClose: VoidFunction;
  tipo: ContactTypeEnum;
  referenceId: number;
  onContactCreated?: VoidFunction;
  title?: string;
  readOnly?: boolean;
}

const ContactsDrawer = ({ handleClose, tipo, referenceId, onContactCreated, title, readOnly = false }: ContactsDrawerProps) => {
  // Usar useContactsByEntity para filtrar correctamente por entidad específica
  const entityType = tipo.toLowerCase() as 'cliente' | 'proveedor' | 'transporte';
  const { contacts, loadingContacts, obtainContacts, updateContactData, deleteContactData } = useContactsByEntity(entityType, referenceId);

  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const isLoading = loading || loadingContacts;

  const onSubmit = async (values: Record<string, string>) => {
    try {
      setLoading(true);
      await createContact(values);
      setOpenForm(false);
      obtainContacts();
      onContactCreated?.(); // Notificar al componente padre
    } catch (error) {
      message.error(`No se logró guardar el contacto. ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      open
      anchor="right"
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          background: '#0f1a2b',
        }
      }}
    >
      <Box sx={{ width: 500 }}>
        {/* Header profesional */}
        <Box
          sx={{
            background: 'rgba(15, 26, 43, 0.9)',
            color: 'white',
            p: 3,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Person sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
                  CONTACTOS
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {title || 'Gestión de contactos empresariales'}
                </Typography>
              </Box>
            </Stack>
            <IconButton
              onClick={handleClose}
              disabled={isLoading}
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'scale(1.1)',
                  transition: 'all 0.2s ease'
                }
              }}
            >
              <Close fontSize="large" />
            </IconButton>
          </Stack>
        </Box>

        {/* Content area */}
        <Box sx={{
          height: 'calc(100vh - 120px)',
          overflow: 'auto',
          p: 2,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(4, 186, 107, 0.1)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#04BA6B',
            borderRadius: '4px',
          },
        }}>
          {isLoading ? (
            <Stack direction="column" spacing={2}>
              {/* Skeleton para simular tarjetas de contacto */}
              {[1, 2, 3].map((index) => (
                <Card
                  key={index}
                  sx={{
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(4, 186, 107, 0.3)',
                    borderRadius: 2,
                    p: 2.5,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ flex: 1 }}>
                      <Skeleton.Input
                        active
                        size="small"
                        style={{
                          width: '60%',
                          marginBottom: '8px'
                        }}
                      />
                      <Skeleton.Input
                        active
                        size="small"
                        style={{
                          width: '40%',
                          marginBottom: '16px'
                        }}
                      />
                      <Stack spacing={1}>
                        <Skeleton.Input
                          active
                          size="small"
                          style={{
                            width: '80%'
                          }}
                        />
                        <Skeleton.Input
                          active
                          size="small"
                          style={{
                            width: '70%'
                          }}
                        />
                      </Stack>
                    </Box>
                    <Stack direction="row" spacing={0.5}>
                      <Skeleton.Button
                        active
                        size="small"
                        style={{
                          borderRadius: '50%'
                        }}
                      />
                      <Skeleton.Button
                        active
                        size="small"
                        style={{
                          borderRadius: '50%'
                        }}
                      />
                    </Stack>
                  </Stack>
                </Card>
              ))}
            </Stack>
          ) : (
            <Stack direction="column" spacing={3}>
              {/* Lista de contactos existentes */}
              {contacts.length ? (
                contacts.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onUpdate={updateContactData}
                    onDelete={deleteContactData}
                    loading={isLoading}
                    readOnly={readOnly}
                  />
                ))
              ) : (
                <Box sx={{
                  textAlign: 'center',
                  py: 6,
                  color: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: 2,
                  border: '2px dashed rgba(4, 186, 107, 0.3)',
                  background: 'rgba(4, 186, 107, 0.05)',
                }}>
                  <Person sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Sin contactos registrados
                  </Typography>
                  <Typography variant="body2">
                    Agrega el primer contacto para comenzar
                  </Typography>
                </Box>
              )}

              {/* Botón/Formulario para agregar contacto */}
              {!readOnly && (
                <>
                  {openForm ? (
                    <CardForm handleClose={() => setOpenForm(false)} tipo={tipo} referenceId={referenceId} onSubmit={onSubmit} />
                  ) : (
                    <Card
                      sx={{
                        background: 'inherit',
                        border: '1px dashed #04BA6B',
                        borderRadius: 3,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <CardActionArea onClick={() => setOpenForm(true)} sx={{ p: 3 }}>
                        <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
                          <AddBox sx={{ fontSize: 40, color: '#04BA6B' }} />
                          <Typography variant="h6" sx={{ color: heroUIColors.secondary[500], fontWeight: 'bold' }}>
                            Agregar Nuevo Contacto
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>
                            Registra un nuevo contacto para esta entidad
                          </Typography>
                        </Stack>
                      </CardActionArea>
                    </Card>
                  )}
                </>
              )}
            </Stack>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default ContactsDrawer;

interface CardFormProps extends ContactsDrawerProps {
  onSubmit: (data: Record<string, any>) => void;
}

const CardForm = ({ handleClose, tipo, referenceId, onSubmit }: CardFormProps) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: Record<string, any>) => {
    const body: Record<string, any> = {
      nombre: values.nombre,
      cargo: values.cargo,
      telefono: values.telefono,
      email: values.email,
      tipo,
      cumpleanos: values.cumpleanos ? values.cumpleanos.toISOString() : undefined,
      nota: values.nota,
      referenciaId: referenceId,

      clienteId: undefined,
      proveedorId: undefined,
      transporteId: undefined,
    };

    if (tipo === ContactTypeEnum.CLIENTE) {
      body.clienteId = referenceId;
    } else if (tipo === ContactTypeEnum.PROVEEDOR) {
      body.proveedorId = referenceId;
    } else if (tipo === ContactTypeEnum.TRANSPORTE) {
      body.transporteId = referenceId;
    }

    onSubmit(body);
  };

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(4, 186, 107, 0.1) 50%, rgba(15, 26, 43, 0.9) 100%)',
        border: '2px solid #04BA6B',
        borderRadius: 3,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(4, 186, 107, 0.3)',
      }}
    >
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={2}>
            <AddBox sx={{ color: '#04BA6B' }} />
            <Typography variant="h6" sx={{ color: '#04BA6B', fontWeight: 'bold' }}>
              Nuevo Contacto
            </Typography>
          </Stack>
        }
        sx={{ pb: 1 }}
      />
      <CardContent sx={{ pt: 0 }}>
        <Form form={form} onFinish={handleSubmit} layout="vertical">

          {/* Sección: Información Personal */}
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <Person sx={{ color: '#04BA6B', fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ color: '#04BA6B', fontWeight: 'bold' }}>
                Información Personal
              </Typography>
            </Stack>
            <Divider sx={{ borderColor: 'rgba(4, 186, 107, 0.3)', mb: 2 }} />

            <Form.Item
              name="nombre"
              rules={[{ required: true, message: 'El nombre es requerido' }]}
              style={{ marginBottom: 16 }}
            >
              <InputAntd label="Nombre completo" />
            </Form.Item>

            <Form.Item
              name="cargo"
              rules={[{ required: true, message: 'El cargo es requerido' }]}
              style={{ marginBottom: 16 }}
            >
              <InputAntd label="Cargo / Posición" />
            </Form.Item>
          </Box>

          {/* Sección: Información de Contacto */}
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <LocalPhone sx={{ color: '#04BA6B', fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ color: '#04BA6B', fontWeight: 'bold' }}>
                Información de Contacto
              </Typography>
            </Stack>
            <Divider sx={{ borderColor: 'rgba(4, 186, 107, 0.3)', mb: 2 }} />

            <Form.Item
              name="telefono"
              rules={[
                { required: true, message: 'El teléfono es requerido' },
                { pattern: /^[\d+\-\s()]+$/, message: 'Formato de teléfono inválido' }
              ]}
              style={{ marginBottom: 16 }}
            >
              <InputAntd label="Teléfono / Celular" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { type: 'email', message: 'Formato de email inválido' }
              ]}
              style={{ marginBottom: 16 }}
            >
              <InputAntd label="Correo electrónico (opcional)" />
            </Form.Item>
          </Box>

          {/* Sección: Información Adicional */}
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <Event sx={{ color: '#04BA6B', fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ color: '#04BA6B', fontWeight: 'bold' }}>
                Información Adicional
              </Typography>
            </Stack>
            <Divider sx={{ borderColor: 'rgba(4, 186, 107, 0.3)', mb: 2 }} />

            <Form.Item name="cumpleanos" style={{ marginBottom: 16 }}>
              <DatePickerAntd label="Fecha de cumpleaños" type="date" />
            </Form.Item>

            <Form.Item name="nota" style={{ marginBottom: 0 }}>
              <InputAntd
                label="Notas adicionales"
                type="textarea"
                rows={3}
              />
            </Form.Item>
          </Box>

          {/* Botones de acción */}
          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button
              fullWidth
              type="submit"
              sx={{
                background: 'linear-gradient(135deg, #04BA6B 0%, #26c985 100%)',
                color: 'white',
                fontWeight: 'bold',
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(135deg, #039354 0%, #04BA6B 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px rgba(4, 186, 107, 0.4)',
                }
              }}
            >
              GUARDAR CONTACTO
            </Button>
            <Button
              color="error"
              variant="outlined"
              fullWidth
              onClick={handleClose}
              sx={{
                borderColor: 'rgba(239, 68, 68, 0.5)',
                color: 'rgba(239, 68, 68, 0.8)',
                py: 1.5,
                '&:hover': {
                  borderColor: '#ef4444',
                  color: '#ef4444',
                  background: 'rgba(239, 68, 68, 0.1)',
                }
              }}
            >
              CANCELAR
            </Button>
          </Stack>
        </Form>
      </CardContent>
    </Card>
  );
};
