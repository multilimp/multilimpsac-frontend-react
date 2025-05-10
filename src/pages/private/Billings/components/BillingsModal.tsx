
// src/pages/components/BillingsModal.tsx
import React, { useEffect, useState } from 'react';
import { BillingProps } from '@/services/billings/billings.d';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
} from 'antd';
import dayjs from 'dayjs';
import InputFile from '@/components/InputFile';
import { uploadFile } from '@/services/files/file.requests';

const { Option } = Select;

interface BillingsModalProps {
  data: BillingProps | null;
  open: boolean;
  onClose: () => void;
  onSave: (values: Omit<BillingProps, 'id'>, id?: number) => void;
}

const BillingsModal: React.FC<BillingsModalProps> = ({
  data, open, onClose, onSave,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        registerDate: data.registerDate && dayjs(data.registerDate),
        maxDeliveryDate: data.maxDeliveryDate && dayjs(data.maxDeliveryDate),
        deliveryDateOC: data.deliveryDateOC && dayjs(data.deliveryDateOC),
        receptionDate: data.receptionDate && dayjs(data.receptionDate),
        programmingDate: data.programmingDate && dayjs(data.programmingDate),
        invoiceDate: data.invoiceDate && dayjs(data.invoiceDate),
        isRefact: data.isRefact,
      });
    } else {
      form.resetFields();
    }
  }, [data, form]);

  const handleFinish = async (values: any) => {
    setLoading(true);
    const payload: any = {
      ...values,
      registerDate: values.registerDate.toISOString(),
      maxDeliveryDate: values.maxDeliveryDate.toISOString(),
      deliveryDateOC: values.deliveryDateOC.toISOString(),
      receptionDate: values.receptionDate.toISOString(),
      programmingDate: values.programmingDate.toISOString(),
      invoiceDate: values.invoiceDate ? values.invoiceDate.toISOString() : undefined,
    };

    if (values.oce instanceof File) {
      payload.oce = await uploadFile(values.oce);
    }
    if (values.ocf instanceof File) {
      payload.ocf = await uploadFile(values.ocf);
    }

    delete payload.oce;       // already replaced
    delete payload.ocf;

    await onSave(payload, data?.id);
    setLoading(false);
  };

  return (
    <Dialog open={open} fullWidth maxWidth="lg" onClose={onClose}>
      <DialogTitle>{data ? 'Editar' : 'Agregar'} Factura</DialogTitle>
      <DialogContent dividers>
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            style={{ marginTop: 16 }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
              <Form.Item name="saleId" label="ID Venta" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="clientRuc"
                label="RUC Cliente"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="clientBusinessName"
                label="Razón Social Cliente"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="companyRuc" label="RUC Empresa" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="companyBusinessName"
                label="Razón Social Empresa"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="contact" label="Contacto" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="registerDate"
                label="Fecha Registro"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="maxDeliveryDate"
                label="Fecha Máx Entrega"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="deliveryDateOC"
                label="Fecha Entrega O.C."
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="saleAmount"
                label="Monto Venta"
                rules={[{ required: true }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>

              <Form.Item name="oce" label="Documento OCE">
                <InputFile onChange={(file) => form.setFieldValue('oce', file)} />
              </Form.Item>
              <Form.Item name="ocf" label="Documento OCF">
                <InputFile onChange={(file) => form.setFieldValue('ocf', file)} />
              </Form.Item>

              <Form.Item
                name="receptionDate"
                label="Fecha Recepción"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="programmingDate"
                label="Fecha Programación"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="invoiceNumber" label="N° Factura">
                <Input />
              </Form.Item>
              <Form.Item name="invoiceDate" label="Fecha Factura">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item name="grr" label="GRR">
                <Input />
              </Form.Item>
              <Form.Item name="status" label="Estado" rules={[{ required: true }]}>
                <Select placeholder="Selecciona estado">
                  <Option value="pending">Pendiente</Option>
                  <Option value="paid">Pagado</Option>
                  <Option value="canceled">Cancelado</Option>
                  <Option value="processing">Procesando</Option>
                </Select>
              </Form.Item>
              <Form.Item name="isRefact" valuePropName="checked">
                <FormControlLabel
                  control={<Switch />}
                  label="Es Refacturación"
                />
              </Form.Item>
            </div>
          </Form>
        </Spin>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading} color="error" variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={() => form.submit()}
          disabled={loading}
          color="primary"
          variant="contained"
        >
          Guardar{data ? ' cambios' : ''}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BillingsModal;
