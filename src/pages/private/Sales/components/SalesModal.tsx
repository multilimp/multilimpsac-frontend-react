
import { useState, useEffect } from 'react';
import { SaleProps } from '@/services/sales/sales';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography, IconButton } from '@mui/material';
import { Grid as MuiGrid } from '@mui/material';
import { DatePicker, Select, Table, InputNumber, Form, notification } from 'antd';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { formatCurrency } from '@/utils/functions';
import { getClients } from '@/services/clients/client.requests';
import { getProducts } from '@/services/products/product.requests';
import { ClientProps } from '@/services/clients/client';
import { ProductProps } from '@/services/products/product';
import { createSale } from '@/services/sales/sales.request';
import dayjs from 'dayjs';

interface SalesModalProps {
  data: SaleProps | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface SaleItemProps {
  key: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

const paymentMethods = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'credit', label: 'Crédito' },
  { value: 'transfer', label: 'Transferencia' }
];

const statusOptions = [
  { value: 'completed', label: 'Completado' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'refunded', label: 'Reembolsado' }
];

const SalesModal = ({ data, open, onClose, onSuccess }: SalesModalProps) => {
  const [form] = Form.useForm();
  const [items, setItems] = useState<SaleItemProps[]>([]);
  const [clients, setClients] = useState<ClientProps[]>([]);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [tax, setTax] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const clientsData = await getClients();
        const productsData = await getProducts();
        
        setClients(clientsData);
        setProducts(productsData);
        
        if (data) {
          // Populate form with existing data
          form.setFieldsValue({
            client: data.client,
            date: dayjs(data.date),
            paymentMethod: data.paymentMethod,
            status: data.status
          });

          // Populate items table
          if (data.items) {
            const itemsWithDetails = data.items.map((item, index) => {
              const product = productsData.find(p => p.id === item.productId);
              return {
                key: index.toString(),
                productId: item.productId,
                productName: product?.name || 'Producto no encontrado',
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                subtotal: item.quantity * item.unitPrice
              };
            });
            setItems(itemsWithDetails);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        notification.error({
          message: 'Error',
          description: 'No se pudieron cargar los datos necesarios'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [data, form]);

  // Recalculate total when items change
  useEffect(() => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const calculatedTax = subtotal * 0.18; // 18% IGV
    setTax(calculatedTax);
    setTotal(subtotal + calculatedTax);
  }, [items]);

  const handleAddItem = () => {
    if (!selectedProduct) return;
    
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const newItem: SaleItemProps = {
      key: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      quantity: 1,
      unitPrice: product.price,
      subtotal: product.price
    };

    setItems([...items, newItem]);
    setSelectedProduct(null);
  };

  const handleQuantityChange = (value: number | null, key: string) => {
    if (value === null) return;

    setItems(prevItems => prevItems.map(item => {
      if (item.key === key) {
        const subtotal = value * item.unitPrice;
        return { ...item, quantity: value, subtotal };
      }
      return item;
    }));
  };

  const handleDeleteItem = (key: string) => {
    setItems(items.filter(item => item.key !== key));
  };

  const handleSave = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      if (items.length === 0) {
        notification.error({
          message: 'Error',
          description: 'Debe agregar al menos un producto a la venta'
        });
        return;
      }

      setLoading(true);

      const saleData: Omit<SaleProps, 'id'> = {
        saleNumber: data?.saleNumber || `V-${Date.now()}`,
        client: values.client,
        date: values.date.format('YYYY-MM-DD'),
        paymentMethod: values.paymentMethod,
        status: values.status,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })),
        total,
        tax
      };

      await createSale(saleData);
      
      notification.success({
        message: 'Éxito',
        description: `La venta ha sido ${data ? 'actualizada' : 'registrada'} correctamente`
      });
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving sale:', error);
      notification.error({
        message: 'Error',
        description: `No se pudo ${data ? 'actualizar' : 'registrar'} la venta`
      });
    } finally {
      setLoading(false);
    }
  };

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
      render: (value: number, record: SaleItemProps) => (
        <InputNumber
          min={1}
          value={value}
          onChange={(val) => handleQuantityChange(val, record.key)}
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
      render: (_: any, record: SaleItemProps) => (
        <IconButton color="error" size="small" onClick={() => handleDeleteItem(record.key)}>
          <DeleteIcon />
        </IconButton>
      )
    }
  ];

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>{data ? 'Editar' : 'Registrar'} venta</DialogTitle>
      <DialogContent>
        <Form form={form} layout="vertical" style={{ marginTop: '1rem' }}>
          <MuiGrid container spacing={2}>
            <MuiGrid item xs={12} md={6}>
              <Form.Item
                name="client"
                label="Cliente"
                rules={[{ required: true, message: 'Seleccione un cliente' }]}
              >
                <Select
                  placeholder="Seleccione un cliente"
                  loading={loading}
                  style={{ width: '100%' }}
                  showSearch
                  optionFilterProp="children"
                  options={clients.map(client => ({
                    value: client.razon_social,
                    label: `${client.razon_social} (${client.ruc})`
                  }))}
                />
              </Form.Item>
            </MuiGrid>
            
            <MuiGrid item xs={12} md={6}>
              <Form.Item
                name="date"
                label="Fecha"
                rules={[{ required: true, message: 'Seleccione una fecha' }]}
                initialValue={dayjs()}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </MuiGrid>

            <MuiGrid item xs={12} md={6}>
              <Form.Item
                name="paymentMethod"
                label="Método de Pago"
                rules={[{ required: true, message: 'Seleccione el método de pago' }]}
              >
                <Select
                  placeholder="Seleccione método de pago"
                  style={{ width: '100%' }}
                  options={paymentMethods}
                />
              </Form.Item>
            </MuiGrid>

            <MuiGrid item xs={12} md={6}>
              <Form.Item
                name="status"
                label="Estado"
                rules={[{ required: true, message: 'Seleccione el estado' }]}
                initialValue="completed"
              >
                <Select
                  placeholder="Seleccione el estado"
                  style={{ width: '100%' }}
                  options={statusOptions}
                />
              </Form.Item>
            </MuiGrid>

            <MuiGrid item xs={12}>
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
                  onClick={handleAddItem}
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
              
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Typography variant="body1">
                  Subtotal: {formatCurrency(total - tax)}
                </Typography>
                <Typography variant="body1">
                  IGV (18%): {formatCurrency(tax)}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total: {formatCurrency(total)}
                </Typography>
              </Box>
            </MuiGrid>
          </MuiGrid>
        </Form>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSave}
          disabled={loading || items.length === 0}
        >
          {loading ? 'Guardando...' : `Guardar${data ? ' cambios' : ''}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SalesModal;
