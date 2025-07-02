// src/components/treasurys/TreasurysTable.tsx
import { useMemo } from 'react';
import { Button } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { ModalStateEnum } from '@/types/global.enum';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { SaleProps } from '@/services/sales/sales';
import { formatCurrency, formattedDate } from '@/utils/functions';

interface TreasurysTableProps {
  data: SaleProps[];
  loading: boolean;
  onRecordAction?: (action: ModalStateEnum, data: SaleProps) => void;
}

const defaultText = 'N/A';

export default function TreasurysTable({
  data,
  loading,
  onRecordAction,
}: TreasurysTableProps) {
  // const navigate = useNavigate();
  // const { setSelectedSale } = useGlobalInformation();

  const formattedData = useMemo(() => {
    // ✅ VALIDAR que data sea un array y no esté vacío
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }
    
    return data.map((item) => ({
      id: item.id,
      codigo_venta: item.codigoVenta || defaultText,
      razon_social_cliente: item?.cliente?.razonSocial ?? defaultText,
      ruc_cliente: item?.cliente?.ruc ?? defaultText,
      ruc_empresa: item?.empresa?.ruc ?? defaultText,
      razon_social_empresa: item?.empresa?.razonSocial ?? defaultText,
      contacto: item?.contactoCliente?.nombre ?? defaultText,
      estado_tesoreria: item.estadoVenta || 'pendiente',
      monto_venta: formatCurrency(item.montoVenta ? parseInt(item.montoVenta, 10) : 0),
      fecha_emision: formattedDate(item.fechaEmision, undefined, defaultText),
      rawdata: item,
    }));
  }, [data]);
  const columns: Array<AntColumnType<any>> = [
    {
      title: 'Código OC',
      dataIndex: 'codigo_venta',
      width: 200,
      render: (value, record) => (
        <Button
          variant="contained"
          onClick={() => {
            onRecordAction?.(ModalStateEnum.DETAILS, record.rawdata);
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
    { title: 'Razón Social Cliente', dataIndex: 'razon_social_cliente', width: 200, sort: true, filter: true },
    { title: 'RUC Cliente', dataIndex: 'ruc_cliente', width: 150, sort: true, filter: true },
    { title: 'RUC Empresa', dataIndex: 'ruc_empresa', width: 150, sort: true, filter: true },
    { title: 'Razón Social Empresa', dataIndex: 'razon_social_empresa', width: 200, sort: true, filter: true },
    { title: 'Contacto', dataIndex: 'contacto', width: 200, sort: true, filter: true },
    { title: 'Monto Venta', dataIndex: 'monto_venta', width: 130, sort: true, filter: true },
    { title: 'Fecha Emisión', dataIndex: 'fecha_emision', width: 150, sort: true, filter: true }
  ];

  return (
    <AntTable 
      data={formattedData} 
      columns={columns} 
      loading={loading}
      scroll={{ x: 1600 }}
      size="small"
    />
  );
}
