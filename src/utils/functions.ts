
import { SidebarItemProps } from '@/types/global';
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
// Updated to be compatible with Ant Design's FilterFunc type
export const filterOptions = (input: string, option?: DefaultOptionType): boolean => {
  if (!option) return false;
  
  // Using any here because DefaultOptionType doesn't explicitly have title or children properties
  const optionData = option as any;
  const titleMatch = optionData.title?.toLowerCase().includes(input.toLowerCase());
  const childrenMatch = typeof optionData.children === 'string' && 
    optionData.children.toLowerCase().includes(input.toLowerCase());
  
  return !!titleMatch || !!childrenMatch;
};
