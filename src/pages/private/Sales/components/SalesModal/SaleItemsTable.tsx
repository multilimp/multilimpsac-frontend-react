
import { Box, Typography, Button, IconButton } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Select, Table, InputNumber } from 'antd';
import { ProductProps } from '@/services/products/product';
import { formatCurrency } from '@/utils/functions';

interface SaleItemsTableProps {
  items: Array<{
    key: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  products: ProductProps[];
  selectedProduct: string | null;
  setSelectedProduct: (value: string | null) => void;
  onAddItem: () => void;
  onQuantityChange: (value: number | null, key: string) => void;
  onDeleteItem: (key: string) => void;
}

const SaleItemsTable = ({
  items,
  products,
  selectedProduct,
  setSelectedProduct,
  onAddItem,
  onQuantityChange,
  onDeleteItem
}: SaleItemsTableProps) => {
  const columns = [
    {
      title: 'Producto',
      dataIndex: 'productName',
      key: 'productName',
      width: '40%'
    },
    {
      title: 'Cantidad',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '15%',
      render: (value: number, record: any) => (
        <InputNumber
          min={1}
          value={value}
          onChange={(val) => onQuantityChange(val, record.key)}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: 'Precio Unit.',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: '15%',
      render: (value: number) => formatCurrency(value)
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      width: '15%',
      render: (value: number) => formatCurrency(value)
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: '15%',
      render: (_: any, record: any) => (
        <IconButton color="error" size="small" onClick={() => onDeleteItem(record.key)}>
          <DeleteIcon />
        </IconButton>
      )
    }
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Productos</Typography>
      
      <Box sx={{ display: 'flex', mb: 2, gap: 1 }}>
        <Select
          placeholder="Seleccionar producto"
          style={{ flex: 1 }}
          value={selectedProduct}
          onChange={setSelectedProduct}
          showSearch
          optionFilterProp="label"
          options={products.map(product => ({
            value: product.id,
            label: `${product.name} - ${formatCurrency(product.price)}`,
          }))}
        />
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={onAddItem}
          disabled={!selectedProduct}
        >
          Agregar
        </Button>
      </Box>

      <Table
        dataSource={items}
        columns={columns}
        pagination={false}
        rowKey="key"
        size="small"
        style={{ marginBottom: '1rem' }}
      />
    </Box>
  );
};

export default SaleItemsTable;
