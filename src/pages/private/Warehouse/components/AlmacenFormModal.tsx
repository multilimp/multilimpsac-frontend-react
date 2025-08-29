import React, { useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
} from '@mui/material';
import { Form, Input, notification } from 'antd';
import { Save, Cancel } from '@mui/icons-material';
import { Almacen, CreateAlmacenData, UpdateAlmacenData } from '@/types/almacen.types';
import { createAlmacen, updateAlmacen } from '@/services/almacen/almacen.requests';

interface AlmacenFormModalProps {
    open: boolean;
    onClose: () => void;
    editingAlmacen: Almacen | null;
}

const AlmacenFormModal: React.FC<AlmacenFormModalProps> = ({
    open,
    onClose,
    editingAlmacen,
}) => {
    const [form] = Form.useForm();
    const isEditing = !!editingAlmacen;

    useEffect(() => {
        if (open) {
            if (editingAlmacen) {
                form.setFieldsValue({
                    nombre: editingAlmacen.nombre,
                    direccion: editingAlmacen.direccion,
                    ciudad: editingAlmacen.ciudad,
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, editingAlmacen, form]);

    const handleSubmit = async (values: any) => {
        try {
            const data: CreateAlmacenData | UpdateAlmacenData = {
                nombre: values.nombre,
                direccion: values.direccion || undefined,
                ciudad: values.ciudad || undefined,
            };

            if (isEditing && editingAlmacen) {
                await updateAlmacen(editingAlmacen.id, data as UpdateAlmacenData);
                notification.success({
                    message: 'Éxito',
                    description: 'Almacén actualizado correctamente',
                });
            } else {
                await createAlmacen(data as CreateAlmacenData);
                notification.success({
                    message: 'Éxito',
                    description: 'Almacén creado correctamente',
                });
            }

            onClose();
        } catch (error) {
            console.error('Error al guardar almacén:', error);
            notification.error({
                message: 'Error',
                description: `No se pudo ${isEditing ? 'actualizar' : 'crear'} el almacén`,
            });
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { minHeight: 400 }
            }}
        >
            <DialogTitle>
                <Typography variant="h6" component="div">
                    {isEditing ? 'Editar Almacén' : 'Crear Nuevo Almacén'}
                </Typography>
            </DialogTitle>

            <DialogContent dividers>
                <Box sx={{ py: 2 }}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        requiredMark={false}
                    >
                        <Form.Item
                            name="nombre"
                            label="Nombre del Almacén"
                            rules={[
                                { required: true, message: 'El nombre es obligatorio' },
                                { min: 2, message: 'El nombre debe tener al menos 2 caracteres' },
                                { max: 100, message: 'El nombre no puede exceder 100 caracteres' },
                            ]}
                        >
                            <Input
                                placeholder="Ej: Almacén Central"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="direccion"
                            label="Dirección"
                            rules={[
                                { max: 255, message: 'La dirección no puede exceder 255 caracteres' },
                            ]}
                        >
                            <Input.TextArea
                                placeholder="Dirección completa del almacén"
                                rows={3}
                                showCount
                                maxLength={255}
                            />
                        </Form.Item>

                        <Form.Item
                            name="ciudad"
                            label="Ciudad"
                            rules={[
                                { max: 100, message: 'La ciudad no puede exceder 100 caracteres' },
                            ]}
                        >
                            <Input
                                placeholder="Ciudad donde se ubica el almacén"
                                size="large"
                            />
                        </Form.Item>
                    </Form>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, gap: 2 }}>
                <Button
                    onClick={handleCancel}
                    variant="outlined"
                    startIcon={<Cancel />}
                    size="large"
                >
                    Cancelar
                </Button>
                <Button
                    onClick={() => form.submit()}
                    variant="contained"
                    startIcon={<Save />}
                    size="large"
                >
                    {isEditing ? 'Actualizar' : 'Crear'} Almacén
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AlmacenFormModal;
