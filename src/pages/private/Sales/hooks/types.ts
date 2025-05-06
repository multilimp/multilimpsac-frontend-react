import { ClientProps } from '@/services/clients/clients';
import { ProductProps } from '@/services/products/product';
import { FormInstance } from 'antd';

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

export interface SalesModalContextProps {
  form: FormInstance;
  items: SaleItemProps[];
  textItems: TextItemProps[];
  clients: ClientProps[];
  products: ProductProps[];
  selectedProduct: string | null;
  setSelectedProduct: (value: string | null) => void;
  loading: boolean;
  total: number;
  tax: number;
  tabValue: number;
  handleAddItem: () => void;
  handleQuantityChange: (value: number | null, key: string) => void;
  handleDeleteItem: (key: string) => void;
  handleAddTextItem: (text: string) => void;
  handleDeleteTextItem: (key: string) => void;
  handleCopyTextItem: (text: string) => void;
  handleTabChange: (_: React.SyntheticEvent, newValue: number) => void;
  handleSave: () => void;
}
