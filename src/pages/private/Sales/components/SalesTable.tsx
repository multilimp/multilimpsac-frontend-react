import React, { useMemo, useState } from 'react';
import { IconButton, Button, Box, Drawer, List, ListItem, ListItemText, Typography, Tooltip } from '@mui/material';
import { SaleProps } from '@/services/sales/sales';
import { PictureAsPdf, Visibility, Contacts } from '@mui/icons-material';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { ModalStateEnum } from '@/types/global.enum';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { useNavigate } from 'react-router-dom';
import { heroUIColors } from '@/styles/theme/heroui-colors';
import ContactsDrawer from '@/components/ContactsDrawer';
import { ContactTypeEnum } from '@/services/contacts/contacts.enum';

interface SalesTableProps {
  data: SaleProps[];
  loading: boolean;
  onRecordAction?: (action: ModalStateEnum, data: SaleProps) => void;
  onReload?: () => void | Promise<void>;
  isPrivateSales?: boolean;
}

const SalesTable: React.FC<SalesTableProps> = ({ data, loading, onReload, isPrivateSales = false }) => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
  const [contactsDrawerOpen, setContactsDrawerOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>('');

  const handleOpenContactsDrawer = (clientId: number, title: string) => {
    setSelectedClientId(clientId);
    setSelectedTitle(title);
    setContactsDrawerOpen(true);
  };

  // ✅ Función para normalizar estados desde el backend
  const normalizeStatus = (status: string | null | undefined): string => {
    if (!status) return 'incompleto';

    const statusMap: Record<string, string> = {
      'completo': 'completo',           // ✅ Backend devuelve "completo"
      'completado': 'completo',         // ✅ Normalizar variantes
      'incompleto': 'incompleto',
      'incomplete': 'incompleto',
      'pendiente': 'pendiente',
      'pending': 'pendiente',
      'anulado': 'anulado',
      'cancelled': 'anulado',
      'canceled': 'anulado',
    };

    const normalizedStatus = status.toLowerCase().trim();
    return statusMap[normalizedStatus] || 'incompleto';
  };

  const formattedData = useMemo(() => {
    return data.map((item) => {
      const normalizedStatus = normalizeStatus(item.estadoVenta);

      return {
        id: item.id,
        codigo_venta: item.codigoVenta,
        razon_social_cliente: item.cliente?.razonSocial || 'Sin cliente',
        ruc_cliente: item.cliente?.ruc || '',
        ruc_empresa: item.empresa?.ruc || '',
        razon_social_empresa: item.empresa?.razonSocial || 'Sin empresa',
        contacto: item.contactoCliente ? `${item.contactoCliente.nombre} - ${item.contactoCliente.cargo}` : 'Sin contacto',
        clienteId: item.cliente?.id,
        razonSocialCliente: item.cliente?.razonSocial,
        rucCliente: item.cliente?.ruc,
        ...(isPrivateSales ? {} : { fecha_formalizacion: formattedDate(item.fechaForm) }),
        fecha_max_entrega: formattedDate(item.fechaMaxForm),
        monto_venta: formatCurrency(Number(item.montoVenta)),
        cue: item.cliente?.codigoUnidadEjecutora || '',
        direccion_entrega: `${item.direccionEntrega ?? ''} -
                            ${item.departamentoEntrega ?? ''}
                            ${item.provinciaEntrega ?? ''}
                            ${item.distritoEntrega ?? ''} -
                            ${item.referenciaEntrega ?? ''}`,
        // ✅ Usar estado normalizado para ambos campos
        estado_venta: normalizedStatus,
        estado_indicador: normalizedStatus,
        rawdata: item,
      };
    });
  }, [data]);

  // ✅ Función corregida con estados del backend
  const getStatusBackgroundColor = (status: string) => {
    const statusColors: Record<string, string> = {
      incompleto: heroUIColors.warning[500],    // Amarillo/Naranja
      pendiente: heroUIColors.secondary[500],   // Azul
      completo: heroUIColors.success[500],      // ✅ Verde - "completo" no "completado"
      anulado: heroUIColors.error[500],         // Rojo
    };

    return statusColors[status] || heroUIColors.neutral[400]; // Gris por defecto
  };

  // ✅ Función para labels legibles
  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      incompleto: 'Incompleto',
      pendiente: 'Pendiente',
      completo: 'Completo',      // ✅ Label correcto
      anulado: 'Anulado',
    };

    return statusLabels[status] || 'Desconocido';
  };

  const columns: Array<AntColumnType<any>> = [
    {
      title: '',
      dataIndex: 'estado_indicador',
      width: 20,
      render: (value: string) => (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            minHeight: '60px', // ✅ Altura mínima garantizada
            backgroundColor: `${getStatusBackgroundColor(value)} !important`,
            margin: '-16px !important', // ✅ Compensa el padding de la celda
            padding: '6px !important',

            // ✅ Forzar que sobrescriba estilos de tabla
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
      width: 200,
      render: (value, record) => (
        <Tooltip title="Editar venta">
          <Button
            variant="contained"
            onClick={() => {
              navigate('/sales/' + record.id + '/edit')
            }}
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
    { title: 'RUC Cliente', dataIndex: 'ruc_cliente', width: 200, sort: true, filter: true },
    { title: 'RUC Empresa', dataIndex: 'ruc_empresa', width: 200, sort: true, filter: true },
    { title: 'Razón Social Empresa', dataIndex: 'razon_social_empresa', width: 200, sort: true, filter: true },
    {
      title: 'Contactos',
      dataIndex: 'contacto',
      width: 150,
      sort: true,
      filter: true,
      align: 'center',
      render: (_, record) => (
        <Tooltip title="Ver contactos del cliente">
          <Button
            variant="outlined"
            startIcon={<Contacts />}
            onClick={() => handleOpenContactsDrawer(record.clienteId, `${record.razonSocialCliente} - ${record.rucCliente}`)}
            size="small"
            color="primary"
          >
            Ver
          </Button>
        </Tooltip>
      ),
    },
    ...(isPrivateSales ? [] : [{ title: 'Fecha Formalización', dataIndex: 'fecha_formalizacion', width: 200, sort: true, filter: true }]),
    { title: 'Fecha Máxima Entrega', dataIndex: 'fecha_max_entrega', width: 200, sort: true, filter: true },
    { title: 'Monto Venta', dataIndex: 'monto_venta', width: 200, sort: true, filter: true },
    { title: 'CUE', dataIndex: 'cue', width: 200, sort: true, filter: true },
    { title: 'Dirección Entrega', dataIndex: 'direccion_entrega', width: 300, sort: true, filter: true },
    {
      title: 'Estado',
      dataIndex: 'estado_venta',
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
    <>
      <AntTable data={formattedData} columns={columns} loading={loading} onReload={onReload} />
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

export default SalesTable;
