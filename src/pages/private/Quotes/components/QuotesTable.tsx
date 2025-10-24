import React, { useMemo, useState } from 'react';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { CotizacionProps, CotizacionEstado } from '@/types/cotizacion.types';
import { Box, Button, Tooltip } from '@mui/material';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { Link } from 'react-router-dom';
import { Visibility, Contacts } from '@mui/icons-material';
import ContactsDrawer from '@/components/ContactsDrawer';
import { ContactTypeEnum } from '@/services/contacts/contacts.enum';
import { heroUIColors } from '@/styles/theme/heroui-colors';

interface QuotesTableProps {
  data: CotizacionProps[];
  loading: boolean;
  onReload?: () => void | Promise<void>;
}

interface FormattedQuoteRow {
  id: number;
  codigo_cotizacion: string;
  razon_social_cliente: string;
  ruc_cliente: string;
  razon_social_empresa: string;
  ruc_empresa: string;
  clienteId?: number;
  razonSocialCliente?: string;
  rucCliente?: string;
  fecha_cotizacion: string;
  fecha_entrega: string;
  monto_total: string;
  direccion_entrega: string;
  estado: CotizacionEstado;
  rawdata: CotizacionProps;
}

const getQuoteBackgroundColor = (estado: CotizacionEstado) => {
  switch (estado) {
    case CotizacionEstado.PENDIENTE:
      return heroUIColors.warning[500];
    case CotizacionEstado.APROBADO:
      return heroUIColors.success[600];
    case CotizacionEstado.COTIZADO:
      return heroUIColors.secondary[500];
    default:
      return heroUIColors.neutral[400];
  }
};

const getQuoteLabel = (estado: CotizacionEstado) => {
  switch (estado) {
    case CotizacionEstado.PENDIENTE:
      return 'Pendiente';
    case CotizacionEstado.APROBADO:
      return 'Aprobado';
    case CotizacionEstado.COTIZADO:
      return 'Cotizado';
    default:
      return String(estado);
  }
};

const QuotesTable = ({ data, loading, onReload }: QuotesTableProps) => {
  const [contactsDrawerOpen, setContactsDrawerOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>('');

  const formattedData: FormattedQuoteRow[] = useMemo(() => {
    return data.map((item) => ({
      id: item.id,
      codigo_cotizacion: item.codigoCotizacion,
      razon_social_cliente: item.cliente?.razonSocial || 'Sin cliente',
      ruc_cliente: item.cliente?.ruc || '',
      razon_social_empresa: item.empresa?.razonSocial || 'Sin empresa',
      ruc_empresa: item.empresa?.ruc || '',
      clienteId: item.cliente?.id,
      razonSocialCliente: item.cliente?.razonSocial,
      rucCliente: item.cliente?.ruc,
      fecha_cotizacion: formattedDate(item.fechaCotizacion),
      fecha_entrega: item.fechaEntrega ? formattedDate(item.fechaEntrega) : '-',
      monto_total: formatCurrency(Number(item.montoTotal || '0')),
      direccion_entrega: `${item.direccionEntrega ?? ''} - ${item.departamentoEntrega ?? ''} ${item.provinciaEntrega ?? ''} ${item.distritoEntrega ?? ''} - ${item.referenciaEntrega ?? ''}`,
      estado: item.estado,
      rawdata: item,
    }));
  }, [data]);

  const handleOpenContactsDrawer = (clientId: number, title: string) => {
    setSelectedClientId(clientId);
    setSelectedTitle(title);
    setContactsDrawerOpen(true);
  };

  const columns: AntColumnType<FormattedQuoteRow>[] = [
    {
      title: '',
      dataIndex: 'estado',
      width: 20,
      render: (value: CotizacionEstado) => (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            minHeight: '60px',
            backgroundColor: `${getQuoteBackgroundColor(value)} !important`,
            margin: '-16px !important',
            padding: '6px !important',
            '&:hover': {
              backgroundColor: `${getQuoteBackgroundColor(value)} !important`,
              opacity: '0.9 !important',
            }
          }}
        />
      ),
    },
    {
      title: 'Código Cotización',
      dataIndex: 'codigo_cotizacion',
      width: 200,
      render: (value, record) => (
        <Tooltip title="Editar cotización">
          <Button
            variant="contained"
            component={Link}
            to={`/quotes/${record.id}/edit`}
            startIcon={<Visibility />}
            size="small"
            color="info"
            style={{ width: '100%' }}
          >
            {value}
          </Button>
        </Tooltip>
      )
    },
    { title: 'Razón Social Cliente', dataIndex: 'razon_social_cliente', width: 200, sort: true, filter: true },
    { title: 'RUC Cliente', dataIndex: 'ruc_cliente', width: 150, sort: true, filter: true },
    { title: 'Razón Social Empresa', dataIndex: 'razon_social_empresa', width: 200, sort: true, filter: true },
    { title: 'RUC Empresa', dataIndex: 'ruc_empresa', width: 150, sort: true, filter: true },
    {
      title: 'Contactos',
      dataIndex: 'contacto',
      width: 150,
      align: 'center',
      filter: true,
      render: (_, record) => (
        <Tooltip title="Ver contactos del cliente">
          <Button
            variant="outlined"
            startIcon={<Contacts />}
            onClick={() => handleOpenContactsDrawer(record.clienteId as number, `${record.razonSocialCliente} - ${record.rucCliente}`)}
            size="small"
            color="primary"
          >
            Ver
          </Button>
        </Tooltip>
      ),
    },
    { title: 'Fecha Cotización', dataIndex: 'fecha_cotizacion', width: 200, sort: true, filter: true },
    { title: 'Fecha Entrega', dataIndex: 'fecha_entrega', width: 200, sort: true, filter: true },
    { title: 'Monto Total', dataIndex: 'monto_total', width: 200, sort: true, filter: true },
    { title: 'Dirección Entrega', dataIndex: 'direccion_entrega', width: 300, sort: true, filter: true },
    {
      title: 'Estado',
      dataIndex: 'estado',
      width: 150,
      sort: true,
      filter: true,
      filters: [
        { text: 'Pendiente', value: CotizacionEstado.PENDIENTE },
        { text: 'Aprobado', value: CotizacionEstado.APROBADO },
        { text: 'Cotizado', value: CotizacionEstado.COTIZADO },
      ],
      onFilter: (value, record) => record.estado === value,
      render: (estado: CotizacionEstado) => {
        const bgColor = getQuoteBackgroundColor(estado);
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
            {getQuoteLabel(estado)}
          </Box>
        );
      }
    },
  ];

  return (
    <>
      <AntTable
        columns={columns}
        data={formattedData}
        loading={loading}
        rowKey="id"
        onReload={onReload}
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
    </>
  );
};

export default QuotesTable;
