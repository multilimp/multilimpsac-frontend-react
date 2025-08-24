// src/pages/private/Collections/components/CollectionsTable.tsx
import React, { useMemo } from 'react';
import { IconButton, Button } from '@mui/material';
import { PictureAsPdf, Visibility } from '@mui/icons-material';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { ModalStateEnum } from '@/types/global.enum';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { SaleProps } from '@/services/sales/sales';

interface CollectionsTableProps {
  data: SaleProps[];
  loading: boolean;
  onRecordAction?: (action: ModalStateEnum, data: SaleProps) => void;
  onReload?: () => void;
}

const defaultText = 'N/A';

const CollectionsTable: React.FC<CollectionsTableProps> = ({ data, loading, onRecordAction, onReload }) => {

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
      catalogo: item?.catalogoEmpresa?.nombre ?? defaultText,
      fecha_formalizacion: formattedDate(item.fechaForm, undefined, defaultText),
      fecha_max_entrega: formattedDate(item.fechaMaxForm, undefined, defaultText),
      monto_venta: formatCurrency(item.montoVenta ? parseInt(item.montoVenta, 10) : 0),
      cue: item?.cliente?.codigoUnidadEjecutora ?? defaultText,
      direccion_entrega: `${item.direccionEntrega ?? ''} - ${item.departamentoEntrega ?? ''} ${item.provinciaEntrega ?? ''} ${item.distritoEntrega ?? ''} - ${item.referenciaEntrega ?? ''}`,

      // Campos específicos de cobranza
      estado_cobranza: item.estadoCobranza || 'pendiente',
      fecha_estado_cobranza: formattedDate(item.fechaEstadoCobranza, undefined, defaultText),
      neto_cobrado: formatCurrency(item.netoCobrado ? parseInt(item.netoCobrado, 10) : 0),
      penalidad: formatCurrency(item.penalidad ? parseInt(item.penalidad, 10) : 0),
      fecha_proxima_gestion: formattedDate(item.fechaProximaGestion, undefined, defaultText),

      oce: item.documentoOce || null,
      ocf: item.documentoOcf || null,

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
            console.log('Abriendo detalles de cobranza:', record.rawdata.id);
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
    { title: 'Fecha Formalización', dataIndex: 'fecha_formalizacion', width: 150, sort: true, filter: true },
    { title: 'Fecha Máx. Entrega', dataIndex: 'fecha_max_entrega', width: 150, sort: true, filter: true },
    { title: 'Monto Venta', dataIndex: 'monto_venta', width: 130, sort: true, filter: true },
    { title: 'CUE', dataIndex: 'cue', width: 120, sort: true, filter: true },
    { title: 'Fecha Estado Cobranza', dataIndex: 'fecha_estado_cobranza', width: 160, sort: true, filter: true },
    { title: 'Neto Cobrado', dataIndex: 'neto_cobrado', width: 120, sort: true, filter: true },
    { title: 'Penalidad', dataIndex: 'penalidad', width: 100, sort: true, filter: true },
    { title: 'Próxima Gestión', dataIndex: 'fecha_proxima_gestion', width: 150, sort: true, filter: true },
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
    {
      title: 'Estado Cobranza',
      dataIndex: 'estado_cobranza',
      width: 150,
      sort: true,
      filter: true,
      render: (value) => {
        const colorMap: Record<string, string> = {
          'pendiente': '#f5a524', // amarillo
          'cobrado': '#17c964', // verde
          'parcial': '#006fee', // azul
          'vencido': '#f31260', // rojo
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

export default CollectionsTable;
