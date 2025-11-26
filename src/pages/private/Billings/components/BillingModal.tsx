import React, { useState, useEffect } from 'react';
import { Form, Input, notification, Modal, Row, Col, Typography as AntTypography, Space, Select } from 'antd';
import { SaveOutlined, ReloadOutlined, FileTextOutlined, CalendarOutlined, PaperClipOutlined, InfoCircleOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import DatePickerAntd from '@/components/DatePickerAnt';
import InputAntd from '@/components/InputAntd';
import SimpleFileUpload from '@/components/SimpleFileUpload';
import { createBilling, patchBilling } from '@/services/billings/billings.request';
import { BillingProps, BillingData, BillingUpdateData } from '@/services/billings/billings.d';
import { heroUIColors } from '@/components/ui';

const { Title, Text } = AntTypography;

export type BillingModalMode = 'create' | 'edit' | 'refactor' | 'view';

interface BillingModalProps {
    open: boolean;
    mode: BillingModalMode;
    billing?: BillingProps | null;
    ordenCompraId: number;
    onClose: () => void;
    onSuccess: () => void;
}

const BillingModal: React.FC<BillingModalProps> = ({
    open,
    mode,
    billing,
    ordenCompraId,
    onClose,
    onSuccess
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const isRefactorMode = mode === 'refactor';
    const isEditMode = mode === 'edit';
    const isCreateMode = mode === 'create';
    const isViewMode = mode === 'view';

    // Configuración según el modo
    const modalConfig = {
        create: {
            title: 'Nueva Facturación',
            icon: <PlusOutlined style={{ color: 'white', fontSize: 18 }} />,
            submitText: 'Crear Facturación',
            loadingText: 'Creando...',
            successMessage: 'Facturación creada',
            successDescription: 'La facturación se ha creado correctamente'
        },
        edit: {
            title: `Editar Factura ${billing?.factura || ''}`,
            icon: <FileTextOutlined style={{ color: 'white', fontSize: 18 }} />,
            submitText: 'Guardar Cambios',
            loadingText: 'Guardando...',
            successMessage: 'Facturación actualizada',
            successDescription: 'Los cambios se han guardado correctamente'
        },
        refactor: {
            title: `Refacturar Factura ${billing?.factura || ''}`,
            icon: <ReloadOutlined style={{ color: 'white', fontSize: 18 }} />,
            submitText: 'Crear Refacturación',
            loadingText: 'Creando Refacturación...',
            successMessage: 'Refacturación exitosa',
            successDescription: 'La nueva factura ha sido creada correctamente'
        },
        view: {
            title: `Detalle Factura ${billing?.factura || ''}`,
            icon: <EyeOutlined style={{ color: 'white', fontSize: 18 }} />,
            submitText: '',
            loadingText: '',
            successMessage: '',
            successDescription: ''
        }
    };

    const config = modalConfig[mode];

    // Cargar datos en modo edición o visualización
    useEffect(() => {
        if (open && (isEditMode || isViewMode) && billing) {
            form.setFieldsValue({
                numeroFactura: billing.factura,
                fechaFactura: billing.fechaFactura ? dayjs(billing.fechaFactura) : dayjs(),
                grr: billing.grr,
                retencion: billing.retencion || 0,
                detraccion: billing.detraccion || 0,
                formaEnvioFactura: billing.formaEnvioFactura,
                facturaArchivo: billing.facturaArchivo || null,
                grrArchivo: billing.grrArchivo || null,
                // Campos adicionales para refacturaciones
                notaCreditoTexto: billing.notaCreditoTexto || null,
                notaCreditoArchivo: billing.notaCreditoArchivo || null,
                motivoRefacturacion: billing.motivoRefacturacion || null
            });
        } else if (open && isCreateMode) {
            form.setFieldsValue({
                fechaFactura: dayjs(),
                retencion: 0,
                detraccion: 0
            });
        }
    }, [open, mode, billing, form, isEditMode, isCreateMode, isViewMode]);

    const handleClose = () => {
        form.resetFields();
        onClose();
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            if (isRefactorMode) {
                // Validar que exista billing original para refacturar
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
                    fechaFactura: values.fechaFactura ? values.fechaFactura.format('YYYY-MM-DD') : null,
                    grr: values.grr,
                    retencion: values.retencion || 0,
                    detraccion: values.detraccion || 0,
                    formaEnvioFactura: values.formaEnvioFactura,
                    facturaArchivo: values.facturaArchivo,
                    grrArchivo: values.grrArchivo,
                    notaCreditoTexto: values.notaCreditoTexto,
                    notaCreditoArchivo: values.notaCreditoArchivo || null,
                    motivoRefacturacion: values.motivoRefacturacion,
                    esRefacturacion: true,
                    idFacturaOriginal: billing.idFacturaOriginal || billing.id
                };

                await createBilling(refacturacionData);
            } else if (isEditMode && billing) {
                // Actualizar facturación existente
                const updateData: BillingUpdateData = {
                    factura: values.numeroFactura,
                    fechaFactura: values.fechaFactura ? values.fechaFactura.toISOString() : null,
                    grr: values.grr,
                    retencion: values.retencion || 0,
                    detraccion: values.detraccion || 0,
                    formaEnvioFactura: values.formaEnvioFactura,
                    facturaArchivo: values.facturaArchivo,
                    grrArchivo: values.grrArchivo
                };

                await patchBilling(billing.id, updateData);
            } else {
                // Crear nueva facturación
                const billingData: BillingData = {
                    ordenCompraId,
                    factura: values.numeroFactura,
                    fechaFactura: values.fechaFactura ? values.fechaFactura.toISOString() : null,
                    grr: values.grr,
                    retencion: values.retencion || 0,
                    detraccion: values.detraccion || 0,
                    formaEnvioFactura: values.formaEnvioFactura,
                    facturaArchivo: values.facturaArchivo,
                    grrArchivo: values.grrArchivo
                };

                await createBilling(billingData);
            }

            notification.success({
                message: config.successMessage,
                description: config.successDescription
            });

            form.resetFields();
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error en operación de facturación:', error);
            notification.error({
                message: 'Error',
                description: error instanceof Error ? error.message : 'No se pudo completar la operación'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            width={800}
            centered={false}
            style={{ top: 40 }}
            title={
                <Space align="center">
                    <div style={{
                        backgroundColor: heroUIColors.primary[500],
                        borderRadius: '50%',
                        padding: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {config.icon}
                    </div>
                    <Title level={4} style={{ margin: 0 }}>
                        {config.title}
                    </Title>
                </Space>
            }
            footer={isViewMode ? [
                <button
                    key="close"
                    onClick={handleClose}
                    style={{
                        padding: '8px 24px',
                        borderRadius: 6,
                        border: '1px solid #d1d5db',
                        backgroundColor: 'white',
                        color: '#6b7280',
                        cursor: 'pointer',
                        fontWeight: 600
                    }}
                >
                    Cerrar
                </button>
            ] : [
                <button
                    key="cancel"
                    onClick={handleClose}
                    style={{
                        padding: '8px 16px',
                        borderRadius: 6,
                        border: '1px solid #d1d5db',
                        backgroundColor: 'white',
                        color: '#6b7280',
                        cursor: 'pointer',
                        marginRight: 8
                    }}
                >
                    Cancelar
                </button>,
                <button
                    key="submit"
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                        padding: '8px 24px',
                        borderRadius: 6,
                        border: 'none',
                        backgroundColor: loading ? '#d1d5db' : heroUIColors.primary[500],
                        color: 'white',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8
                    }}
                >
                    <SaveOutlined />
                    {loading ? config.loadingText : config.submitText}
                </button>
            ]}
            styles={{
                header: {
                    borderBottom: `1px solid ${heroUIColors.primary[500]}`,
                    padding: '16px 24px',
                    background: `linear-gradient(135deg, ${heroUIColors.primary[50]} 0%, ${heroUIColors.primary[100]} 100%)`
                },
                body: {
                    padding: 24
                },
                footer: {
                    borderTop: '1px solid #e5e7eb',
                    padding: '16px 24px',
                    backgroundColor: '#f9fafb'
                }
            }}
        >
            <Form form={form} layout="vertical">
                {/* Primera fila: Número de Factura y GRR texto */}
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="numeroFactura"
                            rules={isViewMode ? [] : [{ required: true, message: 'Número de factura requerido' }]}
                            label={
                                <Space>
                                    <FileTextOutlined style={{ color: '#6b7280' }} />
                                    <Text strong>{isRefactorMode ? 'Número de Nueva Factura *' : 'Número de Factura *'}</Text>
                                </Space>
                            }
                        >
                            <InputAntd
                                placeholder="Ej: F001-00001234"
                                size="small"
                                disabled={isViewMode}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="grr"
                            label={
                                <Space>
                                    <FileTextOutlined style={{ color: '#6b7280' }} />
                                    <Text strong>GRR</Text>
                                </Space>
                            }
                        >
                            <InputAntd
                                placeholder="Ingrese GRR"
                                size="small"
                                disabled={isViewMode}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Segunda fila: Retención y Detracción */}
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="retencion"
                            initialValue={0}
                            label={
                                <Space>
                                    <FileTextOutlined style={{ color: '#6b7280' }} />
                                    <Text strong>Retención</Text>
                                </Space>
                            }
                        >
                            <Select
                                placeholder="Seleccione retención"
                                size="small"
                                disabled={isViewMode}
                                options={[
                                    { value: 0, label: '0%' },
                                    { value: 3, label: '3%' },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="detraccion"
                            initialValue={0}
                            label={
                                <Space>
                                    <FileTextOutlined style={{ color: '#6b7280' }} />
                                    <Text strong>Detracción</Text>
                                </Space>
                            }
                        >
                            <Select
                                placeholder="Seleccione detracción"
                                size="small"
                                disabled={isViewMode}
                                options={[
                                    { value: 0, label: '0%' },
                                    { value: 4, label: '4%' },
                                    { value: 9, label: '9%' },
                                    { value: 10, label: '10%' },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Tercera fila: Fecha y Envío de Factura */}
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="fechaFactura"
                            rules={isViewMode ? [] : [{ required: true, message: 'Fecha de factura requerida' }]}
                            label={
                                <Space>
                                    <CalendarOutlined style={{ color: '#6b7280' }} />
                                    <Text strong>{isRefactorMode ? 'Fecha de Nueva Factura *' : 'Fecha de Factura *'}</Text>
                                </Space>
                            }
                        >
                            <DatePickerAntd
                                size='small'
                                style={{ width: '100%' }}
                                disabled={isViewMode}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="formaEnvioFactura"
                            label={
                                <Space>
                                    <FileTextOutlined style={{ color: '#6b7280' }} />
                                    <Text strong>Envío de Factura</Text>
                                </Space>
                            }
                        >
                            <InputAntd
                                placeholder="Ej: Correo electrónico, Físico"
                                size="small"
                                disabled={isViewMode}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Cuarta fila: Archivo Factura y Archivo GRR */}
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="facturaArchivo"
                            label={
                                <Space>
                                    <PaperClipOutlined style={{ color: '#6b7280' }} />
                                    <Text strong>Archivo Factura</Text>
                                </Space>
                            }
                        >
                            <SimpleFileUpload editable={!isViewMode} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="grrArchivo"
                            label={
                                <Space>
                                    <PaperClipOutlined style={{ color: '#6b7280' }} />
                                    <Text strong>Archivo GRR</Text>
                                </Space>
                            }
                        >
                            <SimpleFileUpload editable={!isViewMode} />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Campos adicionales para refacturación (en modo refactor o view de refacturación) */}
                {(isRefactorMode || (isViewMode && billing?.esRefacturacion)) && (
                    <>
                        {/* Quinta fila: Nota de Crédito y Archivo Nota de Crédito */}
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="notaCreditoTexto"
                                    rules={isViewMode ? [] : [{ required: true, message: 'Nota de crédito requerida' }]}
                                    label={
                                        <Space>
                                            <ReloadOutlined style={{ color: '#6b7280' }} />
                                            <Text strong>Nota de Crédito {!isViewMode && '*'}</Text>
                                        </Space>
                                    }
                                >
                                    <InputAntd
                                        placeholder="Ej: NC001-00001234"
                                        size="small"
                                        disabled={isViewMode}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="notaCreditoArchivo"
                                    label={
                                        <Space>
                                            <PaperClipOutlined style={{ color: '#6b7280' }} />
                                            <Text strong>Archivo de Nota de Crédito</Text>
                                        </Space>
                                    }
                                >
                                    <SimpleFileUpload editable={!isViewMode} />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Sexta fila: Motivo de Refacturación */}
                        <Row gutter={16}>
                            <Col xs={24}>
                                <Form.Item
                                    name="motivoRefacturacion"
                                    rules={isViewMode ? [] : [{ required: true, message: 'Motivo de refacturación requerido' }]}
                                    label={
                                        <Space>
                                            <InfoCircleOutlined style={{ color: '#6b7280' }} />
                                            <Text strong>Motivo de Refacturación {!isViewMode && '*'}</Text>
                                        </Space>
                                    }
                                >
                                    <Input.TextArea
                                        rows={4}
                                        placeholder="Explique el motivo de la refacturación"
                                        disabled={isViewMode}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </>
                )}
            </Form>
        </Modal>
    );
};

export default BillingModal;
