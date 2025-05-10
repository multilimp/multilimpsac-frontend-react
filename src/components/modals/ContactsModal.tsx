
import React, { useEffect, useState } from 'react';
import { Form, notification, Spin } from 'antd';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import InputAntd from '@/components/InputAntd';
import SubmitButton from '@/components/SubmitButton';
import { createContact, updateContact } from '@/services/contacts/contacts.requests';
import { ContactProps } from '@/services/contacts/contacts';

interface ContactsModalProps {
  data?: ContactProps;
  handleClose: VoidFunction;
  handleReload: VoidFunction;
  entityType: 'cliente' | 'proveedor' | 'transporte';
  entityId: number;
}

const ContactsModal: React.FC<ContactsModalProps> = ({ data, handleClose, handleReload, entityType, entityId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data) return;

    form.setFieldsValue({
      nombre: data.nombre,
      telefono: data.telefono,
      email: data.email,
      cargo: data.cargo,
      cumpleanos: data.cumpleanos,
      nota: data.nota,
    });
  }, [data, form]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      const contactData: Partial<ContactProps> = {
        ...values,
        tipo: entityType,
        referenciaId: entityId
      };

      // Set the appropriate entity ID field based on entityType
      if (entityType === 'cliente') {
        contactData.clienteId = entityId;
      } else if (entityType === 'proveedor') {
        contactData.proveedorId = entityId;
      } else if (entityType === 'transporte') {
        contactData.transporteId = entityId;
      }

      if (data) {
        await updateContact(data.id, contactData);
        notification.success({ message: 'Contacto actualizado correctamente' });
      } else {
        await createContact(contactData);
        notification.success({ message: 'Contacto creado correctamente' });
      }

      handleClose();
      handleReload();
    } catch (error) {
      notification.error({
        message: 'Error al guardar el contacto',
        description: `Detalles: ${error instanceof Error ? error.message : String(error)}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open fullWidth maxWidth="md">
      <DialogTitle>{data ? 'Editar' : 'Agregar'} Contacto</DialogTitle>
      <DialogContent>
        <Spin spinning={loading}>
          <Form form={form} onFinish={handleSubmit} layout="vertical" style={{ marginTop: 16 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Form.Item name="nombre" rules={[{ required: true, message: 'El nombre es requerido' }]}>
                  <InputAntd label="Nombre" />
                </Form.Item>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Form.Item name="cargo" rules={[{ required: true, message: 'El cargo es requerido' }]}>
                  <InputAntd label="Cargo" />
                </Form.Item>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Form.Item name="telefono" rules={[{ required: true, message: 'El teléfono es requerido' }]}>
                  <InputAntd label="Teléfono" />
                </Form.Item>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Form.Item name="email" rules={[{ required: true, message: 'El email es requerido' }]}>
                  <InputAntd label="Email" />
                </Form.Item>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Form.Item name="cumpleanos">
                  <InputAntd label="Fecha de Cumpleaños" type="date" />
                </Form.Item>
              </Grid>
              <Grid item xs={12}>
                <Form.Item name="nota">
                  <InputAntd label="Nota" type="textarea" />
                </Form.Item>
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
          {data ? 'Actualizar' : 'Guardar'} Contacto
        </SubmitButton>
      </DialogActions>
    </Dialog>
  );
};

export default ContactsModal;
