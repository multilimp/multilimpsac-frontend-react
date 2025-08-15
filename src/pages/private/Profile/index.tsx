
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  Avatar, 
  Container, 
  Button, 
  Card, 
  CardContent, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  Paper
} from '@mui/material';
import { 
  Email, 
  Person, 
  Edit, 
  Lock, 
  Phone, 
  Work, 
  LocationOn, 
  PhotoCamera,
  CalendarToday,
  AccessTime,
  Badge
} from '@mui/icons-material';
import { Form, notification, Input, Upload, message } from 'antd';
import { useAppContext } from '@/context';
import { RolesEnum } from '@/services/users/user.enum';
import { PERMISSION_LABELS } from '@/services/users/permissions.enum';
import { updateProfile, changePassword, uploadProfilePhoto } from '@/services/users/users.request';

const Profile = () => {
  const { user, setUser } = useAppContext();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  if (!user?.id) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" color="text.secondary">
            No se pudo cargar la información del perfil
          </Typography>
        </Box>
      </Container>
    );
  }

  const handleEditProfile = () => {
    profileForm.setFieldsValue({
      nombre: user.nombre,
      email: user.email,
      telefono: user.telefono || '',
      departamento: user.departamento || '',
      ubicacion: user.ubicacion || '',
    });
    setEditModalOpen(true);
  };

  const handleSaveProfile = async (values: Record<string, string>) => {
    try {
      setLoading(true);
      // Ahora todos los campos se guardan en la base de datos
      const updatedUser = await updateProfile(user.id, {
        nombre: values.nombre,
        email: values.email,
        telefono: values.telefono,
        departamento: values.departamento,
        ubicacion: values.ubicacion,
      });
      
      // Actualizar el contexto con todos los datos del servidor
      setUser({ ...user, ...updatedUser });
      
      setEditModalOpen(false);
      notification.success({
        message: 'Perfil actualizado',
        description: 'Tu información de perfil se ha actualizado correctamente.',
      });
    } catch {
      notification.error({
        message: 'Error al actualizar',
        description: 'No se pudo actualizar tu perfil. Inténtalo de nuevo.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values: Record<string, string>) => {
    try {
      setLoading(true);
      await changePassword(user.id, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      
      setPasswordModalOpen(false);
      passwordForm.resetFields();
      notification.success({
        message: 'Contraseña cambiada',
        description: 'Tu contraseña se ha actualizado correctamente.',
      });
    } catch {
      notification.error({
        message: 'Error al cambiar contraseña',
        description: 'Verifica que tu contraseña actual sea correcta.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Encabezado del Perfil */}
      <Paper elevation={3} sx={{ mb: 4, p: 4, borderRadius: 3 }}>
        <Grid container spacing={4} alignItems="center">
          {/* @ts-ignore */}
          <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Avatar
              src={user.foto}
              alt={user.nombre}
              sx={{
                width: 120,
                height: 120,
                mb: 2,
                  border: '4px solid',
                  borderColor: 'primary.light',
                }}
              >
                <Person sx={{ fontSize: 60 }} />
              </Avatar>
              <Upload
                accept="image/*"
                showUploadList={false}
                customRequest={async ({ file, onSuccess, onError }) => {
                  try {
                    const result = await uploadProfilePhoto(user.id, file as File);
                    setUser({ ...user, foto: result.photoUrl });
                    message.success('Foto de perfil actualizada correctamente');
                    onSuccess?.(result);
                  } catch (error) {
                    message.error('Error al actualizar foto de perfil');
                    onError?.(error as Error);
                  }
                }}
              >
                <Button
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: -8,
                    minWidth: 'auto',
                    borderRadius: '50%',
                    p: 1,
                  }}
                  variant="contained"
                >
                  <PhotoCamera sx={{ fontSize: 16 }} />
                </Button>
              </Upload>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              {user.nombre}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
                icon={<Badge />}
              label={user.role === RolesEnum.ADMIN ? 'Administrador' : 'Usuario'}
                color={user.role === RolesEnum.ADMIN ? 'primary' : 'default'}
                variant="outlined"
            />
            <Chip
              label={user.estado ? 'Activo' : 'Inactivo'}
              color={user.estado ? 'success' : 'error'}
                variant="outlined"
            />
          </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEditProfile}
                fullWidth
              >
                Editar Perfil
              </Button>
              <Button
                variant="outlined"
                startIcon={<Lock />}
                onClick={() => setPasswordModalOpen(true)}
                fullWidth
              >
                Cambiar Contraseña
              </Button>
      </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        {/* Información Personal */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
          <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Información Personal
            </Typography>
            
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Email sx={{ color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Correo Electrónico
                </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {user.email}
                </Typography>
                  </Box>
              </Box>
              
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Phone sx={{ color: user.telefono ? 'primary.main' : 'text.disabled' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Teléfono
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: user.telefono ? 'text.primary' : 'text.disabled' }}>
                      {user.telefono || 'No especificado'}
                </Typography>
                  </Box>
              </Box>
              
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Work sx={{ color: user.departamento ? 'primary.main' : 'text.disabled' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Departamento
                  </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: user.departamento ? 'text.primary' : 'text.disabled' }}>
                      {user.departamento || 'No especificado'}
                  </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocationOn sx={{ color: user.ubicacion ? 'primary.main' : 'text.disabled' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Ubicación
                  </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: user.ubicacion ? 'text.primary' : 'text.disabled' }}>
                      {user.ubicacion || 'No especificado'}
                  </Typography>
                  </Box>
                </Box>
            </Box>
          </CardContent>
        </Card>
        </Grid>

        {/* Información del Sistema */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Información del Sistema
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {user.createdAt && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CalendarToday sx={{ color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Fecha de Creación
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {new Date(user.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {user.updatedAt && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AccessTime sx={{ color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Última Actualización
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {new Date(user.updatedAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Badge sx={{ color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Tipo de Cuenta
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {user.role === RolesEnum.ADMIN ? 'Administrador del Sistema' : 'Usuario'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Permisos de Acceso */}
        {user.permisos && user.permisos.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Permisos de Acceso
      </Typography>
      
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {user.permisos.map((permiso) => (
                    <Chip
                      key={permiso}
                      label={PERMISSION_LABELS[permiso as keyof typeof PERMISSION_LABELS] || permiso}
                      variant="outlined"
                      color="primary"
                    />
                  ))}
        </Box>
        
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="body2" color="text.secondary">
                  <strong>Nota:</strong> Los permisos de acceso son asignados por el administrador del sistema. 
                  Si necesitas acceso a módulos adicionales, contacta al administrador.
            </Typography>
              </CardContent>
          </Card>
          </Grid>
        )}
      </Grid>

      {/* Modal para editar perfil */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Editar Información Personal</DialogTitle>
        <DialogContent>
          <Form form={profileForm} onFinish={handleSaveProfile} layout="vertical" style={{ marginTop: 16 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Form.Item
                  name="nombre"
                  label="Nombre completo"
                  rules={[{ required: true, message: 'El nombre es requerido' }]}
                >
                  <Input size="large" placeholder="Ingresa tu nombre completo" />
                </Form.Item>
              </Grid>
              
              <Grid item xs={12}>
                <Form.Item
                  name="email"
                  label="Correo electrónico"
                  rules={[
                    { required: true, message: 'El email es requerido' },
                    { type: 'email', message: 'Ingresa un email válido' }
                  ]}
                >
                  <Input size="large" type="email" placeholder="tu@email.com" />
                </Form.Item>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Form.Item
                  name="telefono"
                  label="Teléfono"
                >
                  <Input size="large" placeholder="+51 999 123 456" />
                </Form.Item>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Form.Item
                  name="departamento"
                  label="Departamento"
                >
                  <Input size="large" placeholder="Área de trabajo" />
                </Form.Item>
              </Grid>
              
              <Grid item xs={12}>
                <Form.Item
                  name="ubicacion"
                  label="Ubicación"
                >
                  <Input size="large" placeholder="Ciudad, País" />
                </Form.Item>
              </Grid>
            </Grid>
          </Form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={() => profileForm.submit()}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para cambiar contraseña */}
      <Dialog open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cambiar Contraseña</DialogTitle>
        <DialogContent>
          <Form form={passwordForm} onFinish={handleChangePassword} layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item
              name="currentPassword"
              label="Contraseña actual"
              rules={[{ required: true, message: 'Ingresa tu contraseña actual' }]}
            >
              <Input.Password size="large" />
            </Form.Item>
            
            <Form.Item
              name="newPassword"
              label="Nueva contraseña"
              rules={[
                { required: true, message: 'Ingresa una nueva contraseña' },
                { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>
            
            <Form.Item
              name="confirmPassword"
              label="Confirmar nueva contraseña"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Confirma tu nueva contraseña' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Las contraseñas no coinciden'));
                  },
                }),
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>
          </Form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordModalOpen(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={() => passwordForm.submit()}
            disabled={loading}
          >
            {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
