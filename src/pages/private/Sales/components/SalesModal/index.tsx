
import { useState, useEffect } from 'react';
import { SaleProps } from '@/services/sales/sales';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
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

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>{data ? 'Editar' : 'Registrar'} venta</DialogTitle>
      <DialogContent>
        <Form form={form} layout="vertical" style={{ marginTop: '1rem' }}>
          <SaleFormHeader clients={clients} />
          
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
