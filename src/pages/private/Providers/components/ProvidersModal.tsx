import React, { useEffect } from 'react'; // Importar useEffect
import { Modal, Form, Input, Button, Space } from 'antd';
import { ProviderProps } from '@/services/providers/providers';

interface ProviderModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  provider?: ProviderProps | null;
}

const ProviderModal: React.FC<ProviderModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  provider
}) => {
  const [form] = Form.useForm();

  // Efecto para inicializar el formulario
  useEffect(() => {
    form.setFieldsValue({
      ruc: provider?.ruc || '',
      socialReason: provider?.socialReason || '',
      contacts: provider?.contacts?.join(', ') || '',
      department: provider?.department || '',
      province: provider?.province || '',
      district: provider?.district || '',
      address: provider?.address || ''
    });
  }, [provider, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Submit:', values);
      onSuccess();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={provider ? 'Editar Proveedor' : 'Nuevo Proveedor'}
      open={visible}
      onCancel={onCancel}
      footer={(
        <Space>
          <Button onClick={onCancel}>Cancelar</Button>
          <Button type="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        </Space>
      )}
      width={800}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="RUC" name="ruc" rules={[{ required: true, message: 'El RUC es requerido' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Razón Social" name="socialReason" rules={[{ required: true, message: 'La razón social es requerida' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Contactos (separados por coma)" name="contacts">
          <Input />
        </Form.Item>
        <Form.Item label="Departamento" name="department">
          <Input />
        </Form.Item>
        <Form.Item label="Provincia" name="province">
          <Input />
        </Form.Item>
        <Form.Item label="Distrito" name="district">
          <Input />
        </Form.Item>
        <Form.Item label="Dirección" name="address">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProviderModal;