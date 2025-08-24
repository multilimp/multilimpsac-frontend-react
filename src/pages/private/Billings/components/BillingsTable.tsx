// src/pages/components/BillingsTable.tsx
import { useMemo } from 'react';
import { Button, IconButton } from '@mui/material';
import { Visibility, PictureAsPdf } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formattedDate } from '@/utils/functions';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { SaleProps } from '@/services/sales/sales';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';

interface BillingsTableProps {
  data: SaleProps[];
  loading: boolean;
  onReload?: () => void;
}

const statusMap = {
  'pendiente': 'Pendiente',
  'pagado': 'Pagado',
  'cancelado': 'Cancelado',
  'procesando': 'Procesando',
};

const defaultText = 'N/A';

const BillingsTable: React.FC<BillingsTableProps> = ({ data, loading, onReload }) => {
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
      fecha_formalizacion: formattedDate(item.fechaForm, undefined, defaultText),
      fecha_max_entrega: formattedDate(item.fechaEntrega, undefined, defaultText),
      monto_venta: formatCurrency(item.montoVenta ? parseInt(item.montoVenta, 10) : 0),
      fecha_factura: formattedDate(item.fechaEmision, undefined, defaultText),
      numero_factura: item.codigoVenta || defaultText, // Usando código de venta como número de factura
      grr: item.siaf || defaultText,
      estado_facturacion: item.estadoVenta || 'pendiente',
      oce: item.documentoOce || null,
      ocf: item.documentoOcf || null,
      refact: item.ventaPrivada ? 'Sí' : 'No', // Usando ventaPrivada como indicador de refacturación
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
            console.log('Abriendo facturación para:', record.rawdata.id);
            setSelectedSale(record.rawdata);
            navigate('/billing/' + record.rawdata.id);
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
    { title: 'Fecha Registro', dataIndex: 'fecha_formalizacion', width: 150, sort: true, filter: true },
    { title: 'Fecha Máx. Entrega', dataIndex: 'fecha_max_entrega', width: 150, sort: true, filter: true },
    { title: 'Monto Venta', dataIndex: 'monto_venta', width: 130, sort: true, filter: true },
    { title: 'N° Factura', dataIndex: 'numero_factura', width: 120, sort: true, filter: true },
    { title: 'Fecha Factura', dataIndex: 'fecha_factura', width: 150, sort: true, filter: true },
    { title: 'GRR', dataIndex: 'grr', width: 100, sort: true, filter: true },
    { title: 'Refact', dataIndex: 'refact', width: 80, sort: true, filter: true },
    {
      title: 'Estado Facturación',
      dataIndex: 'estado_facturacion',
      width: 150,
      sort: true,
      filter: true,
      render: (value) => {
        const colorMap: Record<string, string> = {
          'pending': '#f5a524', // amarillo
          'paid': '#17c964', // verde
          'processing': '#006fee', // azul
          'canceled': '#f31260', // rojo
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
            {statusMap[value as keyof typeof statusMap] || value}
          </span>
        );
      }
    },
    {
      title: 'OCE',
      dataIndex: 'oce',
      width: 80,
      render: (value) =>
        value && (
          <IconButton color="error" component="a" href={value} target="_blank" size="small">
            <PictureAsPdf />
          </IconButton>
        ),
    },
    {
      title: 'OCF',
      dataIndex: 'ocf',
      width: 80,
      render: (value) =>
        value && (
          <IconButton color="error" component="a" href={value} target="_blank" size="small">
            <PictureAsPdf />
          </IconButton>
        ),
    },
  ];

  return (
    <AntTable
      data={formattedData}
      columns={columns}
      loading={loading}
      scroll={{ x: 2200 }}
      size="small"
      onReload={onReload}
    />
  );
};

export default BillingsTable;
