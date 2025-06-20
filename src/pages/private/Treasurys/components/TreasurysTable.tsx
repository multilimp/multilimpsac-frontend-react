// src/components/treasurys/TreasurysTable.tsx
import { useMemo } from 'react';
import { Button, ButtonGroup } from '@mui/material';
import { Visibility, PaymentOutlined } from '@mui/icons-material';
import { ModalStateEnum } from '@/types/global.enum';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { TreasurysProps } from '@/services/treasurys/treasurys.d';
import { useNavigate } from 'react-router-dom';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';

interface TreasurysTableProps {
  data: TreasurysProps[];
  loading: boolean;
  onRecordAction?: (action: ModalStateEnum, data: TreasurysProps) => void;
}

export default function TreasurysTable({
  data,
  loading,
  onRecordAction,
}: TreasurysTableProps) {
  const navigate = useNavigate();
  const { setSelectedSale } = useGlobalInformation();

  const formattedData = useMemo(() => {
    return data.map((item) => ({
      id: item.id,
      codigo_venta: item.saleCode || 'N/A',
      razon_social_cliente: item.clientBusinessName || '',
      ruc_cliente: item.clientRuc || '',
      ruc_empresa: item.companyRuc || '',
      razon_social_empresa: item.companyBusinessName || '',
      contacto: item.contact || '',
      estado_tesoreria: item.status || 'pendiente',

      rawdata: item,
    }));
  }, [data]);

  const handleManagePayments = (record: TreasurysProps) => {
    // Crear un mock de SaleProps basado en TreasurysProps para demo
    const mockSale = {
      id: record.id,
      codigoVenta: record.saleCode,
      empresaRuc: record.companyRuc,
      empresaRazonSocial: record.companyBusinessName,
      clienteRuc: record.clientRuc,
      clienteRazonSocial: record.clientBusinessName,
      contacto: record.contact,
      fechaEmision: new Date().toISOString(),
      ventaPrivada: false,
      direccionEntrega: '',
      referenciaEntrega: '',
      fechaEntrega: new Date().toISOString(),
      montoVenta: '0',
      fechaForm: new Date().toISOString(),
      fechaMaxForm: new Date().toISOString(),
      productos: [],
      documentoOce: '',
      documentoOcf: '',
      siaf: '',
      etapaSiaf: '',
      fechaSiaf: new Date().toISOString(),
      etapaActual: 'treasury',
      estadoActivo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setSelectedSale(mockSale as any);
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
            console.log('Abriendo detalles de tesorería:', record.rawdata.id);
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
