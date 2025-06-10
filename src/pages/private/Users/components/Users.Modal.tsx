import { Form, notification, Spin, Select } from 'antd';
import InputAntd from '@/components/InputAntd';
import InputFile from '@/components/InputFile';
import SubmitButton from '@/components/SubmitButton';
import { UserProps } from '@/services/users/users';
import { postUser, putUser } from '@/services/users/users.request';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { RolesEnum } from '@/services/users/user.enum';

interface UsersModalProps {
  data?: UserProps;
  handleClose: VoidFunction;
  handleReload: VoidFunction;
}

const UsersModal = ({ data, handleClose, handleReload }: UsersModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data) {
      form.resetFields();
      return;
    }
    form.setFieldsValue({
      nombre: data.nombre,
      email: data.email,
      role: data.role,
      estado: data.estado,
    });
  }, [data, form]);

  const handleSubmit = async (raw: any) => {
    try {
      setLoading(true);

      const body: any = {
        nombre: raw.nombre,
        email: raw.email,
        role: raw.role,
        estado: raw.estado,
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
      maxWidth="sm"
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
                  <Select placeholder="Selecciona un rol">
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
