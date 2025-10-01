import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Alert
} from '@mui/material';
import { Form, notification } from 'antd';
import { Refresh as RefreshIcon, Save as SaveIcon } from '@mui/icons-material';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import DatePickerAntd from '@/components/DatePickerAnt';
import InputAntd from '@/components/InputAntd';
import SimpleFileUpload from '@/components/SimpleFileUpload';
import { createBilling } from '@/services/billings/billings.request';
import { BillingProps, BillingData } from '@/services/billings/billings.d';

interface RefactorBillingModalProps {
    open: boolean;
    billing: BillingProps | null;
    ordenCompraId: number;
    onClose: () => void;
    onSuccess: () => void;
}

const RefactorBillingModal: React.FC<RefactorBillingModalProps> = ({
    open,
    billing,
    ordenCompraId,
    onClose,
    onSuccess
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        form.resetFields();
        onClose();
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            if (!billing) {
                notification.error({
                    message: 'Error',
                    description: 'No se encontró la facturación original'
                });
                return;
            }

            const refacturacionData: BillingData = {
                ordenCompraId,
                factura: values.numeroFactura,
                fechaFactura: values.fechaFactura ? values.fechaFactura.toISOString() : null,
                grr: billing.grr,
                retencion: billing.retencion || 0,
                detraccion: billing.detraccion || 0,
                formaEnvioFactura: billing.formaEnvioFactura,
                facturaArchivo: billing.facturaArchivo,
                grrArchivo: billing.grrArchivo,
                notaCreditoTexto: values.notaCreditoTexto,
                notaCreditoArchivo: values.notaCreditoArchivo || null,
                esRefacturacion: true,
                idFacturaOriginal: billing.id
            };

            console.log('🔄 Creando refacturación:', refacturacionData);

            await createBilling(refacturacionData);

            notification.success({
                message: 'Refacturación exitosa',
                description: 'La nueva factura ha sido creada correctamente'
            });

            form.resetFields();
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error al refacturar:', error);
            notification.error({
                message: 'Error al refacturar',
                description: error instanceof Error ? error.message : 'No se pudo crear la refacturación'
            });
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (open && billing) {
            form.setFieldsValue({
                numeroFactura: billing.factura || '',
                fechaFactura: dayjs(),
                notaCreditoTexto: '',
                notaCreditoArchivo: null
            });
        }
    }, [open, billing, form]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: 3
                }
            }}
        >
            <DialogTitle sx={{ bgcolor: '#fef3c7', color: '#92400e', display: 'flex', alignItems: 'center', gap: 1 }}>
                <RefreshIcon />
                Refacturar Factura
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <Alert severity="info" sx={{ mb: 3 }}>
                    Se creará una nueva factura basada en <strong>{billing?.factura || 'la factura original'}</strong>
                </Alert>

                <Form form={form} layout="vertical">
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <Typography sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
                                Número de Nueva Factura *
                            </Typography>
                            <Form.Item
                                name="numeroFactura"
                                rules={[{ required: true, message: 'Número de factura requerido' }]}
                                style={{ marginBottom: 0 }}
                            >
                                <InputAntd
                                    placeholder="Ej: F001-00001234"
                                    size="large"
                                />
                            </Form.Item>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Typography sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
                                Fecha de Nueva Factura *
                            </Typography>
                            <Form.Item
                                name="fechaFactura"
                                rules={[{ required: true, message: 'Fecha requerida' }]}
                                style={{ marginBottom: 0 }}
                            >
                                <DatePickerAntd
                                    size="large"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Typography sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
                                Motivo de Refacturación (Nota de Crédito) *
                            </Typography>
                            <Form.Item
                                name="notaCreditoTexto"
                                rules={[{ required: true, message: 'Motivo requerido' }]}
                                style={{ marginBottom: 0 }}
                            >
                                <InputAntd
                                    placeholder="Ej: Error en datos de factura, cambio de monto, etc."
                                    size="large"
                                />
                            </Form.Item>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Typography sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
                                Archivo de Nota de Crédito
                            </Typography>
                            <Form.Item
                                name="notaCreditoArchivo"
                                style={{ marginBottom: 0 }}
                            >
                                <SimpleFileUpload editable={true} />
                            </Form.Item>
                        </Grid>
                    </Grid>
                </Form>

                <Box sx={{ mt: 3, p: 2, bgcolor: '#f0f9ff', borderRadius: 2, border: '1px solid #0ea5e9' }}>
                    <Typography variant="caption" sx={{ color: '#0c4a6e', display: 'block', mb: 1 }}>
                        📋 <strong>Datos que se copiarán de la factura original:</strong>
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#0c4a6e', display: 'block' }}>
                        • GRR: {billing?.grr || 'N/A'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#0c4a6e', display: 'block' }}>
                        • Retención: {billing?.retencion || 0}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#0c4a6e', display: 'block' }}>
                        • Detracción: {billing?.detraccion || 0}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#0c4a6e', display: 'block' }}>
                        • Forma de Envío: {billing?.formaEnvioFactura || 'N/A'}
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button onClick={handleClose} variant="outlined">
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    startIcon={<SaveIcon />}
                    sx={{
                        bgcolor: '#f59e0b',
                        '&:hover': {
                            bgcolor: '#d97706'
                        }
                    }}
                >
                    {loading ? 'Guardando...' : 'Crear Refacturación'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RefactorBillingModal;
