
import { useState, useEffect } from 'react';
import { Form } from 'antd';
import { SaleProps } from '@/services/sales/sales';
import { ClientProps } from '@/services/clients/client';
import { ProductProps } from '@/services/products/product';
import { getClients } from '@/services/clients/client.requests';
import { getProducts } from '@/services/products/product.requests';
import { notification } from 'antd';
import dayjs from 'dayjs';
import { SaleItemProps } from './types';

export const useFormInitialization = (
  data: SaleProps | null,
  initialData?: Partial<SaleProps>
) => {
  const [form] = Form.useForm();
  const [clients, setClients] = useState<ClientProps[]>([]);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [items, setItems] = useState<SaleItemProps[]>([]);
  const [loading, setLoading] = useState(false);

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

  return { form, clients, products, items, setItems, loading, setLoading };
};
