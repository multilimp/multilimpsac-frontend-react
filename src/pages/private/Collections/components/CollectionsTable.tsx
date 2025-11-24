// src/pages/private/Collections/components/CollectionsTable.tsx
import React, { useMemo, useState } from 'react';
import { IconButton, Button, Box, Tooltip } from '@mui/material';
import { PictureAsPdf, Visibility, Contacts } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { ModalStateEnum } from '@/types/global.enum';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { SaleProps } from '@/services/sales/sales';
import { ESTADO_ROL_COLORS, ESTADO_ROL_LABELS } from '@/utils/constants';
import ContactsDrawer from '@/components/ContactsDrawer';
import { ContactTypeEnum } from '@/services/contacts/contacts.enum';

interface CollectionsTableProps {
  data: SaleProps[];
  loading: boolean;
  onRecordAction?: (action: ModalStateEnum, data: SaleProps) => void;
  onReload?: () => void;
}

const defaultText = ' ';

const CollectionsTable: React.FC<CollectionsTableProps> = ({ data, loading, onReload }) => {
  const [contactsDrawerOpen, setContactsDrawerOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>('');

  const handleOpenContactsDrawer = (clienteId: number, title: string) => {
    setSelectedClientId(clienteId);
    setSelectedTitle(title);
    setContactsDrawerOpen(true);
  };

  const getStatusBackgroundColor = (status: string | null | undefined) => {
    if (!status || typeof status !== 'string') {
      return ESTADO_ROL_COLORS.PENDIENTE;
    }

    if (status === "COMPLETO") {
      return ESTADO_ROL_COLORS.COMPLETADO;
    }
    const normalizedStatus = status.toUpperCase() as keyof typeof ESTADO_ROL_COLORS;
    return ESTADO_ROL_COLORS[normalizedStatus] || ESTADO_ROL_COLORS.PENDIENTE;
  };

  const getStatusLabel = (status: string | null | undefined) => {
    if (!status || typeof status !== 'string') {
      return ESTADO_ROL_LABELS.PENDIENTE;
    }

    if (status === "COMPLETO") {
      return ESTADO_ROL_LABELS.COMPLETADO;
    }
    const normalizedStatus = status.toUpperCase() as keyof typeof ESTADO_ROL_LABELS;
    return ESTADO_ROL_LABELS[normalizedStatus] || ESTADO_ROL_LABELS.PENDIENTE;
  };

  const formattedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    // Los datos ya vienen filtrados desde el componente padre (tabs)
    return data.map((item) => {
      // Obtener la primera factura
      const firstBilling = Array.isArray(item.facturaciones) && item.facturaciones.length > 0
        ? item.facturaciones[0]
        : item.facturacion
          ? { factura: item.facturacion.factura, fechaFactura: item.facturacion.fechaFactura }
          : null;

      const numeroFactura = firstBilling?.factura ?? defaultText;
      const fechaFactura = formattedDate(firstBilling?.fechaFactura, undefined, defaultText);

      // Obtener el código OCF sin prefijo (solo el número)
      const fullCodigoOcf = item?.codigoOcf || '';
      const codigoOcfSoloNumero = fullCodigoOcf.includes('-')
        ? fullCodigoOcf.split('-').slice(1).join('-').trim()
        : fullCodigoOcf;

      return {
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
        fecha_estado_cobranza: formattedDate(item.fechaEstadoCobranza, undefined, defaultText),
        neto_cobrado: formatCurrency(item.netoCobrado ? parseInt(item.netoCobrado, 10) : 0),
        penalidad: formatCurrency(item.penalidad ? parseInt(item.penalidad, 10) : 0),
        // Nuevas columnas agregadas
        numero_factura: numeroFactura,
        fecha_factura: fechaFactura,
        cobrador: item?.cobrador?.nombre || 'Sin asignar',
        codigo_ocf_numero: codigoOcfSoloNumero || defaultText,
        documento_peru_compras: item.documentoPeruCompras || 'N/A',
        oce: item.documentoOce || null,
        ocf: item.documentoOcf || null,
        carta_ampliacion: item.cartaAmpliacion || null,
        estado_indicador: String(item.estadoCobranzaRol || 'PENDIENTE'),
        rawdata: item,
      };
    });
  }, [data]);

  interface CollectionsRow {
    id?: number;
    rawdata?: SaleProps;
    codigo_venta?: string;
    estado_indicador?: string;
    [key: string]: unknown;
  }
  const columns: Array<AntColumnType<CollectionsRow>> = [
    {
      title: '',
      dataIndex: 'estado_indicador',
      width: 20,
      render: (value: string) => (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            minHeight: '60px',
            backgroundColor: `${getStatusBackgroundColor(value)} !important`,
            margin: '-16px !important',
            padding: '6px !important',
            '&:hover': {
              backgroundColor: `${getStatusBackgroundColor(value)} !important`,
              opacity: '0.9 !important',
            }
          }}
        />
      ),
    },
    {
      title: 'Código OC',
      dataIndex: 'codigo_venta',
      width: 120,
      render: (value, record: CollectionsRow) => {
        if (!record?.rawdata?.id) {
          return <span>{value}</span>;
        }
        return (
          <Button
            component={Link}
            to={`/collections/${record.rawdata.id}`}
            variant="contained"
            startIcon={<Visibility />}
            size="small"
            color="info"
            style={{ width: '100%', textDecoration: 'none' }}
          >
            {value}
          </Button>
        );
      }
    },
    { title: 'Razón Social Cliente', dataIndex: 'razon_social_cliente', width: 200, sort: true, filter: true },
    { title: 'RUC Cliente', dataIndex: 'ruc_cliente', width: 150, sort: true, filter: true },
    { title: 'RUC Empresa', dataIndex: 'ruc_empresa', width: 150, sort: true, filter: true },
    { title: 'Razón Social Empresa', dataIndex: 'razon_social_empresa', width: 200, sort: true, filter: true },
    {
      title: 'Contacto',
      dataIndex: 'contacto',
      width: 150,
      filter: true,
      align: 'center',
      render: (_, record) => (
        <Tooltip title="Ver contactos del cliente">
          <Button
            variant="outlined"
            startIcon={<Contacts />}
            onClick={() => record.rawdata?.clienteId && handleOpenContactsDrawer(record.rawdata.clienteId, `${record.razon_social_cliente} - ${record.ruc_cliente}`)}
            size="small"
            color="primary"
          >
            Ver
          </Button>
        </Tooltip>
      ),
    },
    { title: 'Fecha Formalización', dataIndex: 'fecha_formalizacion', width: 150, sort: true, filter: true },
    { title: 'Fecha Máx. Entrega', dataIndex: 'fecha_max_entrega', width: 150, sort: true, filter: true },
    {
      title: 'Fuera de plazo',
      dataIndex: 'fuera_plazo',
      width: 140,
      align: 'center',
      render: (_: unknown, record: CollectionsRow) => {
        const entrega = record.rawdata?.fechaEntregaOc || record.rawdata?.fechaEntrega;
        const max = record.rawdata?.fechaMaxForm;
        if (!entrega || !max) {
          return <span>-</span>;
        }
        const entregaTime = new Date(entrega).getTime();
        const maxTime = new Date(max).getTime();
        if (Number.isNaN(entregaTime) || Number.isNaN(maxTime)) {
          return <span>-</span>;
        }
        const fuera = entregaTime > maxTime;
        return (
          <Box

          >
            {fuera ? 'Sí' : 'No'}
          </Box>
        );
      },
    },
    { title: 'Monto Venta', dataIndex: 'monto_venta', width: 130, sort: true, filter: true },
    { title: 'Cobrador', dataIndex: 'cobrador', width: 150, sort: true, filter: true },

    { title: 'CUE', dataIndex: 'cue', width: 120, sort: true, filter: true },
    { title: 'Neto Cobrado', dataIndex: 'neto_cobrado', width: 120, sort: true, filter: true },
    { title: 'Penalidad', dataIndex: 'penalidad', width: 100, sort: true, filter: true },
    { title: 'Próxima Gestión', dataIndex: 'fecha_proxima_gestion', width: 150, sort: true, filter: true },
    { title: 'Número Factura', dataIndex: 'numero_factura', width: 140, sort: true, filter: true },
    { title: 'Fecha Factura', dataIndex: 'fecha_factura', width: 130, sort: true, filter: true },
    {
      title: 'OCE',
      dataIndex: 'oce',
      width: 80,
      render: (value) =>
        value ? (
          <IconButton color="error" component="a" href={value} target="_blank" size="small">
            <PictureAsPdf />
          </IconButton>
        ) : (
          <span>-</span>
        ),
    },
    {
      title: 'OCF',
      dataIndex: 'ocf',
      width: 80,
      render: (value) =>
        value ? (
          <IconButton color="error" component="a" href={value} target="_blank" size="small">
            <PictureAsPdf />
          </IconButton>
        ) : (
          <span>-</span>
        ),
    },
    { title: 'Código OCF', dataIndex: 'codigo_ocf_numero', width: 120, sort: true, filter: true },
    {
      title: 'Perú Compras', dataIndex: 'documento_peru_compras', width: 120, render: (value) => value ? (
        <IconButton color="error" component="a" href={value} target="_blank" size="small">
          <PictureAsPdf />
        </IconButton>
      ) : (
        <span>-</span>
      )
    },
    {
      title: 'Carta Ampliación',
      dataIndex: 'carta_ampliacion',
      width: 100,
      render: (value) =>
        value ? (
          <IconButton color="error" component="a" href={value} target="_blank" size="small">
            <PictureAsPdf />
          </IconButton>
        ) : (
          <span>-</span>
        ),
    },
    {
      title: 'Estado',
      dataIndex: 'estado_indicador',
      width: 150,
      sort: true,
      filter: true,
      render: (value: string) => {
        const bgColor = getStatusBackgroundColor(value);

        return (
          <Box
            sx={{
              width: '100%',
              backgroundColor: bgColor,
              color: 'white',
              textAlign: 'center',
              borderRadius: '4px',
              padding: '6px 16px',
              fontWeight: 600,
              fontSize: '0.8125rem',
              textTransform: 'none',
              boxShadow: `0 2px 8px ${bgColor}40`,
              cursor: 'default',
              transition: 'all 0.2s ease',

              '&:hover': {
                opacity: 0.9,
                transform: 'translateY(-1px)',
                boxShadow: `0 4px 12px ${bgColor}60`,
              }
            }}
          >
            {getStatusLabel(value)}
          </Box>
        );
      },
    },
  ];
  return (
    <div>
      <AntTable
        data={formattedData}
        columns={columns}
        loading={loading}
        scroll={{ x: 3500 }}
        size="small"
        onReload={onReload}
        rowKey="id"
      />
      {contactsDrawerOpen && selectedClientId && (
        <ContactsDrawer
          handleClose={() => setContactsDrawerOpen(false)}
          tipo={ContactTypeEnum.CLIENTE}
          referenceId={selectedClientId}
          title={selectedTitle}
          readOnly={true}
        />
      )}
    </div>
  );
};

export default CollectionsTable;
