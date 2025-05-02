
import { SidebarItemProps } from '@/types/global';

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
export const filterOptions = (input: string, option?: { title: string; children: string }): boolean => {
  if (!option) return false;
  
  const titleMatch = option.title?.toLowerCase().includes(input.toLowerCase());
  const childrenMatch = option.children?.toString().toLowerCase().includes(input.toLowerCase());
  
  return titleMatch || childrenMatch;
};
