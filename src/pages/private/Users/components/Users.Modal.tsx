import { Form, notification, Spin, Select, Checkbox } from 'antd';
import InputAntd from '@/components/InputAntd';
import InputFile from '@/components/InputFile';
import SubmitButton from '@/components/SubmitButton';
import { UserProps } from '@/services/users/users';
import { postUser, putUser } from '@/services/users/users.request';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { RolesEnum } from '@/services/users/user.enum';
import { PermissionsEnum, PERMISSION_LABELS, DEFAULT_USER_PERMISSIONS } from '@/services/users/permissions.enum';

interface UsersModalProps {
  data?: UserProps;
  handleClose: VoidFunction;
  handleReload: VoidFunction;
}

const UsersModal = ({ data, handleClose, handleReload }: UsersModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RolesEnum>(RolesEnum.USER);

  useEffect(() => {
    if (!data) {
      form.resetFields();
      form.setFieldsValue({
        permisos: DEFAULT_USER_PERMISSIONS,
      });
      setSelectedRole(RolesEnum.USER);
      return;
    }
    form.setFieldsValue({
      nombre: data.nombre,
      email: data.email,
      role: data.role,
      estado: data.estado,
      permisos: data.permisos || DEFAULT_USER_PERMISSIONS,
    });
    setSelectedRole(data.role);
  }, [data, form]);

  const handleSubmit = async (raw: any) => {
    try {
      setLoading(true);

      const body: any = {
        nombre: raw.nombre,
        email: raw.email,
        role: raw.role,
        estado: raw.estado,
        permisos: raw.role === RolesEnum.ADMIN ? Object.values(PermissionsEnum) : raw.permisos,
      };

      if (raw.password) body.password = raw.password;

      if (data) await putUser(data.id, body);
      else await postUser(body);

      handleReload();
      handleClose();
    } catch (error) {
      notification.error({
        message: 'No se pudo guardar el usuario',
        description: String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open
      fullWidth
      maxWidth="md"
      sx={{
        zIndex: 1300, // Más alto que el sidebar (1200)
        '& .MuiDialog-paper': {
          zIndex: 1300,
        },
        '& .MuiBackdrop-root': {
          zIndex: 1299,
        },
      }}
    >
      <DialogTitle textAlign="center">{data ? 'Editar usuario' : 'Agregar usuario'}</DialogTitle>
      <DialogContent>
        <Spin spinning={loading}>
          <Form form={form} onFinish={handleSubmit} layout="vertical" style={{ marginTop: 8 }}>
            <Grid container columnSpacing={2}>
              {/* Nombre */}
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item name="nombre" rules={[{ required: true, message: 'El nombre es requerido' }]}>
                  <InputAntd label="Nombre" />
                </Form.Item>
              </Grid>

              {/* Correo */}
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'El correo es requerido' },
                    { type: 'email', message: 'Ingrese un correo válido' },
                  ]}
                >
                  <InputAntd label="Correo electrónico" />
                </Form.Item>
              </Grid>

              {/* Contraseña */}
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item name="password" rules={!data ? [{ required: true, message: 'La contraseña es requerida' }] : []}>
                  <InputAntd label="Contraseña" type="password" />
                </Form.Item>
              </Grid>

              {/* Rol */}
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item name="role" label="Rol" rules={[{ required: true, message: 'El rol es requerido' }]}>
                  <Select 
                    placeholder="Selecciona un rol"
                    onChange={(value) => setSelectedRole(value)}
                  >
                    {Object.values(RolesEnum).map((r) => (
                      <Select.Option key={r} value={r}>
                        {r}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Grid>

              {/* Estado */}
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item name="estado" label="Estado" rules={[{ required: true, message: 'El estado es requerido' }]}>
                  <Select placeholder="Selecciona estado">
                    <Select.Option value={true}>Activo</Select.Option>
                    <Select.Option value={false}>Inactivo</Select.Option>
                  </Select>
                </Form.Item>
              </Grid>

              {/* Foto de perfil */}
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item name="foto">
                  <InputFile label="Foto de perfil" onChange={(file) => form.setFieldValue('foto', file)} />
                </Form.Item>
              </Grid>

              {/* Permisos - Solo para usuarios USER */}
              {selectedRole === RolesEnum.USER && (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Permisos de Acceso
                    </Typography>
                    <Form.Item name="permisos">
                      <Checkbox.Group style={{ width: '100%' }}>
                        <Grid container spacing={1}>
                          {Object.values(PermissionsEnum)
                            .filter(permission => permission !== PermissionsEnum.USERS) // Excluir gestión de usuarios
                            .map((permission) => (
                              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={permission}>
                                <Checkbox value={permission}>
                                  {PERMISSION_LABELS[permission]}
                                </Checkbox>
                              </Grid>
                            ))}
                        </Grid>
                      </Checkbox.Group>
                    </Form.Item>
                  </Box>
                </Grid>
              )}

              {/* Mensaje para ADMIN */}
              {selectedRole === RolesEnum.ADMIN && (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ mt: 2, mb: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                    <Typography variant="body2" color="info.contrastText">
                      Los administradores tienen acceso completo a todos los módulos del sistema.
                    </Typography>
                  </Box>
                </Grid>
              )}

              {/* Submit oculto */}
              <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                <Button className="d-none" type="submit">
                  SUBMIT
                </Button>
              </Grid>
            </Grid>
          </Form>
        </Spin>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <SubmitButton form={form} onClick={() => form.submit()} loading={loading}>
          {data ? 'Guardar cambios' : 'Guardar'}
        </SubmitButton>
      </DialogActions>
    </Dialog>
  );
};

export default UsersModal;
