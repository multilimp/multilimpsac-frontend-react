import apiClient from '../apiClient';

export interface PrintInvoiceData {
  ordenCompraId: number;
  codigoOp: string;
  facturaData: {
    numeroFactura: string;
    fechaFactura: string;
    grr?: string;
    retencion?: number;
    detraccion?: number;
    formaEnvioFactura?: string;
  };
}

export const printInvoice = async (data: PrintInvoiceData): Promise<any> => {
  try {
    // ✅ CORRECCIÓN: Usar la ruta correcta con el ID de la orden de compra
    const response = await apiClient.post(`/print/factura/${data.ordenCompraId}`, data, {
      responseType: 'blob'
    });
    
    // Crear URL del blob para descarga
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    
    // Crear link temporal para descarga
    const link = document.createElement('a');
    link.href = url;
    link.download = `factura-${data.codigoOp}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpiar URL
    window.URL.revokeObjectURL(url);
    
    return { success: true, message: 'Factura generada y descargada correctamente' };
  } catch (error) {
    console.error('Error al imprimir factura:', error);
    throw new Error('Error al generar la factura');
  }
};

export const generateInvoicePDF = async (ordenCompraId: number, invoiceData: any): Promise<any> => {
  try {
    const response = await apiClient.post(`/print/generar-factura/${ordenCompraId}`, invoiceData, {
      responseType: 'blob'
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al generar PDF de factura:', error);
    throw error;
  }
};

export const printOrdenProveedor = async (ordenProveedorId: number): Promise<any> => {
  try {
    const response = await apiClient.get(`/print/orden-proveedor/${ordenProveedorId}`, {
      responseType: 'blob'
    });
    
    // Crear URL del blob para descarga
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    
    // Crear link temporal para descarga
    const link = document.createElement('a');
    link.href = url;
    link.download = `orden-proveedor-${ordenProveedorId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpiar URL
    window.URL.revokeObjectURL(url);
    
    return { success: true, message: 'Orden de proveedor generada y descargada correctamente' };
  } catch (error) {
    console.error('Error al imprimir orden de proveedor:', error);
    throw new Error('Error al generar la orden de proveedor');
  }
};

export const previewInvoice = async (ordenCompraId: number): Promise<string> => {
  try {
    const response = await apiClient.get(`/print/preview-factura/${ordenCompraId}`);
    return response.data.previewUrl;
  } catch (error) {
    console.error('Error al obtener preview de factura:', error);
    throw error;
  }
}; 