import dayjs from 'dayjs';

export const isNavItemActive = ({ path, pathname = '' }: { path: string; pathname?: string }): boolean =>
  path === pathname || Boolean(path !== '/' && pathname.startsWith(path));

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(value);
};

export const removeAccents = (str?: string): string => {
  if (!['number', 'string'].includes(typeof str)) return '';
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export const filterOptions = (inputValue: string, option: any) => {
  const title = removeAccents(String(option?.title ?? option?.children).toLowerCase());
  return title.includes(inputValue.toLowerCase());
};

export const parseJSON = (str?: null | string) => {
  try {
    if (!str) return null;
    return JSON.parse(str);
  } catch (error) {
    return null;
  }
};

export const formattedDate = (value?: null | Date | string, format = 'DD/MM/YYYY'): null | string => {
  if (!value || !dayjs(value).isValid()) return '';
  return dayjs(value).format(format);
};
