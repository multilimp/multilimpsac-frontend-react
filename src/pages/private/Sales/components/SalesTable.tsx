import React, { useMemo } from 'react';
import { IconButton, Stack, Button } from '@mui/material';
import { SaleProps } from '@/services/sales/sales';
import { Edit, PictureAsPdf, VisibilityOutlined } from '@mui/icons-material';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { ModalStateEnum } from '@/types/global.enum';
import CustomTable, { AntColumnType } from '@/components/CustomTable';

interface SalesTableProps {
  data: SaleProps[];
  loading: boolean;
  onRecordAction: (action: ModalStateEnum, data: SaleProps) => void;
}

const SalesTable: React.FC<SalesTableProps> = ({ data, loading, onRecordAction }) => {
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
                          ${item.departamentoEntrega?.name ?? ''}
                          ${item.provinciaEntrega?.name ?? ''}
                          ${item.distritoEntrega?.name ?? ''} -
                          ${item.referenciaEntrega ?? ''}`,
      oce: item.documentoOce,
      ocf: item.documentoOcf,

      rawdata: item,
    }));
  }, [data]);

  const columns: Array<AntColumnType<any>> = [    { title: 'Código OC', dataIndex: 'codigo_venta', width: 200, sort: true, filter: true,      render: (value, record) => (
        <Button
          variant="contained" 
          onClick={() => onRecordAction(ModalStateEnum.BOX, record.rawdata)}
          startIcon={<VisibilityOutlined />}
          sx={{
            backgroundColor: '#006DFA !important', // Azul claro con !important
            color: 'white !important',
            fontSize: '0.75rem',
            padding: '4px 12px',
            textTransform: 'none',
            border: 'none',
            boxShadow: '0 2px 4px rgba(0, 109, 250, 0.3)',
            background: '#006DFA !important', // Fuerza el background también
            '&:hover': {
              backgroundColor: '#111826 !important', // Azul oscuro en hover con !important
              background: '#111826 !important',
              boxShadow: '0 4px 8px rgba(17, 24, 38, 0.4)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              backgroundColor: '#0F172A !important', // Azul muy oscuro en click con !important
              background: '#0F172A !important',
            },
            '&.MuiButton-contained': {
              backgroundColor: '#006DFA !important', // Azul claro forzado
              background: '#006DFA !important',
              '&:hover': {
                backgroundColor: '#111826 !important', // Azul oscuro en hover forzado
                background: '#111826 !important',
              },
              '&:active': {
                backgroundColor: '#0F172A !important', // Azul muy oscuro en click forzado
                background: '#0F172A !important',
              }
            },
            // Sobrescribe específicamente los gradientes del tema
            '&.MuiButton-containedPrimary': {
              background: '#006DFA !important',
              backgroundColor: '#006DFA !important',
              '&:hover': {
                background: '#111826 !important',
                backgroundColor: '#111826 !important',
              }
            }
          }}
        >
          {value}
        </Button>
      ),
     },
    { title: 'Razón Social Cliente', dataIndex: 'razon_social_cliente', width: 200, sort: true, filter: true },
    { title: 'RUC Cliente', dataIndex: 'ruc_cliente', width: 200, sort: true, filter: true },
    { title: 'RUC Empresa', dataIndex: 'ruc_empresa', width: 200, sort: true, filter: true },
    { title: 'Razón Social Empresa', dataIndex: 'razon_social_empresa', width: 200, sort: true, filter: true },
    { title: 'Contacto', dataIndex: 'contacto', width: 200, sort: true, filter: true },
    { title: 'Catálogo', dataIndex: 'catalogo', width: 200, sort: true, filter: true },
    { title: 'Fecha Formalización', dataIndex: 'fecha_formalizacion', width: 200, sort: true, filter: true },
    { title: 'Fecha Máxima Entrega', dataIndex: 'fecha_max_entrega', width: 200, sort: true, filter: true },
    { title: 'Monto Venta', dataIndex: 'monto_venta', width: 200, sort: true, filter: true },
    { title: 'CUE', dataIndex: 'cue', width: 200, sort: true, filter: true },
    { title: 'Dirección Entrega', dataIndex: 'direccion_entrega', width: 300, sort: true, filter: true },
    {
      title: 'OCE',
      dataIndex: 'oce',
      width: 100,
      render: (value) =>
        value && (
          <IconButton color="error" component="a" href={value} target="_blank">
            <PictureAsPdf />
          </IconButton>
        ),
    },
    {
      title: 'OCF',
      dataIndex: 'ocf',
      width: 100,
      render: (value) =>
        value && (
          <IconButton color="error" component="a" href={value} target="_blank">
            <PictureAsPdf />
          </IconButton>
        ),
    },
    // {
    //   title: 'Acciones',
    //   dataIndex: 'id',
    //   fixed: 'right',
    //   width: 100,
    //   render: (_, record) => (
    //     <Stack direction="row" spacing={1}>
    //       <IconButton size="small" color="info" onClick={() => onRecordAction(ModalStateEnum.DETAILS, record.rawdata)}>
    //         <VisibilityOutlined fontSize="small" />
    //       </IconButton>

    //       <IconButton size="small" color="primary" onClick={() => onRecordAction(ModalStateEnum.BOX, record.rawdata)}>
    //         <Edit fontSize="small" />
    //       </IconButton>

    //       {/* <IconButton size="small" color="error" onClick={() => onRecordAction(ModalStateEnum.DELETE, record)}>
    //         <Delete fontSize="small" />
    //       </IconButton> */}
    //     </Stack>
    //   ),
    // },
  ];

  return <CustomTable data={formattedData} columns={columns} loading={loading} />;
};

export default SalesTable;
