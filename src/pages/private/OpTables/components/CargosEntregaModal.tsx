import React, { useState } from 'react';
import { Modal, Form, DatePicker, Button, notification, Space, Typography } from 'antd';
import { FileDownload } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { generateCargosEntregaReport } from '@/services/reportes/reportes.request';

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

    const handleGenerateReport = async (values: any) => {
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

            await generateCargosEntregaReport({
                fechaInicio: startDate.format('YYYY-MM-DD'),
                fechaFin: endDate.format('YYYY-MM-DD')
            });

            notification.success({
                message: 'Éxito',
                description: 'El reporte se ha generado y descargado correctamente',
            });

            form.resetFields();
            onClose();
        } catch (error) {
            console.error('Error generating report:', error);
            notification.error({
                message: 'Error',
                description: 'No se pudo generar el reporte. Inténtalo de nuevo.',
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
                    <FileDownload />
                    <span>Generar Reporte de Cargos de Entrega</span>
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
                onFinish={handleGenerateReport}
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
                            htmlType="submit"
                            loading={loading}
                            icon={<FileDownload />}
                        >
                            {loading ? 'Generando...' : 'Generar Reporte'}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>

            <div style={{ marginTop: 20, padding: 16, backgroundColor: '#f6f6f6', borderRadius: 6 }}>
                <Text type="secondary">
                    <strong>Información:</strong> Este reporte incluye todas las órdenes de proveedor
                    con su fecha de programación dentro del rango seleccionado. Los datos se agrupan
                    por fecha de programación y muestran detalles de productos, proveedores y destinos.
                </Text>
            </div>
        </Modal>
    );
};

export default CargosEntregaModal;
