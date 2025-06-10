// src/pages/components/TrackingsModal.tsx
import React, { useEffect, useState } from 'react';
import { TrackingProps } from '@/services/trackings/trackings.d';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Switch, Grid } from '@mui/material';
import { DatePicker, Form, Input, InputNumber, Select, Spin } from 'antd';
import dayjs from 'dayjs';
import InputFile from '@/components/InputFile';

const { Option } = Select;

interface Props {
  data: TrackingProps | null;
  open: boolean;
  onClose: () => void;
  onSave: (values: Omit<TrackingProps, 'id'>, id?: number) => void;
}

const TrackingsModal: React.FC<Props> = ({ data, open, onClose, onSave }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        maxDeliveryDate: data.maxDeliveryDate && dayjs(data.maxDeliveryDate),
        peruPurchasesDate: data.peruPurchasesDate && dayjs(data.peruPurchasesDate),
        deliveryDateOC: data.deliveryDateOC && dayjs(data.deliveryDateOC),
      });
    } else {
      form.resetFields();
    }
  }, [data, form]);

  const submit = async (vals: any) => {
    setSaving(true);
    const payload: any = {
      ...vals,
      maxDeliveryDate: vals.maxDeliveryDate.toISOString(),
      peruPurchasesDate: vals.peruPurchasesDate?.toISOString(),
      deliveryDateOC: vals.deliveryDateOC?.toISOString(),
    };

    await onSave(payload, data?.id);
    setSaving(false);
  };

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="xl"
      onClose={onClose}
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
      <DialogTitle>{data ? 'Editar' : 'Agregar'} Seguimiento</DialogTitle>
      <DialogContent dividers>
        <Spin spinning={saving}>
          <Form form={form} layout="vertical" onFinish={submit} initialValues={{ utility: 0 }}>
            <Grid container spacing={2}>
              {/* Campos básicos */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Form.Item name="saleId" label="ID Venta" rules={[{ required: true }]}>
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Form.Item name="clientRuc" label="RUC Cliente" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Form.Item name="companyRuc" label="RUC Empresa" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Form.Item name="companyBusinessName" label="Razón Social Empresa">
                  <Input />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Form.Item name="clientName" label="Cliente" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Form.Item name="maxDeliveryDate" label="Fecha Máx. Entrega" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Form.Item name="saleAmount" label="Monto Venta" rules={[{ required: true }]}>
                  <InputNumber style={{ width: '100%' }} min={0} formatter={(v) => `S/ ${v}`} />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Form.Item name="cue" label="CUE">
                  <Input />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Form.Item name="department" label="Departamento">
                  <Input />
                </Form.Item>
              </Grid>

              {/* Documentos PDF */}

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item name="oce" label="Documento OCE">
                  <InputFile label="Selecciona el PDF de OCE" onChange={(file) => form.setFieldValue('oce', file)} />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item name="ocf" label="Documento OCF">
                  <InputFile label="Selecciona el PDF de OCF" onChange={(file) => form.setFieldValue('ocf', file)} />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item name="peruPurchases" label="Documento Perú Compras">
                  <InputFile label="Selecciona el PDF de Perú Compras" onChange={(file) => form.setFieldValue('peruPurchases', file)} />
                </Form.Item>
              </Grid>

              {/* Resto de campos */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Form.Item name="grr" label="GRR">
                  <Input />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Form.Item name="invoiceNumber" label="Factura">
                  <Input />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                <Form.Item name="isRefact" label="Refact" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Form.Item name="peruPurchasesDate" label="Fecha Perú Compras">
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Form.Item name="deliveryDateOC" label="Fecha Entrega OC">
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Form.Item name="utility" label="Utilidad (%)">
                  <InputNumber min={0} max={100} style={{ width: '100%' }} />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Form.Item name="status" label="Estado" rules={[{ required: true }]}>
                  <Select placeholder="Selecciona estado">
                    <Option value="pending">Pendiente</Option>
                    <Option value="in_progress">En Progreso</Option>
                    <Option value="delivered">Entregado</Option>
                    <Option value="canceled">Cancelado</Option>
                  </Select>
                </Form.Item>
              </Grid>
            </Grid>
          </Form>
        </Spin>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving} color="error" variant="outlined">
          Cancelar
        </Button>
        <Button onClick={() => form.submit()} disabled={saving} color="primary" variant="contained">
          Guardar{data ? ' cambios' : ''}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TrackingsModal;
