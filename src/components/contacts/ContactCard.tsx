import React, { useState } from 'react';
import { Card, Button, Form, Input, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { ContactProps, ContactUpdateProps } from '../../services/contacts/contacts.d';

interface ContactCardProps {
  contact: ContactProps;
  onUpdate: (contactId: number, data: ContactUpdateProps) => Promise<void>;
  onDelete: (contactId: number) => Promise<void>;
  loading?: boolean;
}

export const ContactCard: React.FC<ContactCardProps> = ({ 
  contact, 
  onUpdate, 
  onDelete, 
  loading = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = () => {
    form.setFieldsValue({
      nombre: contact.nombre,
      cargo: contact.cargo,
      telefono: contact.telefono,
      email: contact.email,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await onUpdate(contact.id, values);
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
      <Card
        size="small"
        title="Editando Contacto"
        extra={
          <Space>
            <Button 
              icon={<SaveOutlined />} 
              type="primary" 
              size="small"
              onClick={handleSave}
              loading={loading}
            />
            <Button 
              icon={<CloseOutlined />} 
              size="small"
              onClick={handleCancel}
            />
          </Space>
        }
        style={{ marginBottom: 8 }}
      >
        <Form form={form} layout="vertical" size="small">
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="cargo" label="Cargo" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="telefono" label="Teléfono">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input type="email" />
          </Form.Item>
        </Form>
      </Card>
    );
  }

  return (
    <Card
      size="small"
      title={contact.cargo}
      extra={
        <Space>
          <Button 
            icon={<EditOutlined />} 
            size="small"
            onClick={handleEdit}
          />
          <Popconfirm
            title="¿Eliminar contacto?"
            description="Esta acción no se puede deshacer"
            onConfirm={handleDelete}
            okText="Eliminar"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
          >
            <Button 
              icon={<DeleteOutlined />} 
              size="small"
              danger
            />
          </Popconfirm>
        </Space>
      }
      style={{ marginBottom: 8 }}
    >
      <p><strong>Nombre:</strong> {contact.nombre}</p>
      <p><strong>Teléfono:</strong> {contact.telefono || 'No especificado'}</p>
      <p><strong>Email:</strong> {contact.email || 'No especificado'}</p>
    </Card>
  );
};