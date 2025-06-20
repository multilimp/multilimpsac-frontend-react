// src/components/TrackingsTable.tsx
import React, { useMemo } from 'react';
import { IconButton, Button } from '@mui/material';
import { PictureAsPdf, Visibility } from '@mui/icons-material';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { ModalStateEnum } from '@/types/global.enum';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { SaleProps } from '@/services/sales/sales';

interface TrackingsTableProps {
  data: Array<SaleProps | any>; // SaleProps o cualquier otro tipo extendido
  loading: boolean;
  onRowClick?: (row: SaleProps) => void;
  onRecordAction?: (action: ModalStateEnum, data: SaleProps) => void;
}

// const statusLabels: Record<SaleProps['status'], string> = {
//   pending: 'Pendiente',
//   in_progress: 'En Progreso',
//   delivered: 'Entregado',
//   canceled: 'Cancelado',
// };
const defaultText = 'N/A';
const TrackingsTable: React.FC<TrackingsTableProps> = ({ data, loading, onRowClick, onRecordAction }) => {

  const formattedData = useMemo(() => {
    return data.map((item) => ({
      id: item.id,
      codigo_venta: item.codigoVenta || defaultText,
      razon_social_cliente: item?.cliente.razonSocial ?? defaultText,
      ruc_cliente: item?.cliente.ruc ?? defaultText,
      ruc_empresa: item?.empresa.ruc ?? defaultText,
      razon_social_empresa: item?.empresa.razonSocial ?? defaultText,
      fecha_max_entrega: formattedDate(item.fechaMaxForm, undefined, defaultText),
      monto_venta: formatCurrency(item.montoVenta ? parseInt(item.montoVenta, 10) : 0),
      cue: item?.cliente.codigoUnidadEjecutora || defaultText,
      departamento: item.departamentoEntrega || defaultText,
      // estado: statusLabels[item.status],
      peru_compras: item.documentoPeruCompras || defaultText,
      fecha_peru_compras: item.fechaPeruCompras ? formattedDate(item.fechaPeruCompras) : defaultText,
      fecha_entrega_oc: item.fechaEntregaOc ? formattedDate(item.fechaEntregaOc) : defaultText,
      // utilidad: item ? `${item.utility}%` : defaultText,
      // grr: item.grr || defaultText,
      // factura: item.invoiceNumber || defaultText,
      oce: item.documentoOce || defaultText,
      ocf: item.documentoOcf || defaultText,
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
            console.log('Abriendo detalles de seguimiento:', record.rawdata.id);
            if (onRecordAction) {
              onRecordAction(ModalStateEnum.DETAILS, record.rawdata);
            } else if (onRowClick) {
              onRowClick(record.rawdata);
            }
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
    { title: 'Fecha Máx. Entrega', dataIndex: 'fecha_max_entrega', width: 150, sort: true, filter: true },
    { title: 'Monto Venta', dataIndex: 'monto_venta', width: 130, sort: true, filter: true },
    { title: 'CUE', dataIndex: 'cue', width: 120, sort: true, filter: true },
    { title: 'Departamento', dataIndex: 'departamento', width: 130, sort: true, filter: true },
    {
      title: 'Estado',
      dataIndex: 'estado',
      width: 120,
      sort: true,
      filter: true,
      render: (value) => {
        const colorMap: Record<string, string> = {
          'Pendiente': '#f5a524', // amarillo
          'En Progreso': '#006fee', // azul
          'Entregado': '#17c964', // verde
          'Cancelado': '#f31260', // rojo
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
    { title: 'Perú Compras', dataIndex: 'peru_compras', width: 120, sort: true, filter: true },
    { title: 'Fecha Perú Compras', dataIndex: 'fecha_peru_compras', width: 150, sort: true, filter: true },
    { title: 'Fecha Entrega OC', dataIndex: 'fecha_entrega_oc', width: 150, sort: true, filter: true },
    { title: 'Utilidad (%)', dataIndex: 'utilidad', width: 100, sort: true, filter: true },
    { title: 'GRR', dataIndex: 'grr', width: 100, sort: true, filter: true },
    { title: 'Factura', dataIndex: 'factura', width: 120, sort: true, filter: true },
    { title: 'Refact', dataIndex: 'refact', width: 80, sort: true, filter: true },
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

export default TrackingsTable;
