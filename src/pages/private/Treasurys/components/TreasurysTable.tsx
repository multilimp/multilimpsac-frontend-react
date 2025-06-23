// src/components/treasurys/TreasurysTable.tsx
import { useMemo } from 'react';
import { Button, ButtonGroup } from '@mui/material';
import { Visibility, PaymentOutlined } from '@mui/icons-material';
import { ModalStateEnum } from '@/types/global.enum';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { SaleProps } from '@/services/sales/sales';
import { useNavigate } from 'react-router-dom';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
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
  const navigate = useNavigate();
  const { setSelectedSale } = useGlobalInformation();

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

  const handleManagePayments = (record: SaleProps) => {
    // Usar la venta real
    setSelectedSale(record);
    navigate(`/treasury/${record.id}/update`);
  };

  const columns: Array<AntColumnType<any>> = [
    {
      title: 'Código OC',
      dataIndex: 'codigo_venta',
      width: 200,
      render: (value, record) => (
        <Button
          variant="contained"
          onClick={() => {
            console.log('Abriendo drawer de OPs para:', record.rawdata.id);
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
    { title: 'Fecha Emisión', dataIndex: 'fecha_emision', width: 150, sort: true, filter: true },
    { 
      title: 'Estado Tesorería', 
      dataIndex: 'estado_tesoreria', 
      width: 150, 
      sort: true, 
      filter: true,
      render: (value) => {
        const colorMap: Record<string, string> = {
          'pendiente': '#f5a524', // amarillo
          'pagado': '#17c964', // verde
          'procesando': '#006fee', // azul
          'cancelado': '#f31260', // rojo
        };
        return (
          <span style={{ 
            color: colorMap[value] || '#000', 
            fontWeight: 600,
            padding: '4px 8px',
            backgroundColor: `${colorMap[value] || '#000'}20`,
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            {value}
          </span>
        );
      }
    },
    {
      title: 'Acciones',
      dataIndex: 'id',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <ButtonGroup size="small">
          <Button 
            color="warning" 
            onClick={() => handleManagePayments(record.rawdata)}
            startIcon={<PaymentOutlined />}
            size="small"
          >
            Pagos
          </Button>
        </ButtonGroup>
      ),
    },
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
