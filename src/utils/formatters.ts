
/**
 * Utility functions for formatting data in the UI
 */

export const formatDate = (date: string | Date | undefined): string => {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatCurrency = (amount: number | undefined): string => {
  if (amount === undefined || amount === null) return '-';
  
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatNumber = (number: number | undefined, decimals = 2): string => {
  if (number === undefined || number === null) return '-';
  
  return new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

export const formatPercentage = (value: number | undefined): string => {
  if (value === undefined || value === null) return '-';
  
  return new Intl.NumberFormat('es-PE', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
};

export const formatPhone = (phone: string | undefined): string => {
  if (!phone) return '-';
  
  // Basic formatting for Peruvian phone numbers
  if (phone.length === 9) {
    return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
  }
  
  return phone;
};

export const truncateText = (text: string | undefined, maxLength = 50): string => {
  if (!text) return '-';
  if (text.length <= maxLength) return text;
  
  return `${text.slice(0, maxLength)}...`;
};
