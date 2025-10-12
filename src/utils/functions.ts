import { parseISO, isValid as isValidDate } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

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

export const filterOptions = (inputValue: string, option: { title?: unknown; children?: unknown }) => {
  const titleRaw = (option?.title ?? option?.children);
  const title = removeAccents(String(titleRaw).toLowerCase());
  return title.includes(inputValue.toLowerCase());
};

export const parseJSON = (
  str?: null | string | unknown[] | Record<string, unknown>
): unknown | unknown[] | string => {
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
      return parsed as unknown;
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

// Helper para parsear fechas de forma segura
export const parseDate = (value?: null | Date | string): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return isValidDate(value) ? value : null;
  if (typeof value === 'string') {
    const isoParsed = parseISO(value);
    if (isValidDate(isoParsed)) return isoParsed;
    const nativeParsed = new Date(value);
    return isValidDate(nativeParsed) ? nativeParsed : null;
  }
  return null;
};

// Normaliza tokens de formato tipo Day.js a los de date-fns
const normalizeFormatTokens = (fmt: string): string => {
  return fmt
    .replace(/YYYY/g, 'yyyy')
    .replace(/YY/g, 'yy')
    .replace(/DD/g, 'dd')
    .replace(/d{1}(?!d)/g, 'd') // dia sin cero
    .replace(/HH/g, 'HH')
    .replace(/mm/g, 'mm')
    .replace(/ss/g, 'ss');
};

export const formattedDate = (value?: null | Date | string, format = 'DD/MM/YYYY', defaultText?: string): string => {
  const date = parseDate(value);
  if (!date) return defaultText ?? '';
  const fmt = normalizeFormatTokens(format);
  // Formatear en UTC para evitar desfasajes por zona horaria
  return formatInTimeZone(date, 'UTC', fmt);
};
