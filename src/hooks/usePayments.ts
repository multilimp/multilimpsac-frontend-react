import { useState, useCallback } from 'react';
import { message } from 'antd';
import { updatePayments, EntityType, PaymentData } from '../services/payments/payments.service';

interface UsePaymentsProps {
  entityType: EntityType;
  entityId: number;
  onSuccess?: () => void;
}

export const usePayments = ({ entityType, entityId, onSuccess }: UsePaymentsProps) => {
  const [loading, setLoading] = useState(false);

  const handlePaymentsUpdate = useCallback(async (
    payments: PaymentData[],
    tipoPago?: string,
    notaPago?: string
  ) => {
    if (!entityId) {
      message.error('ID de entidad requerido');
      return;
    }

    setLoading(true);
    try {
      const formattedPayments = payments.map(payment => ({
        fechaPago: payment.fechaPago,
        bancoPago: payment.bancoPago || '',
        descripcionPago: payment.descripcionPago || '',
        archivoPago: typeof payment.archivoPago === 'string' ? payment.archivoPago : null,
        montoPago: payment.montoPago ? Number(payment.montoPago) : 0,
        estadoPago: payment.estadoPago || false
      }));

      await updatePayments({
        entityType,
        entityId,
        payments: formattedPayments,
        tipoPago,
        notaPago
      });

      message.success('Pagos actualizados correctamente');
      onSuccess?.();
    } catch (error: any) {
      console.error('Error al actualizar pagos:', error);
      message.error(error?.response?.data?.message || 'Error al actualizar pagos');
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId, onSuccess]);

  return {
    loading,
    handlePaymentsUpdate
  };
};
