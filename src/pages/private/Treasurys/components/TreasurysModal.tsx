// src/components/treasurys/TreasurysModal.tsx
import { Form, notification, Spin, Select } from 'antd';
import InputAntd from '@/components/InputAntd';
import SubmitButton from '@/components/SubmitButton';
import { TreasurysProps } from '@/services/treasurys/treasurys.d';
import { createTreasury, updateTreasury } from '@/services/treasurys/treasurys.request';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { useEffect, useState } from 'react';

interface TreasurysModalProps {
  data?: TreasurysProps | null;
  open: boolean;
  onClose: VoidFunction;
  onReload: VoidFunction;
}

const STATUS_OPTIONS = [
  { label: 'Pendiente', value: 'pending' },
  { label: 'Aprobado', value: 'approved' },
  { label: 'Rechazado', value: 'rejected' },
  { label: 'Procesado', value: 'processed' },
];

export default function TreasurysModal({ data = null, open, onClose, onReload }: TreasurysModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        saleCode: data.saleCode,
        clientBusinessName: data.clientBusinessName,
        clientRuc: data.clientRuc,
        companyRuc: data.companyRuc,
        companyBusinessName: data.companyBusinessName,
        contact: data.contact,
        status: data.status,
      });
    } else {
      form.resetFields();
    }
  }, [data, form]);

  const handleSubmit = async (raw: Record<string, any>) => {
    try {
      setLoading(true);
      const payload: Omit<TreasurysProps, 'id'> = {
        saleCode: raw.saleCode,
        clientBusinessName: raw.clientBusinessName,
        clientRuc: raw.clientRuc,
        companyRuc: raw.companyRuc,
        companyBusinessName: raw.companyBusinessName,
        contact: raw.contact,
        status: raw.status,
      };
      if (data?.id) {
        await updateTreasury(data.id, payload);
        notification.success({ message: 'Registro actualizado correctamente' });
      } else {
        await createTreasury(payload);
        notification.success({ message: 'Registro creado correctamente' });
      }
      onClose();
      onReload();
    } catch (error) {
      notification.error({
        message: 'Error al guardar registro de tesorería',
        description: String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle variant="h5" textAlign="center">
        {data ? 'Editar' : 'Agregar'} registro de tesorería
      </DialogTitle>
      <DialogContent>
        <Spin spinning={loading}>
          <Form form={form} onFinish={handleSubmit} layout="vertical" style={{ marginTop: 8 }}>
            <Grid container columnSpacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item
                  name="saleCode"
                  rules={[{ required: true, message: 'Código de venta es requerido' }]}
                >
                  <InputAntd label="Código Venta" />
                </Form.Item>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item
                  name="clientBusinessName"
                  rules={[{ required: true, message: 'Razón social del cliente es requerida' }]}
                >
                  <InputAntd label="Razón Social Cliente" />
                </Form.Item>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item
                  name="clientRuc"
                  rules={[
                    { required: true, message: 'RUC del cliente es requerido' },
                    { len: 11, message: 'El RUC debe tener 11 dígitos' },
                  ]}
                >
                  <InputAntd label="RUC Cliente" maxLength={11} />
                </Form.Item>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item
                  name="companyRuc"
                  rules={[
                    { required: true, message: 'RUC de la empresa es requerido' },
                    { len: 11, message: 'El RUC debe tener 11 dígitos' },
                  ]}
                >
                  <InputAntd label="RUC Empresa" maxLength={11} />
                </Form.Item>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item
                  name="companyBusinessName"
                  rules={[{ required: true, message: 'Razón social de la empresa es requerida' }]}
                >
                  <InputAntd label="Razón Social Empresa" />
                </Form.Item>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item
                  name="contact"
                  rules={[{ required: true, message: 'Contacto es requerido' }]}
                >
                  <InputAntd label="Contacto" />
                </Form.Item>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item
                  name="status"
                  rules={[{ required: true, message: 'Seleccione un estado' }]}
                >
                  <Select options={STATUS_OPTIONS} placeholder="Estado" />
                </Form.Item>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button className="d-none" type="submit">
                  SUBMIT
                </Button>
              </Grid>
            </Grid>
          </Form>
        </Spin>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <SubmitButton form={form} onClick={() => form.submit()} loading={loading}>
          Guardar{data ? ' cambios' : ''}
        </SubmitButton>
      </DialogActions>
    </Dialog>
  );
}
