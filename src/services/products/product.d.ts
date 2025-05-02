
export interface ProductProps {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku?: string;
  category?: string;
  imageUrl?: string;
}
