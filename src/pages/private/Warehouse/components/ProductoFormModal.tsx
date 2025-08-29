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
import { Form, Input, InputNumber, Switch, notification } from 'antd';
import { Save, Cancel } from '@mui/icons-material';
import { Producto, CreateProductoData, UpdateProductoData } from '@/types/almacen.types';
import { createProducto, updateProducto } from '@/services/almacen/almacen.requests';

interface ProductoFormModalProps {
    open: boolean;
    onClose: () => void;
    editingProducto: Producto | null;
}

const ProductoFormModal: React.FC<ProductoFormModalProps> = ({
    open,
    onClose,
    editingProducto,
}) => {
    const [form] = Form.useForm();
    const isEditing = !!editingProducto;

    useEffect(() => {
        if (open) {
            if (editingProducto) {
                form.setFieldsValue({
                    nombre: editingProducto.nombre,
                    descripcion: editingProducto.descripcion,
                    unidadMedida: editingProducto.unidadMedida,
                    precioBase: editingProducto.precioBase ? Number(editingProducto.precioBase) : undefined,
                    estado: editingProducto.estado ?? true,
                });
            } else {
                form.resetFields();
                // Establecer valores por defecto para nuevo producto
                form.setFieldsValue({
                    estado: true,
                });
            }
        }
    }, [open, editingProducto, form]);

    const handleSubmit = async (values: any) => {
        try {
            const data: CreateProductoData | UpdateProductoData = {
                nombre: values.nombre,
                descripcion: values.descripcion || undefined,
                unidadMedida: values.unidadMedida || undefined,
                precioBase: values.precioBase || undefined,
                estado: values.estado ?? true,
            };

            if (isEditing && editingProducto) {
                await updateProducto(editingProducto.id, data as UpdateProductoData);
                notification.success({
                    message: 'Éxito',
                    description: 'Producto actualizado correctamente',
                });
            } else {
                await createProducto(data as CreateProductoData);
                notification.success({
                    message: 'Éxito',
                    description: 'Producto creado correctamente',
                });
            }

            onClose();
        } catch (error) {
            console.error('Error al guardar producto:', error);
            notification.error({
                message: 'Error',
                description: `No se pudo ${isEditing ? 'actualizar' : 'crear'} el producto`,
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
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                <Typography variant="h6" component="div">
                    {isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}
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
                            label="Código del producto"
                            rules={[
                                { required: true, message: 'El nombre es obligatorio' },
                                { min: 2, message: 'El nombre debe tener al menos 2 caracteres' },
                                { max: 255, message: 'El nombre no puede exceder 255 caracteres' },
                            ]}
                        >
                            <Input
                                placeholder="Ej: Detergente Industrial"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="descripcion"
                            label="Descripción"
                            rules={[
                                { max: 500, message: 'La descripción no puede exceder 500 caracteres' },
                            ]}
                        >
                            <Input.TextArea
                                placeholder="Descripción detallada del producto"
                                rows={4}
                                showCount
                                maxLength={500}
                            />
                        </Form.Item>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <Form.Item
                                    name="unidadMedida"
                                    label="Unidad de Medida"
                                    rules={[
                                        { max: 50, message: 'La unidad de medida no puede exceder 50 caracteres' },
                                    ]}
                                >
                                    <Input
                                        placeholder="Ej: kg, litros, unidades"
                                        size="large"
                                    />
                                </Form.Item>
                            </Box>

                            <Box sx={{ flex: 1 }}>
                                <Form.Item
                                    name="precioBase"
                                    label="Precio Base (S/)"
                                    rules={[
                                        { type: 'number', min: 0, message: 'El precio debe ser mayor o igual a 0' },
                                    ]}
                                >
                                    <InputNumber
                                        placeholder="0.00"
                                        size="large"
                                        style={{ width: '100%' }}
                                        precision={2}
                                        formatter={(value) => `S/ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value!.replace(/S\/\s?|(,*)/g, '')}
                                    />
                                </Form.Item>
                            </Box>
                        </Box>

                        <Form.Item
                            name="estado"
                            label="Estado"
                            valuePropName="checked"
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Switch />
                                <Typography variant="body2" color="textSecondary">
                                    Producto activo (disponible para uso)
                                </Typography>
                            </Box>
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
                    {isEditing ? 'Actualizar' : 'Crear'} Producto
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductoFormModal;
