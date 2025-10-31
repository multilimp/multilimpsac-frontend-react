// src/components/treasurys/SalesTable.tsx
import { useMemo } from 'react';
import { Button, Chip } from '@mui/material';
import { Visibility, CheckCircle, Schedule, Cancel, HourglassEmpty, Assignment } from '@mui/icons-material';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { SaleProps } from '@/services/sales/sales';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { Link } from 'react-router-dom';

interface SalesTreasuryTableProps {
    data: SaleProps[];
    loading: boolean;
    onRowClick: (sale: SaleProps) => void;
    onReload?: () => void | Promise<void>;
}

const defaultText = ' ';

// Helper function para obtener las propiedades del estado OC
const getEstadoOCProps = (estado: string) => {
    const estadoUpper = (estado || 'PENDIENTE').toUpperCase();
    
    switch (estadoUpper) {
        case 'COMPLETADO':
        case 'FINALIZADO':
        case 'ENTREGADO':
            return {
                color: 'success' as const,
                icon: <CheckCircle sx={{ fontSize: 16 }} />,
                label: 'COMPLETADO'
            };
        case 'PENDIENTE':
        case 'EN_PROCESO':
        case 'PROCESANDO':
            return {
                color: 'warning' as const,
                icon: <Schedule sx={{ fontSize: 16 }} />,
                label: 'PENDIENTE'
            };
        case 'CANCELADO':
        case 'ANULADO':
            return {
                color: 'error' as const,
                icon: <Cancel sx={{ fontSize: 16 }} />,
                label: 'CANCELADO'
            };
        case 'EN_ESPERA':
        case 'ESPERANDO':
            return {
                color: 'info' as const,
                icon: <HourglassEmpty sx={{ fontSize: 16 }} />,
                label: 'EN ESPERA'
            };
        case 'BORRADOR':
        case 'DRAFT':
            return {
                color: 'default' as const,
                icon: <Assignment sx={{ fontSize: 16 }} />,
                label: 'BORRADOR'
            };
        default:
            return {
                color: 'primary' as const,
                icon: <Assignment sx={{ fontSize: 16 }} />,
                label: estadoUpper
            };
    }
};

export default function SalesTreasuryTable({
    data,
    loading,
    onRowClick,
    onReload,
}: SalesTreasuryTableProps) {

    const formattedData = useMemo(() => {
        // ✅ VALIDAR que data sea un array y no esté vacío
        if (!Array.isArray(data) || data.length === 0) {
            return [];
        }

        return data.map((item) => ({
            id: item.id,
            codigoVenta: item.codigoVenta || defaultText,
            clienteRazonSocial: item.cliente?.razonSocial ?? defaultText,
            clienteRuc: item.cliente?.ruc ?? defaultText,
            contactoCliente: item.contactoCliente?.nombre ?? defaultText,
            fechaEmision: formattedDate(item.fechaEmision, undefined, defaultText),
            fechaEntrega: formattedDate(item.fechaEntrega, undefined, defaultText),
            estadoVenta: item.estadoVenta || 'PENDIENTE',
            montoVenta: parseFloat(item.montoVenta || '0'),
            rawdata: item,
        }));
    }, [data]);

    const columns: Array<AntColumnType<typeof formattedData[0]>> = [
        {
            title: 'Código OC',
            dataIndex: 'codigoVenta',
            width: 200,
            render: (value, record) => (
                <Button
                    variant="contained"
                    component={Link}
                    to={record.rawdata?.id ? `/sales/${record.rawdata.id}/edit?from=treasury` : '#'}
                    startIcon={<Visibility />}
                    size="small"
                    color="primary"
                    style={{ width: '100%' }}
                    disabled={!record.rawdata?.id}
                >
                    {value}
                </Button>
            )
        },
        { title: 'Cliente', dataIndex: 'clienteRazonSocial', width: 200, sort: true, filter: true },
        { title: 'RUC Cliente', dataIndex: 'clienteRuc', width: 150, sort: true, filter: true },
        { title: 'Contacto Cliente', dataIndex: 'contactoCliente', width: 200, sort: true, filter: true },
        { title: 'Fecha Emisión', dataIndex: 'fechaEmision', width: 150, sort: true, filter: true },
        { title: 'Fecha Entrega', dataIndex: 'fechaEntrega', width: 150, sort: true, filter: true },
        {
            title: 'Monto Venta',
            dataIndex: 'montoVenta',
            width: 120,
            sort: true,
            render: (value) => formatCurrency(value || 0)
        },
        {
            title: 'Estado OC',
            dataIndex: 'estadoVenta',
            width: 140,
            sort: true,
            filter: true,
            render: (value) => {
                const estadoProps = getEstadoOCProps(value);
                return (
                    <Chip
                        icon={estadoProps.icon}
                        label={estadoProps.label}
                        color={estadoProps.color}
                        variant="filled"
                        size="small"
                        sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            minWidth: '120px',
                            '& .MuiChip-icon': {
                                marginLeft: '8px'
                            }
                        }}
                    />
                );
            }
        }
    ];

    return (
        <AntTable
            data={formattedData}
            columns={columns}
            loading={loading}
            scroll={{ x: 1400 }}
            size="small"
            onReload={onReload}
        />
    );
}