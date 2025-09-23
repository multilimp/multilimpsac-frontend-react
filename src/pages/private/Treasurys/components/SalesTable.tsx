// src/components/treasurys/SalesTable.tsx
import { useMemo } from 'react';
import { Button } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { SaleProps } from '@/services/sales/sales';
import { formatCurrency, formattedDate } from '@/utils/functions';

interface SalesTreasuryTableProps {
    data: SaleProps[];
    loading: boolean;
    onRowClick: (sale: SaleProps) => void;
    onReload?: () => void | Promise<void>;
}

const defaultText = 'N/A';

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
                    onClick={() => {
                        onRowClick?.(record.rawdata);
                    }}
                    startIcon={<Visibility />}
                    size="small"
                    color="primary"
                    style={{ width: '100%' }}
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
            width: 120,
            sort: true,
            filter: true,
            render: (value) => (
                <span style={{
                    color: value === 'COMPLETADO' ? 'green' : value === 'PENDIENTE' ? 'orange' : 'red',
                    fontWeight: 'bold'
                }}>
                    {value || 'PENDIENTE'}
                </span>
            )
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