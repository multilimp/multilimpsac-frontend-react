
import { SaleProps } from '@/services/sales/sales';
import { useState } from 'react';
import AntTable from '@/components/AntTable';
import { Box, Button, Tooltip } from '@mui/material';
import { generateInvoice } from '@/services/sales/sales.request';
import { notification } from 'antd';
import { formatCurrency } from '@/utils/functions';
import { 
  Receipt as ReceiptIcon, 
  Edit as EditIcon,
  Download as DownloadIcon, 
  Search as SearchIcon,
  FilterAlt as FilterIcon 
} from '@mui/icons-material';
import { Input, Select, DatePicker, Button as AntButton } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface SalesTableProps {
  data: SaleProps[];
  loading: boolean;
  onEdit: (sale: SaleProps) => void;
  onRefresh: () => void;
}

const SalesTable = ({ data, loading, onEdit, onRefresh }: SalesTableProps) => {
  const [generatingInvoice, setGeneratingInvoice] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    dateRange: [] as [dayjs.Dayjs | null, dayjs.Dayjs | null]
  });

  const handleGenerateInvoice = async (saleId: string) => {
    try {
      setGeneratingInvoice(saleId);
      const response = await generateInvoice(saleId);
      
      if (response && response.pdfUrl) {
        // Open PDF in new tab
        window.open(response.pdfUrl, '_blank');
      }
      
      notification.success({
        message: 'Éxito',
        description: 'La factura ha sido generada correctamente'
      });
    } catch (error) {
      console.error('Error generating invoice:', error);
      notification.error({
        message: 'Error',
        description: 'No se pudo generar la factura'
      });
    } finally {
      setGeneratingInvoice(null);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  // Filter data based on search term and filters
  const filteredData = data.filter(sale => {
    // Search term filtering
    if (searchTerm && !Object.values(sale).some(val => 
      val && String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )) {
      return false;
    }
    
    // Status filtering
    if (filters.status && sale.status !== filters.status) {
      return false;
    }
    
    // Date range filtering
    if (filters.dateRange?.length === 2 && filters.dateRange[0] && filters.dateRange[1]) {
      const saleDate = dayjs(sale.date);
      if (
        !saleDate.isAfter(filters.dateRange[0], 'day') || 
        !saleDate.isBefore(filters.dateRange[1], 'day')
      ) {
        return false;
      }
    }
    
    return true;
  });

  const columns = [
    {
      title: 'Código',
      dataIndex: 'saleCode',
      key: 'saleCode',
      render: (saleCode: string | undefined, record: SaleProps) => {
        return saleCode || record.saleNumber || '-';
      },
      filters: [], 
      filterSearch: true,
    },
    {
      title: 'Cliente',
      dataIndex: 'client',
      key: 'client',
      filters: [],
      filterSearch: true,
    },
    {
      title: 'RUC Cliente',
      dataIndex: 'clientRuc',
      key: 'clientRuc',
      render: (clientRuc: string | undefined) => clientRuc || '-',
      filters: [],
      filterSearch: true,
    },
    {
      title: 'Empresa',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (companyName: string | undefined) => companyName || '-',
      filters: [],
      filterSearch: true,
    },
    {
      title: 'RUC Empresa',
      dataIndex: 'companyRuc',
      key: 'companyRuc',
      render: (companyRuc: string | undefined) => companyRuc || '-',
      filters: [],
      filterSearch: true,
    },
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: SaleProps, b: SaleProps) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Fecha Formal',
      dataIndex: 'formalDate',
      key: 'formalDate',
      render: (formalDate: string | undefined) => formalDate || '-',
      sorter: (a: SaleProps, b: SaleProps) => {
        if (!a.formalDate || !b.formalDate) return 0;
        return new Date(a.formalDate).getTime() - new Date(b.formalDate).getTime();
      },
    },
    {
      title: 'Método de Pago',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      filters: [
        { text: 'Efectivo', value: 'cash' },
        { text: 'Crédito', value: 'credit' },
        { text: 'Transferencia', value: 'transfer' },
      ],
      onFilter: (value: string, record: SaleProps) => record.paymentMethod === value,
      render: (paymentMethod: string) => {
        const methods: Record<string, string> = {
          cash: 'Efectivo',
          credit: 'Crédito',
          transfer: 'Transferencia'
        };
        return methods[paymentMethod] || paymentMethod;
      }
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Completado', value: 'completed' },
        { text: 'Pendiente', value: 'pending' },
        { text: 'Reembolsado', value: 'refunded' },
      ],
      onFilter: (value: string, record: SaleProps) => record.status === value,
      render: (status: string) => {
        const statusColors: Record<string, string> = {
          completed: '#04BA6B',
          pending: '#fb9c0c',
          refunded: '#f04438'
        };
        const statusLabels: Record<string, string> = {
          completed: 'Completado',
          pending: 'Pendiente',
          refunded: 'Reembolsado'
        };
        return (
          <div style={{ 
            backgroundColor: `${statusColors[status]}20`, 
            color: statusColors[status],
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'inline-block',
            fontWeight: 500,
            fontSize: '0.85rem',
            border: `1px solid ${statusColors[status]}40`
          }}>
            {statusLabels[status] || status}
          </div>
        );
      }
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      sorter: (a: SaleProps, b: SaleProps) => a.total - b.total,
      render: (total: number) => formatCurrency(total)
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: SaleProps) => (
        <Box sx={{ display: 'flex', gap: '8px' }}>
          <Tooltip title="Editar">
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => onEdit(record)}
              sx={{ minWidth: 'unset', p: '4px' }}
            >
              <EditIcon fontSize="small" />
            </Button>
          </Tooltip>
          <Tooltip title="Generar factura">
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={() => handleGenerateInvoice(record.id.toString())}
              disabled={generatingInvoice === record.id.toString()}
              sx={{ minWidth: 'unset', p: '4px' }}
            >
              <ReceiptIcon fontSize="small" />
            </Button>
          </Tooltip>
          <Tooltip title="Descargar">
            <Button
              size="small"
              variant="outlined"
              color="info"
              sx={{ minWidth: 'unset', p: '4px' }}
            >
              <DownloadIcon fontSize="small" />
            </Button>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Box>
      <Box sx={{ 
        p: 2, 
        bgcolor: 'background.paper', 
        borderRadius: 2, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)', 
        mb: 2,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center'
      }}>
        <Input
          placeholder="Buscar ventas..."
          allowClear
          onChange={e => handleSearch(e.target.value)}
          style={{ maxWidth: '300px', flex: 1 }}
          prefix={<SearchIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />}
        />
        
        <AntButton 
          type="default"
          icon={<FilterIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filtros
        </AntButton>
        
        <AntButton
          type="primary"
          icon={<DownloadIcon sx={{ fontSize: '1rem' }} />}
          style={{ marginLeft: 'auto' }}
        >
          Exportar
        </AntButton>
      </Box>

      {showFilters && (
        <Box sx={{ 
          p: 2, 
          bgcolor: 'background.paper', 
          borderRadius: 2, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)', 
          mb: 2,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Select
            placeholder="Estado"
            style={{ width: '200px' }}
            allowClear
            onChange={value => handleFilterChange('status', value)}
            options={[
              { value: 'completed', label: 'Completado' },
              { value: 'pending', label: 'Pendiente' },
              { value: 'refunded', label: 'Reembolsado' }
            ]}
          />
          
          <RangePicker 
            style={{ width: '300px' }} 
            onChange={dates => handleFilterChange('dateRange', dates)}
          />
          
          <AntButton onClick={() => {
            setFilters({
              status: '',
              dateRange: []
            });
          }}>
            Limpiar filtros
          </AntButton>
        </Box>
      )}
      
      <AntTable 
        columns={columns}
        data={filteredData}
        loading={loading}
      />
    </Box>
  );
};

export default SalesTable;
