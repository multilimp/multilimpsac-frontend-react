
import { useState, useEffect } from 'react';
import { Form } from 'antd';
import { SaleProps } from '@/services/sales/sales';
import { ClientProps } from '@/services/clients/client';
import { ProductProps } from '@/services/products/product';
import { getClients } from '@/services/clients/client.requests';
import { getProducts } from '@/services/products/product.requests';
import { notification } from 'antd';
import { createSale } from '@/services/sales/sales.request';
import dayjs from 'dayjs';

export interface SaleItemProps {
  key: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface TextItemProps {
  key: string;
  text: string;
}

export const useSalesModal = (
  data: SaleProps | null, 
  onClose: () => void, 
  onSuccess?: () => void,
  initialData?: Partial<SaleProps>
) => {
  const [form] = Form.useForm();
  const [items, setItems] = useState<SaleItemProps[]>([]);
  const [textItems, setTextItems] = useState<TextItemProps[]>([]);
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
        
        // Ensure both are arrays
        setClients(Array.isArray(clientsData) ? clientsData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
        
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
        } else if (initialData) {
          // Populate form with OCR-extracted data
          form.setFieldsValue({
            client: initialData.client,
            clientRuc: initialData.clientRuc,
            companyName: initialData.companyName,
            companyRuc: initialData.companyRuc,
            contact: initialData.contact,
            // Default values for other fields
            date: dayjs(),
            paymentMethod: 'credit',
            status: 'pending'
          });

          // Populate items table with OCR-extracted items
          if (initialData.items) {
            const itemsWithDetails = initialData.items.map((item, index) => {
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
  }, [data, form, initialData]);

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
  
  const handleAddTextItem = (text: string) => {
    const newTextItem: TextItemProps = {
      key: Date.now().toString(),
      text
    };
    setTextItems([...textItems, newTextItem]);
  };
  
  const handleDeleteTextItem = (key: string) => {
    setTextItems(textItems.filter(item => item.key !== key));
  };
  
  const handleCopyTextItem = (text: string) => {
    navigator.clipboard.writeText(text);
    notification.info({
      message: 'Copiado',
      description: 'Texto copiado al portapapeles',
    });
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
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
        observations: values.observations + 
          (textItems.length > 0 ? `\n\nNotas adicionales:\n${textItems.map(item => `- ${item.text}`).join('\n')}` : '')
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

  return {
    form,
    items,
    textItems,
    clients,
    products,
    selectedProduct,
    setSelectedProduct,
    loading,
    total,
    tax,
    tabValue,
    handleAddItem,
    handleQuantityChange,
    handleDeleteItem,
    handleAddTextItem,
    handleDeleteTextItem,
    handleCopyTextItem,
    handleTabChange,
    handleSave
  };
};
