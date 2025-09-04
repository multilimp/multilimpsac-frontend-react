// src/components/treasurys/TreasurysTable.tsx
import { useMemo } from 'react';
import { Button } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import { formatCurrency, formattedDate } from '@/utils/functions';

interface ProviderOrdersTreasuryTableProps {
  data: ProviderOrderProps[];
  loading: boolean;
  onRowClick: (order: ProviderOrderProps) => void;
  onReload?: () => void | Promise<void>;
}

const defaultText = 'N/A';

export default function ProviderOrdersTreasuryTable({
  data,
  loading,
  onRowClick,
  onReload,
}: ProviderOrdersTreasuryTableProps) {
  // const navigate = useNavigate();
  // const { setSelectedSale } = useGlobalInformation();

  const formattedData = useMemo(() => {
    // ✅ VALIDAR que data sea un array y no esté vacío
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      codigoOp: item.codigoOp || defaultText,
      proveedorRazonSocial: item.proveedor?.razonSocial ?? defaultText,
      proveedorRuc: item.proveedor?.ruc ?? defaultText,
      contactoProveedor: item.contactoProveedor?.nombre ?? defaultText,
      fechaProgramada: formattedDate(item.fechaProgramada, undefined, defaultText),
      fechaDespacho: formattedDate(item.fechaDespacho, undefined, defaultText),
      fechaRecepcion: formattedDate(item.fechaRecepcion, undefined, defaultText),
      estadoOp: item.estadoOp || 'PENDIENTE',
      ordenCompraId: item.ordenCompraId,
      rawdata: item,
    }));
  }, [data]);
  const columns: Array<AntColumnType<typeof formattedData[0]>> = [
    {
      title: 'Código OP',
      dataIndex: 'codigoOp',
      width: 200,
      render: (value, record) => (
        <Button
          variant="contained"
          onClick={() => {
            onRowClick?.(record.rawdata);
          }}
          startIcon={<Visibility />}
          size="small"
          color="info"
          style={{ width: '100%' }}
        >
          {value}
        </Button>
      )
    },
    { title: 'Proveedor', dataIndex: 'proveedorRazonSocial', width: 200, sort: true, filter: true },
    { title: 'RUC Proveedor', dataIndex: 'proveedorRuc', width: 150, sort: true, filter: true },
    { title: 'Contacto Proveedor', dataIndex: 'contactoProveedor', width: 200, sort: true, filter: true },
    { title: 'Fecha Programada', dataIndex: 'fechaProgramada', width: 150, sort: true, filter: true },
    { title: 'Fecha Despacho', dataIndex: 'fechaDespacho', width: 150, sort: true, filter: true },
    { title: 'Fecha Recepción', dataIndex: 'fechaRecepcion', width: 150, sort: true, filter: true },
    {
      title: 'Estado OP',
      dataIndex: 'estadoOp',
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
