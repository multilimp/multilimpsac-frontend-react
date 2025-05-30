import React, { useMemo } from 'react';
import { IconButton, Stack } from '@mui/material';
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

  const columns: Array<AntColumnType<any>> = [
    { title: 'Código Venta', dataIndex: 'codigo_venta', width: 200, sort: true, filter: true },
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
    {
      title: 'Acciones',
      dataIndex: 'id',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small" color="info" onClick={() => onRecordAction(ModalStateEnum.DETAILS, record.rawdata)}>
            <VisibilityOutlined fontSize="small" />
          </IconButton>

          <IconButton size="small" color="primary" onClick={() => onRecordAction(ModalStateEnum.BOX, record.rawdata)}>
            <Edit fontSize="small" />
          </IconButton>

          {/* <IconButton size="small" color="error" onClick={() => onRecordAction(ModalStateEnum.DELETE, record)}>
            <Delete fontSize="small" />
          </IconButton> */}
        </Stack>
      ),
    },
  ];

  return <CustomTable data={formattedData} columns={columns} loading={loading} />;
};

export default SalesTable;
