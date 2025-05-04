
import { DefaultOptionType } from 'antd/es/select';

export const isNavItemActive = ({ path, pathname = '' }: { path: string; pathname?: string }): boolean =>
  path === pathname || Boolean(path !== '/' && pathname.startsWith(path));

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(value);
};

// Filter function for Select components that enables searching by text
export const filterOptions = (input: string, option?: DefaultOptionType): boolean => {
  if (!option) return false;
  
  const label = option.label?.toString().toLowerCase();
  const value = option.value?.toString().toLowerCase();
  
  return !!(label && label.includes(input.toLowerCase())) || 
         !!(value && value.includes(input.toLowerCase()));
};
