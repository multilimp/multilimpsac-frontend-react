
import { useState } from 'react';
import { ProductProps } from '@/services/products/product';
import { notification } from 'antd';
import { SaleItemProps, TextItemProps } from './types';

export const useItemsManagement = (
  items: SaleItemProps[],
  setItems: React.Dispatch<React.SetStateAction<SaleItemProps[]>>,
  products: ProductProps[]
) => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [textItems, setTextItems] = useState<TextItemProps[]>([]);
  
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

  return {
    selectedProduct,
    setSelectedProduct,
    textItems,
    handleAddItem,
    handleQuantityChange,
    handleDeleteItem,
    handleAddTextItem,
    handleDeleteTextItem,
    handleCopyTextItem
  };
};
