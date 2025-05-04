
import { useState, useEffect } from 'react';
import { SaleProps } from '@/services/sales/sales';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Tab, Tabs, Typography } from '@mui/material';
import { notification } from 'antd';
import { Form } from 'antd';
import { createSale } from '@/services/sales/sales.request';
import { ClientProps } from '@/services/clients/client';
import { ProductProps } from '@/services/products/product';
import { getClients } from '@/services/clients/client.requests';
import { getProducts } from '@/services/products/product.requests';
import SaleFormHeader from './SaleFormHeader';
import SaleItemsTable from './SaleItemsTable';
import SaleTotals from './SaleTotals';
import SaleCompanyInfo from './SaleCompanyInfo';
import SaleAdditionalInfo from './SaleAdditionalInfo';
import dayjs from 'dayjs';
import { Close, Save } from '@mui/icons-material';

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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`sale-tabpanel-${index}`}
      aria-labelledby={`sale-tab-${index}`}
      {...other}
      style={{ padding: '16px 0' }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const SalesModal = ({ data, open, onClose, onSuccess }: SalesModalProps) => {
  const [form] = Form.useForm();
  const [items, setItems] = useState<SaleItemProps[]>([]);
  const [clients, setClients] = useState<ClientProps[]>([]);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [tabValue, setTabValue] = useState(0);

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
            clientRuc: data.clientRuc,
            date: dayjs(data.date),
            formalDate: data.formalDate ? dayjs(data.formalDate) : undefined,
            paymentMethod: data.paymentMethod,
            status: data.status,
            companyName: data.companyName,
            companyRuc: data.companyRuc,
            contact: data.contact,
            catalog: data.catalog,
            deliveryDate: data.deliveryDate ? dayjs(data.deliveryDate) : undefined,
            observations: data.observations
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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

      const saleCode = data?.saleCode || `OC-GRU-${String(Date.now()).slice(-4)}`;
      
      const saleData: Omit<SaleProps, 'id'> = {
        saleNumber: data?.saleNumber || `V-${Date.now()}`,
        saleCode,
        client: values.client,
        clientRuc: values.clientRuc,
        date: values.date.format('YYYY-MM-DD'),
        formalDate: values.formalDate ? values.formalDate.format('YYYY-MM-DD') : undefined,
        paymentMethod: values.paymentMethod,
        status: values.status,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })),
        total,
        tax,
        companyName: values.companyName,
        companyRuc: values.companyRuc,
        contact: values.contact,
        catalog: values.catalog,
        deliveryDate: values.deliveryDate ? values.deliveryDate.format('YYYY-MM-DD') : undefined,
        observations: values.observations
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

  return (
    <Dialog 
      open={open} 
      fullWidth 
      maxWidth="lg" 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" fontWeight={600} color="primary">
            {data ? 'Editar Venta' : 'Registrar Nueva Venta'}
          </Typography>
          <Button variant="text" color="inherit" onClick={onClose} sx={{ minWidth: 'auto', p: 1 }}>
            <Close />
          </Button>
        </Box>
      </DialogTitle>
      <Divider />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="sales form tabs"
          sx={{
            '.MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none'
            }
          }}
        >
          <Tab label="Información Principal" id="sale-tab-0" aria-controls="sale-tabpanel-0" />
          <Tab label="Productos" id="sale-tab-1" aria-controls="sale-tabpanel-1" />
          <Tab label="Información Adicional" id="sale-tab-2" aria-controls="sale-tabpanel-2" />
        </Tabs>
      </Box>
      
      <DialogContent>
        <Form form={form} layout="vertical" style={{ marginTop: '1rem' }}>
          <TabPanel value={tabValue} index={0}>
            <SaleFormHeader clients={clients} />
            <Divider sx={{ my: 2 }} />
            <SaleCompanyInfo />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <SaleItemsTable 
              items={items}
              products={products}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              onAddItem={handleAddItem}
              onQuantityChange={handleQuantityChange}
              onDeleteItem={handleDeleteItem}
            />
            
            <SaleTotals total={total} tax={tax} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <SaleAdditionalInfo />
          </TabPanel>
        </Form>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button 
          variant="outlined" 
          color="inherit" 
          onClick={onClose} 
          disabled={loading}
          startIcon={<Close />}
        >
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSave}
          disabled={loading || items.length === 0}
          startIcon={<Save />}
        >
          {loading ? 'Guardando...' : `${data ? 'Actualizar' : 'Registrar'} Venta`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SalesModal;
