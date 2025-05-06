
import apiClient from '../apiClient';
import { ProductProps } from './product';

export const getProducts = async (): Promise<ProductProps[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  try {
    const response = await apiClient.get('/products');
    return Array.isArray(response?.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    // Mock data for development purposes
    return [
      { id: 'P001', name: 'Detergente Industrial', description: 'Detergente para uso industrial', price: 45.90, stock: 100, sku: 'DET-001', category: 'Limpieza' },
      { id: 'P002', name: 'Desinfectante Multisuperficie', description: 'Desinfectante para múltiples superficies', price: 32.50, stock: 150, sku: 'DES-001', category: 'Limpieza' },
      { id: 'P003', name: 'Jabón Líquido', description: 'Jabón líquido para manos', price: 28.90, stock: 200, sku: 'JAB-001', category: 'Higiene' },
      { id: 'P004', name: 'Cera para Pisos', description: 'Cera para pisos de alto tránsito', price: 54.70, stock: 80, sku: 'CER-001', category: 'Mantenimiento' },
      { id: 'P005', name: 'Limpiador de Vidrios', description: 'Limpiador especializado para vidrios', price: 19.90, stock: 120, sku: 'LIM-001', category: 'Limpieza' },
    ];
  }
};

export const getProductById = async (id: string): Promise<ProductProps | null> => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};
