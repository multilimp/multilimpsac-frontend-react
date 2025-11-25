import { useState } from 'react';
import { DatePicker, Card, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import CargosEntregaTable from '@/components/CargosEntregaTable';

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface ReporteProgramacionProps {
    /** Fecha de inicio por defecto (default: inicio del mes actual) */
    defaultFechaInicio?: dayjs.Dayjs;
    /** Fecha de fin por defecto (default: hoy) */
    defaultFechaFin?: dayjs.Dayjs;
}

const ReporteProgramacion = ({
    defaultFechaInicio = dayjs().startOf('month'),
    defaultFechaFin = dayjs(),
}: ReporteProgramacionProps) => {
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([
        defaultFechaInicio,
        defaultFechaFin,
    ]);

    return (
        <>
            <Card size="small" style={{ marginBottom: 16 }}>
                <Space align="center">
                    <Text strong>Período:</Text>
                    <RangePicker
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        value={dateRange as any}
                        onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
                        format="DD/MM/YYYY"
                        placeholder={['Fecha inicio', 'Fecha fin']}
                        style={{ minWidth: 280 }}
                        allowClear={false}
                    />
                </Space>
            </Card>
            <CargosEntregaTable
                fechaInicio={dateRange[0]?.format('YYYY-MM-DD') || dayjs().startOf('month').format('YYYY-MM-DD')}
                fechaFin={dateRange[1]?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD')}
            />
        </>
    );
};

export default ReporteProgramacion;
