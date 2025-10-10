import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Alert,
    Chip,
    Divider,
    Fade
} from '@mui/material';
import { Form, notification } from 'antd';
import { Refresh as RefreshIcon, Save as SaveIcon, Description as DescriptionIcon, DateRange as DateRangeIcon, AttachFile as AttachFileIcon, Info as InfoIcon } from '@mui/icons-material';
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
            maxWidth="md"
            fullWidth
            TransitionComponent={Fade}
            transitionDuration={300}
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: 4,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    border: '1px solid #e5e7eb'
                }
            }}
        >
            <DialogTitle
                sx={{
                    bgcolor: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    color: '#92400e',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    py: 3,
                    px: 4,
                    borderBottom: '1px solid #f59e0b'
                }}
            >
                <Box
                    sx={{
                        bgcolor: '#f59e0b',
                        borderRadius: '50%',
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <RefreshIcon sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                        Refacturar Factura
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Crear nueva factura basada en la original
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 4, mt: 4 }}>
                <Form form={form} layout="vertical">
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <DescriptionIcon sx={{ color: '#6b7280', fontSize: 20 }} />
                                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                                    Número de Nueva Factura *
                                </Typography>
                            </Box>
                            <Form.Item
                                name="numeroFactura"
                                rules={[{ required: true, message: 'Número de factura requerido' }]}
                                style={{ marginBottom: 0 }}
                            >
                                <InputAntd
                                    placeholder="Ej: F001-00001234"
                                    size="small"
                                    style={{ borderRadius: 8 }}
                                />
                            </Form.Item>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <DateRangeIcon sx={{ color: '#6b7280', fontSize: 20 }} />
                                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                                    Fecha de Nueva Factura *
                                </Typography>
                            </Box>
                            <Form.Item
                                name="fechaFactura"
                                rules={[{ required: true, message: 'Fecha requerida' }]}
                                style={{ marginBottom: 0 }}
                            >
                                <DatePickerAntd
                                    size='small'
                                    style={{ width: '100%', borderRadius: 8 }}
                                />
                            </Form.Item>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <RefreshIcon sx={{ color: '#6b7280', fontSize: 20 }} />
                                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                                    Motivo de Refacturación (Nota de Crédito) *
                                </Typography>
                            </Box>
                            <Form.Item
                                name="notaCreditoTexto"
                                rules={[{ required: true, message: 'Motivo requerido' }]}
                                style={{ marginBottom: 0 }}
                            >
                                <InputAntd
                                    placeholder="Ej: Error en datos de factura, cambio de monto, etc."
                                    size="small"
                                    style={{ borderRadius: 8 }}
                                />
                            </Form.Item>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <AttachFileIcon sx={{ color: '#6b7280', fontSize: 20 }} />
                                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                                    Archivo de Nota de Crédito
                                </Typography>
                            </Box>
                            <Form.Item
                                name="notaCreditoArchivo"
                                style={{ marginBottom: 0 }}
                            >
                                <SimpleFileUpload editable={true} />
                            </Form.Item>
                        </Grid>
                    </Grid>
                </Form>

                <Divider sx={{ my: 4, borderColor: '#e5e7eb' }} />

                <Box
                    sx={{
                        p: 3,
                        bgcolor: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                        borderRadius: 3,
                        border: '1px solid #0ea5e9',
                        boxShadow: '0 4px 6px -1px rgba(14, 165, 233, 0.1)'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <InfoIcon sx={{ color: '#0ea5e9', fontSize: 20 }} />
                        <Typography variant="subtitle2" sx={{ color: '#0c4a6e', fontWeight: 600 }}>
                            Datos que se copiarán de la factura original
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ color: '#0c4a6e', fontWeight: 500 }}>
                                GRR:
                            </Typography>
                            <Chip
                                label={billing?.grr || 'N/A'}
                                size="small"
                                variant="outlined"
                                sx={{ borderColor: '#0ea5e9', color: '#0c4a6e' }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ color: '#0c4a6e', fontWeight: 500 }}>
                                Retención:
                            </Typography>
                            <Chip
                                label={`${billing?.retencion || 0}%`}
                                size="small"
                                variant="outlined"
                                sx={{ borderColor: '#0ea5e9', color: '#0c4a6e' }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ color: '#0c4a6e', fontWeight: 500 }}>
                                Detracción:
                            </Typography>
                            <Chip
                                label={`${billing?.detraccion || 0}%`}
                                size="small"
                                variant="outlined"
                                sx={{ borderColor: '#0ea5e9', color: '#0c4a6e' }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ color: '#0c4a6e', fontWeight: 500 }}>
                                Forma de Envío:
                            </Typography>
                            <Chip
                                label={billing?.formaEnvioFactura || 'N/A'}
                                size="small"
                                variant="outlined"
                                sx={{ borderColor: '#0ea5e9', color: '#0c4a6e' }}
                            />
                        </Box>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions
                sx={{
                    p: 4,
                    pt: 2,
                    borderTop: '1px solid #e5e7eb',
                    bgcolor: '#f9fafb'
                }}
            >
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    sx={{
                        borderColor: '#d1d5db',
                        color: '#6b7280',
                        '&:hover': {
                            borderColor: '#9ca3af',
                            bgcolor: '#f3f4f6'
                        }
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    startIcon={<SaveIcon />}
                    sx={{
                        bgcolor: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.39)',
                        '&:hover': {
                            bgcolor: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                            boxShadow: '0 6px 20px rgba(245, 158, 11, 0.23)'
                        },
                        '&:disabled': {
                            bgcolor: '#d1d5db',
                            color: '#9ca3af'
                        }
                    }}
                >
                    {loading ? 'Creando Refacturación...' : 'Crear Refacturación'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RefactorBillingModal;
