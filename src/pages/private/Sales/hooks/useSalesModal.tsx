
import { SaleProps } from '@/services/sales/sales';
import { useFormInitialization } from './useFormInitialization';
import { useItemsManagement } from './useItemsManagement';
import { useCalculations } from './useCalculations';
import { useTabs } from './useTabs';
import { useSaveForm } from './useSaveForm';
import { SalesModalContextProps } from './types';

export const useSalesModal = (
  data: SaleProps | null, 
  onClose: () => void, 
  onSuccess?: () => void,
  initialData?: Partial<SaleProps>
): SalesModalContextProps => {
  // Initialize form and fetch data
  const { 
    form, 
    clients, 
    products, 
    items, 
    setItems, 
    loading, 
    setLoading 
  } = useFormInitialization(data, initialData);

  // Manage items and text items
  const { 
    selectedProduct,
    setSelectedProduct,
    textItems,
    handleAddItem,
    handleQuantityChange,
    handleDeleteItem,
    handleAddTextItem,
    handleDeleteTextItem,
    handleCopyTextItem 
  } = useItemsManagement(items, setItems, products);

  // Handle calculations
  const { total, tax } = useCalculations(items);

  // Handle tabs
  const { tabValue, handleTabChange } = useTabs();

  // Handle saving the form
  const { handleSave } = useSaveForm(
    form, 
    items, 
    textItems, 
    total, 
    tax, 
    data, 
    onClose, 
    onSuccess, 
    setLoading
  );

  return {
    form,
    items,
    textItems,
    clients,
    products,
    selectedProduct,
    setSelectedProduct,
    loading,
    total,
    tax,
    tabValue,
    handleAddItem,
    handleQuantityChange,
    handleDeleteItem,
    handleAddTextItem,
    handleDeleteTextItem,
    handleCopyTextItem,
    handleTabChange,
    handleSave
  };
};
