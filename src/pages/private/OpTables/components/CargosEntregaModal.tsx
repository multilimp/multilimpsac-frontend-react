import React, { useState, useEffect } from 'react';
import { Modal, Form, DatePicker, Button, notification, Space, Typography } from 'antd';
import { Print } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { previewCargosEntregaReport } from '@/services/reportes/reportes.request';

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface CargosEntregaModalProps {
    visible: boolean;
    onClose: () => void;
}

const CargosEntregaModal: React.FC<CargosEntregaModalProps> = ({
    visible,
    onClose,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);

    // Establecer fecha por defecto cuando se abre el modal
    useEffect(() => {
        if (visible) {
            const today = dayjs();
            form.setFieldsValue({
                dateRange: [today, today]
            });
        }
    }, [visible, form]);

    const handlePreviewReport = async (values: any) => {
        try {
            setLoading(true);

            const { dateRange } = values;
            if (!dateRange || dateRange.length !== 2) {
                notification.error({
                    message: 'Error',
                    description: 'Por favor selecciona un rango de fechas válido',
                });
                return;
            }

            const [startDate, endDate] = dateRange;

            await previewCargosEntregaReport({
                fechaInicio: startDate.format('YYYY-MM-DD'),
                fechaFin: endDate.format('YYYY-MM-DD')
            });

            notification.success({
                message: 'Éxito',
                description: 'El reporte se ha abierto para impresión',
            });

        } catch (error) {
            console.error('Error imprimiendo reporte:', error);
            notification.error({
                message: 'Error',
                description: 'No se pudo abrir la ventana de impresión. Inténtalo de nuevo.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    const disabledDate = (current: Dayjs) => {
        // Deshabilitar fechas futuras
        return current && current > dayjs().endOf('day');
    };

    return (
        <Modal
            title={
                <Space>
                    <Print />
                    <span>Imprimir Reporte de Cargos de Entrega</span>
                </Space>
            }
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={500}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                style={{ marginTop: 20 }}
            >
                <Form.Item
                    name="dateRange"
                    label="Rango de Fechas"
                    rules={[
                        {
                            required: true,
                            message: 'Por favor selecciona un rango de fechas',
                        },
                    ]}
                >
                    <RangePicker
                        style={{ width: '100%' }}
                        format="DD/MM/YYYY"
                        placeholder={['Fecha inicio', 'Fecha fin']}
                        disabledDate={disabledDate}
                        allowClear
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                    <Space>
                        <Button onClick={handleCancel}>
                            Cancelar
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => {
                                const values = form.getFieldsValue();
                                handlePreviewReport(values);
                            }}
                            loading={loading}
                            icon={<Print />}
                        >
                            {loading ? 'Cargando...' : 'Imprimir Reporte'}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CargosEntregaModal;
