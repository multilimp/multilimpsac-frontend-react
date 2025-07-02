import React, { useMemo } from 'react';
import { IconButton, Button, Box } from '@mui/material';
import { SaleProps } from '@/services/sales/sales';
import { PictureAsPdf, Visibility } from '@mui/icons-material';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { ModalStateEnum } from '@/types/global.enum';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { useNavigate } from 'react-router-dom';
import { heroUIColors } from '@/styles/theme/heroui-colors';

interface SalesTableProps {
  data: SaleProps[];
  loading: boolean;
  onRecordAction?: (action: ModalStateEnum, data: SaleProps) => void;
}

const SalesTable: React.FC<SalesTableProps> = ({ data, loading }) => {
  const navigate = useNavigate();
  
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
        // ✅ Usar estado normalizado para ambos campos
        estado_venta: normalizedStatus,
        estado_indicador: normalizedStatus,
        oce: item.documentoOce,
        ocf: item.documentoOcf,
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
      width: 40,
      render: (value: string) => (
        <Box
          sx={{
            width: '100%', 
            height: '100%', 
            minHeight: '60px', // ✅ Altura mínima garantizada
            backgroundColor: `${getStatusBackgroundColor(value)} !important`,
            margin: '-16px !important', // ✅ Compensa el padding de la celda
            padding: '6px !important', 
            display: 'flex !important',
            alignItems: 'center !important',
            justifyContent: 'center !important',
            borderRadius: '0 !important', // ✅ Sin bordes redondeados para ocupar toda la celda
            
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
      )
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

  return <AntTable data={formattedData} columns={columns} loading={loading} />;
};

export default SalesTable;
