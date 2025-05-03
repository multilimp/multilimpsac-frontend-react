import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Space, Select } from 'antd';
import type { TransportProps } from '@/services/transports/transports';

const { Option } = Select;
const { TextArea } = Input;

interface TransportModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: TransportProps) => Promise<void>;
  transport?: TransportProps | null;
}

const coverageOptions: string[] = ['Nacional', 'Regional', 'Local', 'Internacional'];

const TransportModal: React.FC<TransportModalProps> = ({
  visible,
  onCancel,
  onSave,
  transport,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      ruc: transport?.ruc || '',
      socialReason: transport?.socialReason || '',
      contacts: transport?.contacts?.join(', ') || '',
      coverage: transport?.coverage || [],
      department: transport?.department || '',
      province: transport?.province || '',
      district: transport?.district || '',
      address: transport?.address || '',
    });
  }, [transport, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSave({
        ...values,
        contacts: values.contacts.split(',').map((item: string) => item.trim()),
        id: transport?.id || '',
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={transport ? 'Editar Transporte' : 'Nuevo Transporte'}
      open={visible}
      onCancel={onCancel}
      footer={
        <Space>
          <Button onClick={onCancel}>Cancelar</Button>
          <Button type="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        </Space>
      }
      width={800}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="RUC"
          name="ruc"
          rules={[{ required: true, message: 'Por favor ingrese el RUC' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Razón Social"
          name="socialReason"
          rules={[{ required: true, message: 'Por favor ingrese la razón social' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Contactos (separados por coma)"
          name="contacts"
          rules={[{ required: true, message: 'Por favor ingrese al menos un contacto' }]}
        >
          <Input placeholder="ejemplo@correo.com, 999888777" />
        </Form.Item>

        <Form.Item
          label="Cobertura"
          name="coverage"
          rules={[{ required: true, message: 'Por favor seleccione al menos una cobertura' }]}
        >
          <Select mode="multiple" placeholder="Seleccione cobertura">
            {coverageOptions.map((option: string) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item 
          label="Departamento" 
          name="department"
          rules={[{ required: true, message: 'Por favor ingrese el departamento' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item 
          label="Provincia" 
          name="province"
          rules={[{ required: true, message: 'Por favor ingrese la provincia' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item 
          label="Distrito" 
          name="district"
          rules={[{ required: true, message: 'Por favor ingrese el distrito' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item 
          label="Dirección" 
          name="address"
          rules={[{ required: true, message: 'Por favor ingrese la dirección' }]}
        >
          <TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TransportModal;