
import { useState, useEffect } from 'react';
import { SaleItemProps } from './types';

export const useCalculations = (items: SaleItemProps[]) => {
  const [total, setTotal] = useState(0);
  const [tax, setTax] = useState(0);

  useEffect(() => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const calculatedTax = subtotal * 0.18; // 18% IGV
    setTax(calculatedTax);
    setTotal(subtotal + calculatedTax);
  }, [items]);

  return { total, tax };
};
