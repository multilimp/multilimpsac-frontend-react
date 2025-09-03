
import { useState } from 'react';
import {
  Card,
  Avatar,
  Typography,
  Button,
  Row,
  Col,
  Modal,
  Form,
  Input,
  notification,
  Upload,
  message,
  Tag,
  Descriptions,
  Space,
  Divider,
  Grid
} from 'antd';
import {
  EditOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  CameraOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useAppContext } from '@/context';
import { RolesEnum } from '@/services/users/user.enum';
import { PERMISSION_LABELS } from '@/services/users/permissions.enum';
import { updateProfile, changePassword, uploadProfilePhoto } from '@/services/users/users.request';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const Profile = () => {
  const { user, setUser } = useAppContext();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const screens = useBreakpoint();

  if (!user?.id) {
    return (
      <div style={{ padding: '64px 24px', textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: 18 }}>
          No se pudo cargar la información del perfil
        </Text>
      </div>
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
      const updatedUser = await updateProfile(user.id, {
        nombre: values.nombre,
        email: values.email,
        telefono: values.telefono,
        departamento: values.departamento,
        ubicacion: values.ubicacion,
      });

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
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header Card - Información Principal */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} sm={8} md={6} style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                size={120}
                src={user.foto}
                icon={<UserOutlined />}
                style={{
                  border: '4px solid #1890ff',
                  marginBottom: 16
                }}
              />
              {/*  */}
            </div>
          </Col>

          <Col xs={24} sm={16} md={12}>
            <Title level={2} style={{ marginBottom: 8 }}>
              {user.nombre}
            </Title>

            <Space wrap style={{ marginBottom: 16 }}>
              <Tag
                icon={<SafetyCertificateOutlined />}
                color={user.role === RolesEnum.ADMIN ? 'blue' : 'default'}
              >
                {user.role === RolesEnum.ADMIN ? 'Administrador' : 'Usuario'}
              </Tag>
              <Tag color={user.estado ? 'success' : 'error'}>
                {user.estado ? 'Activo' : 'Inactivo'}
              </Tag>
            </Space>
          </Col>

          <Col xs={24} sm={24} md={6}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEditProfile}
                block={!screens.md}
                style={{ marginBottom: screens.md ? 0 : 8, width: '100%' }}
              >
                Editar Perfil
              </Button>
              <Button
                icon={<LockOutlined />}
                onClick={() => setPasswordModalOpen(true)}
                block={!screens.md}
                style={{ width: '100%' }}
              >
                Cambiar Contraseña
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {/* Información Personal */}
        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <UserOutlined />
                <span>Información Personal</span>
              </Space>
            }
            style={{ height: '100%' }}
          >
            <Descriptions column={1} size="middle">
              <Descriptions.Item
                label={
                  <Space>
                    <MailOutlined />
                    <span>Correo Electrónico</span>
                  </Space>
                }
              >
                <Text copyable>{user.email}</Text>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <Space>
                    <PhoneOutlined />
                    <span>Teléfono</span>
                  </Space>
                }
              >
                <Text type={user.telefono ? undefined : 'secondary'}>
                  {user.telefono || 'No especificado'}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <Space>
                    <TeamOutlined />
                    <span>Departamento</span>
                  </Space>
                }
              >
                <Text type={user.departamento ? undefined : 'secondary'}>
                  {user.departamento || 'No especificado'}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <Space>
                    <EnvironmentOutlined />
                    <span>Ubicación</span>
                  </Space>
                }
              >
                <Text type={user.ubicacion ? undefined : 'secondary'}>
                  {user.ubicacion || 'No especificado'}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Información del Sistema */}
        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <SafetyCertificateOutlined />
                <span>Información del Sistema</span>
              </Space>
            }
            style={{ height: '100%' }}
          >
            <Descriptions column={1} size="middle">
              {user.createdAt && (
                <Descriptions.Item
                  label={
                    <Space>
                      <CalendarOutlined />
                      <span>Fecha de Creación</span>
                    </Space>
                  }
                >
                  {new Date(user.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Descriptions.Item>
              )}

              {user.updatedAt && (
                <Descriptions.Item
                  label={
                    <Space>
                      <ClockCircleOutlined />
                      <span>Última Actualización</span>
                    </Space>
                  }
                >
                  {new Date(user.updatedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Descriptions.Item>
              )}

              <Descriptions.Item
                label={
                  <Space>
                    <SafetyCertificateOutlined />
                    <span>Tipo de Cuenta</span>
                  </Space>
                }
              >
                <Tag color={user.role === RolesEnum.ADMIN ? 'blue' : 'default'}>
                  {user.role === RolesEnum.ADMIN ? 'Administrador del Sistema' : 'Usuario'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Permisos de Acceso */}
        {user.permisos && user.permisos.length > 0 && (
          <Col xs={24}>
            <Card
              title={
                <Space>
                  <SafetyCertificateOutlined />
                  <span>Permisos de Acceso</span>
                </Space>
              }
            >
              <Space wrap style={{ marginBottom: 16 }}>
                {user.permisos.map((permiso) => (
                  <Tag key={permiso} color="processing">
                    {PERMISSION_LABELS[permiso as keyof typeof PERMISSION_LABELS] || permiso}
                  </Tag>
                ))}
              </Space>

              {user.role === RolesEnum.USER && (
                <>
                  <Divider />
                  <Text type="secondary">
                    <strong>Nota:</strong> Los permisos de acceso son asignados por el administrador del sistema.
                    Si necesitas acceso a módulos adicionales, contacta al administrador.
                  </Text>
                </>

              )}
            </Card>
          </Col>
        )}
      </Row>

      {/* Modal para editar perfil */}
      <Modal
        title="Editar Información Personal"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form
          form={profileForm}
          onFinish={handleSaveProfile}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="nombre"
                label="Nombre completo"
                rules={[{ required: true, message: 'El nombre es requerido' }]}
              >
                <Input size="large" placeholder="Ingresa tu nombre completo" />
              </Form.Item>
            </Col>

            <Col span={24}>
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
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="telefono"
                label="Teléfono"
              >
                <Input size="large" placeholder="+51 999 123 456" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="departamento"
                label="Departamento"
              >
                <Input size="large" placeholder="Área de trabajo" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="ubicacion"
                label="Ubicación"
              >
                <Input size="large" placeholder="Ciudad, País" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={() => setEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Guardar
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Modal para cambiar contraseña */}
      <Modal
        title="Cambiar Contraseña"
        open={passwordModalOpen}
        onCancel={() => setPasswordModalOpen(false)}
        footer={null}
        width={500}
      >
        <Form
          form={passwordForm}
          onFinish={handleChangePassword}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
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

          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={() => setPasswordModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Cambiar Contraseña
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
