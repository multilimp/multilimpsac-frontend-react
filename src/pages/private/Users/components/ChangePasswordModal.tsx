import { Form, notification, Spin } from 'antd';
import InputAntd from '@/components/InputAntd';
import SubmitButton from '@/components/SubmitButton';
import { UserProps } from '@/services/users/users';
import { adminChangePassword } from '@/services/users/users.request';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, Box } from '@mui/material';
import { useState } from 'react';
import { LockReset } from '@mui/icons-material';

interface ChangePasswordModalProps {
    user: UserProps;
    handleClose: VoidFunction;
}

const ChangePasswordModal = ({ user, handleClose }: ChangePasswordModalProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);

            // Validar que las contraseñas coincidan
            if (values.newPassword !== values.confirmPassword) {
                notification.error({
                    message: 'Error de validación',
                    description: 'Las contraseñas no coinciden',
                });
                return;
            }

            // Llamar al servicio para cambiar la contraseña (como admin)
            await adminChangePassword(user.id, values.newPassword);

            notification.success({
                message: 'Contraseña actualizada',
                description: `La contraseña de ${user.nombre} ha sido actualizada exitosamente`,
            });

            handleClose();
        } catch (error: any) {
            notification.error({
                message: 'Error al cambiar contraseña',
                description: error?.response?.data?.message || String(error),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open
            fullWidth
            maxWidth="sm"
            sx={{
                zIndex: 1400, // Más alto que otros modales
                '& .MuiDialog-paper': {
                    zIndex: 1400,
                },
                '& .MuiBackdrop-root': {
                    zIndex: 1399,
                },
            }}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LockReset color="primary" />
                    <div>
                        <Typography variant="h6">Cambiar Contraseña</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Usuario: {user.nombre} ({user.email})
                        </Typography>
                    </div>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Spin spinning={loading}>
                    <Form form={form} onFinish={handleSubmit} layout="vertical" style={{ marginTop: 16 }}>
                        <Grid container spacing={2}>
                            {/* Nueva contraseña */}
                            <Grid size={{ xs: 12 }}>
                                <Form.Item
                                    name="newPassword"
                                    rules={[
                                        { required: true, message: 'La nueva contraseña es requerida' },
                                        { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
                                    ]}
                                >
                                    <InputAntd
                                        label="Nueva contraseña"
                                        type="password"
                                    />
                                </Form.Item>
                            </Grid>

                            {/* Confirmar nueva contraseña */}
                            <Grid size={{ xs: 12 }}>
                                <Form.Item
                                    name="confirmPassword"
                                    rules={[
                                        { required: true, message: 'Confirme la nueva contraseña' }
                                    ]}
                                >
                                    <InputAntd
                                        label="Confirmar nueva contraseña"
                                        type="password"
                                    />
                                </Form.Item>
                            </Grid>

                            {/* Advertencia de seguridad */}
                            <Grid size={{ xs: 12 }}>
                                <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1, mt: 1 }}>
                                    <Typography variant="body2" color="warning.contrastText">
                                        ⚠️ <strong>Importante:</strong> Como administrador, puedes cambiar la contraseña sin conocer la actual.
                                        Asegúrate de comunicar la nueva contraseña al usuario de forma segura.
                                    </Typography>
                                </Box>
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
                    Cambiar Contraseña
                </SubmitButton>
            </DialogActions>
        </Dialog>
    );
};

export default ChangePasswordModal;
