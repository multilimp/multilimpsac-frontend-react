// src/pages/components/BillingsTable.tsx
import { useMemo } from 'react';
import { Button, IconButton } from '@mui/material';
import { Visibility, PictureAsPdf } from '@mui/icons-material';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { ModalStateEnum } from '@/types/global.enum';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { BillingProps } from '@/services/billings/billings.d';

interface BillingsTableProps {
  data: BillingProps[];
  loading: boolean;
  onRecordAction?: (action: ModalStateEnum, data: BillingProps) => void;
}

const statusMap: Record<BillingProps['status'], string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  canceled: 'Cancelado',
  processing: 'Procesando',
};

const BillingsTable: React.FC<BillingsTableProps> = ({ data, loading, onRecordAction }) => {

  const formattedData = useMemo(() => {
    return data.map((item) => ({
      id: item.id,
      codigo_venta: item.saleId?.toString() || 'N/A',
      razon_social_cliente: item.clientBusinessName || '',
      ruc_cliente: item.clientRuc || '',
      ruc_empresa: item.companyRuc || '',
      razon_social_empresa: item.companyBusinessName || '',
      contacto: item.contact || '',
      catalogo: 'N/A', // Campo no disponible en BillingProps
      fecha_formalizacion: formattedDate(item.registerDate),
      fecha_max_entrega: formattedDate(item.maxDeliveryDate),
      monto_venta: formatCurrency(item.saleAmount),
      cue: 'N/A', // Campo no disponible en BillingProps
      direccion_entrega: 'N/A', // Campo no disponible en BillingProps
      fecha_factura: formattedDate(item.invoiceDate),
      numero_factura: item.invoiceNumber || 'N/A',
      grr: item.grr || 'N/A',
      estado_facturacion: item.status || 'pending',
      oce: item.oce,
      ocf: item.ocf,
      refact: item.isRefact ? 'Sí' : 'No',

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
            console.log('Abriendo detalles de facturación:', record.rawdata.id);
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
    />
  );
};

export default BillingsTable;
