
import { FormInstance, notification } from 'antd';
import { SaleProps } from '@/services/sales/sales';
import { createSale } from '@/services/sales/sales.request';
import { SaleItemProps, TextItemProps } from './types';

export const useSaveForm = (
  form: FormInstance,
  items: SaleItemProps[],
  textItems: TextItemProps[],
  total: number,
  tax: number,
  data: SaleProps | null,
  onClose: () => void,
  onSuccess?: () => void,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const handleSave = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      if (items.length === 0) {
        notification.error({
          message: 'Error',
          description: 'Debe agregar al menos un producto a la venta'
        });
        return;
      }

      if (setLoading) setLoading(true);

      const saleCode = data?.saleCode || `OC-GRU-${String(Date.now()).slice(-4)}`;
      
      const saleData: Omit<SaleProps, 'id'> = {
        saleNumber: data?.saleNumber || `V-${Date.now()}`,
        saleCode,
        client: values.client,
        clientRuc: values.clientRuc,
        date: values.date.format('YYYY-MM-DD'),
        formalDate: values.formalDate ? values.formalDate.format('YYYY-MM-DD') : undefined,
        paymentMethod: values.paymentMethod,
        status: values.status,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })),
        total,
        tax,
        companyName: values.companyName,
        companyRuc: values.companyRuc,
        contact: values.contact,
        catalog: values.catalog,
        deliveryDate: values.deliveryDate ? values.deliveryDate.format('YYYY-MM-DD') : undefined,
        observations: values.observations + 
          (textItems.length > 0 ? `\n\nNotas adicionales:\n${textItems.map(item => `- ${item.text}`).join('\n')}` : '')
      };

      await createSale(saleData);
      
      notification.success({
        message: 'Éxito',
        description: `La venta ha sido ${data ? 'actualizada' : 'registrada'} correctamente`
      });
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving sale:', error);
      notification.error({
        message: 'Error',
        description: `No se pudo ${data ? 'actualizar' : 'registrar'} la venta`
      });
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  return { handleSave };
};
