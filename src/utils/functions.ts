import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const isNavItemActive = ({ path, pathname = '' }: { path: string; pathname?: string }): boolean =>
  path === pathname || Boolean(path !== '/' && pathname.startsWith(path));

export const formatCurrency = (value: number): string => {
  const isNegative = value < 0;
  const absoluteValue = Math.abs(value);

  const formatted = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(absoluteValue);

  // Si es negativo, colocar el signo después del símbolo de moneda
  return isNegative ? formatted.replace('S/', 'S/ -') : formatted;
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

export const parseJSON = (str?: null | string | any[] | object) => {
  try {
    if (Array.isArray(str) || (typeof str === 'object' && str !== null)) return str;

    if (!str || str === '') return [];

    if (typeof str === 'string') {
      // Si no parece ser JSON (no empieza con [ o {), devolver como string simple
      const trimmed = str.trim();
      if (!trimmed.startsWith('[') && !trimmed.startsWith('{')) {
        return str;
      }

      const parsed = JSON.parse(str);
      return parsed;
    }

    return [];
  } catch (error) {
    // Si no se puede parsear, devolver el valor original si es string
    if (typeof str === 'string') {
      return str;
    }
    console.warn('Error parsing JSON:', error, 'Original value:', str);
    return [];
  }
};

export const formattedDate = (value?: null | Date | string, format = 'DD/MM/YYYY', defaultText?: string): string => {
  if (!value) return defaultText ?? '';

  // Si la fecha viene en formato ISO con zona horaria (Z), usar UTC para evitar conversión
  if (typeof value === 'string' && value.includes('T') && value.endsWith('Z')) {
    const utcDate = dayjs.utc(value);
    if (!utcDate.isValid()) return defaultText ?? '';
    return utcDate.format(format);
  }

  // Para fechas sin zona horaria, usar dayjs normal
  const date = dayjs(value);
  if (!date.isValid()) return defaultText ?? '';
  return date.format(format);
};
