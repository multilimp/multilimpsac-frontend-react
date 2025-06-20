// src/pages/private/Collections/components/CollectionsTable.tsx
import React, { useMemo } from 'react';
import { IconButton, Button } from '@mui/material';
import { PictureAsPdf, Visibility } from '@mui/icons-material';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { ModalStateEnum } from '@/types/global.enum';
import AntTable, { AntColumnType } from '@/components/AntTable';

// Interface basada en SaleProps - los mismos campos base que ventas
export interface CollectionProps {
  id: number;
  codigoVenta: string;
  cliente: {
    razonSocial: string;
    ruc: string;
    codigoUnidadEjecutora: string;
  };
  empresa: {
    ruc: string;
    razonSocial: string;
  };
  contactoCliente?: {
    nombre: string;
    cargo: string;
  };
  catalogoEmpresa?: {
    nombre: string;
  };
  fechaForm: string;
  fechaMaxForm: string;
  montoVenta: string;
  direccionEntrega?: string;
  departamentoEntrega?: string;
  provinciaEntrega?: string;
  distritoEntrega?: string;
  referenciaEntrega?: string;
  estadoVenta?: string;
  documentoOce?: string;
  documentoOcf?: string;
  // Campos específicos de cobranza (se pueden agregar después)
  estadoCobranza?: string;
  fechaEstadoCobranza?: string;
  netoCobrado?: string;
  penalidad?: string;
  fechaProximaGestion?: string;
}

interface CollectionsTableProps {
  data: CollectionProps[];
  loading: boolean;
  onRecordAction?: (action: ModalStateEnum, data: CollectionProps) => void;
}

const CollectionsTable: React.FC<CollectionsTableProps> = ({ data, loading, onRecordAction }) => {

  const formattedData = useMemo(() => {
    return data.map((item) => ({
      id: item.id,
      codigo_venta: item.codigoVenta,
      razon_social_cliente: item.cliente.razonSocial,
      ruc_cliente: item.cliente.ruc,
      ruc_empresa: item.empresa.ruc,
      razon_social_empresa: item.empresa.razonSocial,
      contacto: item.contactoCliente ? `${item.contactoCliente.nombre} - ${item.contactoCliente.cargo}` : '',
      catalogo: item.catalogoEmpresa?.nombre ?? '',
      fecha_formalizacion: formattedDate(item.fechaForm),
      fecha_max_entrega: formattedDate(item.fechaMaxForm),
      monto_venta: formatCurrency(Number(item.montoVenta)),
      cue: item.cliente.codigoUnidadEjecutora,
      direccion_entrega: `${item.direccionEntrega ?? ''} -
                          ${item.departamentoEntrega ?? ''}
                          ${item.provinciaEntrega ?? ''}
                          ${item.distritoEntrega ?? ''} -
                          ${item.referenciaEntrega ?? ''}`,
      
      // Campos específicos de cobranza
      estado_cobranza: item.estadoCobranza || 'pendiente',
      fecha_estado_cobranza: formattedDate(item.fechaEstadoCobranza),
      neto_cobrado: formatCurrency(Number(item.netoCobrado || 0)),
      penalidad: formatCurrency(Number(item.penalidad || 0)),
      fecha_proxima_gestion: formattedDate(item.fechaProximaGestion),
      
      oce: item.documentoOce,
      ocf: item.documentoOcf,

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
    
    // Campos específicos de cobranza
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

export default CollectionsTable;
