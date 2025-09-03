import apiClient from '../apiClient';
import html2pdf from 'html2pdf.js';

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

export interface CargosEntregaData {
  fechaInicio: string;
  fechaFin: string;
  fechaGeneracion: string;
  fechasConCargos: Array<{
    fecha: string;
    ops: Array<{
      id: number;
      numero: number;
      codigoOp: string;
      ocf: string | null;
      estadoOp: string | null;
      fechaProgramada: string | null;
      productos: Array<{
        codigo: string;
        descripcion: string;
        cantidad: number;
      }>;
      proveedor: {
        razonSocial: string;
        contacto?: {
          nombre: string;
          telefono: string;
          cargo?: string;
        };
      };
      transporteAsignado?: {
        transporte: {
          razonSocial: string;
          ruc: string;
          direccion?: string;
          telefono?: string;
        };
        contactoTransporte?: {
          nombre: string;
          telefono: string;
          cargo?: string;
        };
        codigoTransporte: string;
        direccion?: string;
        montoFlete?: number;
        notaTransporte?: string;
        almacen?: {
          nombre: string;
          direccion?: string;
        };
      };
      destino: {
        tipo: string;
        cliente?: {
          razonSocial: string;
        };
        direccion: string;
        distrito: string;
        provincia: string;
        departamento: string;
        referencia?: string;
        contacto?: {
          nombre: string;
          telefono: string;
          cargo?: string;
        };
      };
      observacion?: string;
    }>;
  }>;
  totalOps: number;
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

export const printCargosEntrega = async (fechaInicio: string, fechaFin: string): Promise<void> => {
  try {
    // Obtener datos del backend
    const response = await apiClient.get(`/print/cargos-entrega/data`, {
      params: { fechaInicio, fechaFin }
    });

    const data: CargosEntregaData = response.data.data;

    // Función auxiliar para formatear moneda
    const formatCurrency = (value: any): string => {
      if (typeof value === 'number') {
        return 'S/ ' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      return value || '';
    };

    // Función auxiliar para escapar HTML
    const escapeHtml = (text: string): string => {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };

    // Función para generar HTML de productos
    const generateProductosHtml = (productos: any[]): string => {
      if (!productos || productos.length === 0) return '';

      return `
        <table class="tabla-productos">
          <thead>
            <tr>
              <th class="col-producto">PRODUCTO</th>
              <th class="col-descripcion">DESCRIPCIÓN</th>
              <th class="col-cantidad">CANTIDAD</th>
            </tr>
          </thead>
          <tbody>
            ${productos.map(producto => `
              <tr>
                <td class="producto-codigo">${escapeHtml(producto.codigo || '')}</td>
                <td class="producto-descripcion">${escapeHtml(producto.descripcion || '')}</td>
                <td class="producto-cantidad">${producto.cantidad || 0}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    };

    // Función para generar HTML de proveedor
    const generateProveedorHtml = (proveedor: any): string => {
      if (!proveedor) return '';

      return `
        <table class="info-proveedor">
          <tr>
            <td class="label-proveedor">PROVEEDOR</td>
            <td class="data-proveedor">${escapeHtml(proveedor.razonSocial || '')}</td>
          </tr>
          ${proveedor.contacto ? `
          <tr>
            <td class="label-ventas">CONTACTO:</td>
            <td class="data-ventas">${escapeHtml(proveedor.contacto.nombre || '')} ${proveedor.contacto.telefono ? `TELÉFONO: ${escapeHtml(proveedor.contacto.telefono)}` : ''}</td>
          </tr>
          ` : ''}
        </table>
      `;
    };

    // Función para generar HTML de destino
    const generateDestinoHtml = (destino: any): string => {
      if (!destino) return '';

      return `
        <table class="info-destino">
          <tr>
            <td class="label-destino">DESTINO ${destino.tipo || ''}</td>
            <td class="data-destino"></td>
          </tr>
          ${destino.cliente ? `
          <tr>
            <td class="label-cliente">Cliente</td>
            <td class="data-cliente">${escapeHtml(destino.cliente.razonSocial || '')}</td>
          </tr>
          ` : ''}
          ${destino.direccion ? `
          <tr>
            <td class="label-direccion">DESTINO:</td>
            <td class="data-direccion">${escapeHtml(destino.direccion)}</td>
          </tr>
          ` : ''}
          ${destino.referencia ? `
          <tr>
            <td class="label-referencia">REFERENCIA:</td>
            <td class="data-referencia">${escapeHtml(destino.referencia)}</td>
          </tr>
          ` : ''}
          ${destino.contacto ? `
          <tr>
            <td class="label-jefe">JEFE DE ALMACÉN:</td>
            <td class="data-jefe">${escapeHtml(destino.contacto.nombre || '')}</td>
          </tr>
          ` : ''}
          ${destino.telefono ? `
          <tr>
            <td class="label-telefono">TELÉFONO:</td>
            <td class="data-telefono">${escapeHtml(destino.telefono)}</td>
          </tr>
          ` : ''}
        </table>
      `;
    };

    // Función para generar HTML de observación
    const generateObservacionHtml = (observacion: string): string => {
      if (!observacion) return '';

      return `
        <table class="info-observacion">
          <tr>
            <td class="label-observacion">OBSERVACIÓN</td>
            <td class="data-observacion">${escapeHtml(observacion)}</td>
          </tr>
        </table>
      `;
    };

    // Generar HTML completo
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Cargos de Entrega - ${data.fechaInicio} al ${data.fechaFin}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 12pt;
            line-height: 1.4;
            color: #000;
            background: white;
            padding: 20px;
        }

        @media print {
            body {
                padding: 10px;
                font-size: 10pt;
            }
            
            .fecha-seccion {
                page-break-before: auto;
                page-break-after: auto;
                page-break-inside: avoid;
            }
            
            .op-container {
                page-break-inside: avoid;
                margin-bottom: 15px;
            }
            
            .fecha-titulo {
                page-break-after: avoid;
            }
        }

        .contenedor {
            max-width: 100%;
            margin: 0 auto;
            padding: 20px;
        }

        @media print {
            .contenedor {
                padding: 0;
            }
        }

        .fecha-seccion {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }

        .fecha-titulo {
            font-size: 16pt;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
            padding: 10px;
            background: #007acc;
            color: white;
            border: 2px solid #005999;
        }

        .op-container {
            border: 3px solid green;
            margin-bottom: 20px;
            page-break-inside: avoid;
            background: #f0f8f0;
            padding: 15px;
        }

        .op-header {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        .op-header td {
            border: 1px solid #000;
            padding: 8px;
            vertical-align: top;
        }

        .op-numero {
            background: #333 !important;
            color: white !important;
            font-weight: bold;
            width: 50px;
            text-align: center;
        }

        .op-codigo {
            background: #f0f0f0;
            font-weight: bold;
        }

        .ocf-text {
            font-size: 10pt;
            color: #666;
        }

        .tabla-productos {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            border: 2px solid #333;
        }

        .tabla-productos th {
            background: #333 !important;
            color: white !important;
            padding: 8px;
            text-align: left;
            border: 1px solid #000;
        }

        .tabla-productos td {
            border: 1px solid #000;
            padding: 8px;
            vertical-align: top;
        }

        .info-proveedor {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid orange;
            margin-top: 10px;
            background: #fff8e1;
        }

        .info-proveedor td {
            border: 1px solid #000;
            padding: 6px 8px;
            vertical-align: top;
        }

        .label-proveedor {
            background: #333 !important;
            color: white !important;
            font-weight: bold;
            width: 150px;
            text-align: left;
        }

        .info-destino {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid blue;
            margin-top: 10px;
            background: #e1f5fe;
        }

        .info-destino td {
            border: 1px solid #000;
            padding: 6px 8px;
            vertical-align: top;
        }

        .label-destino {
            background: #333 !important;
            color: white !important;
            font-weight: bold;
            width: 150px;
            text-align: left;
        }

        .info-observacion {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid red;
            margin-top: 10px;
            background: #ffebee;
        }

        .info-observacion td {
            border: 1px solid #000;
            padding: 6px 8px;
            vertical-align: top;
        }

        .label-observacion {
            background: #333 !important;
            color: white !important;
            font-weight: bold;
            width: 150px;
            text-align: left;
        }

        .sin-datos {
            text-align: center;
            padding: 50px;
            border: 2px solid #ccc;
            background: #f9f9f9;
        }

        .sin-datos h3 {
            color: #666;
            margin-bottom: 10px;
        }

        .sin-datos p {
            color: #999;
        }

        .header-info {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            border: 2px solid #333;
            background: #f5f5f5;
        }

        .header-info h1 {
            font-size: 18pt;
            margin-bottom: 10px;
        }

        .header-info p {
            font-size: 12pt;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="contenedor">
        <div class="header-info">
            <h1>REPORTE DE CARGOS DE ENTREGA</h1>
            <p><strong>Período:</strong> ${data.fechaInicio} al ${data.fechaFin}</p>
            <p><strong>Fecha de generación:</strong> ${data.fechaGeneracion}</p>
            <p><strong>Total de OPs:</strong> ${data.totalOps}</p>
        </div>
        
        ${data.fechasConCargos && data.fechasConCargos.length > 0 ?
        data.fechasConCargos.map(fechaData => `
            <div class="fecha-seccion">
                <h2 class="fecha-titulo">Fecha de Programación: ${escapeHtml(fechaData.fecha)}</h2>
                ${fechaData.ops.map((op, index) => `
                    <div class="op-container">
                        <table class="op-header">
                            <tr>
                                <td class="op-numero">${index + 1}</td>
                                <td class="op-codigo">${escapeHtml(op.codigoOp)}${op.ocf ? `<br><span class="ocf-text">OCF: ${escapeHtml(op.ocf)}</span>` : ''}</td>
                            </tr>
                        </table>

                        ${generateProductosHtml(op.productos)}
                        ${generateProveedorHtml(op.proveedor)}
                        ${generateDestinoHtml(op.destino)}
                        ${generateObservacionHtml(op.observacion || '')}
                    </div>
                `).join('')}
            </div>
          `).join('') :
        `<div class="sin-datos">
            <h3>No se encontraron datos</h3>
            <p>No hay órdenes de proveedor para el período seleccionado</p>
          </div>`
      }
    </div>
<script>
  // Auto-imprimir cuando la página se carga
  window.onload = function() {
    window.print();
    
    // Cerrar la ventana después de imprimir (opcional)
    window.onafterprint = function() {
      window.close();
    };
  }
</script>
</body>
</html>`;

    // Abrir una nueva ventana con el contenido HTML para imprimir
    const printWindow = window.open('', '_blank', 'width=800,height=600');

    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();

      // Enfocar la ventana para que aparezca el diálogo de impresión
      printWindow.focus();
    } else {
      // Fallback si no se puede abrir la ventana (bloqueador de popups)
      const blob = new Blob([html], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cargos-entrega-${fechaInicio}-${fechaFin}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      throw new Error('No se pudo abrir la ventana de impresión. Verifica que los popups estén habilitados.');
    }

  } catch (error) {
    console.error('Error al imprimir reporte de cargos de entrega:', error);
    throw new Error('Error al generar el reporte de cargos de entrega');
  }
};

// Función original mantenida para compatibilidad (genera PDF para descarga)
export const generateCargosEntregaPDF = async (fechaInicio: string, fechaFin: string): Promise<void> => {
  try {
    // Obtener datos del backend
    const response = await apiClient.get(`/print/cargos-entrega/data`, {
      params: { fechaInicio, fechaFin }
    });

    const data: CargosEntregaData = response.data.data;

    // Función auxiliar para formatear moneda
    const formatCurrency = (value: any): string => {
      if (typeof value === 'number') {
        return 'S/ ' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      return value || '';
    };

    // Función auxiliar para escapar HTML
    const escapeHtml = (text: string): string => {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };

    // Función para generar HTML de productos
    const generateProductosHtml = (productos: any[]): string => {
      if (!productos || productos.length === 0) return '';

      return `
        <table class="tabla-productos">
          <thead>
            <tr>
              <th class="col-producto">PRODUCTO</th>
              <th class="col-descripcion">DESCRIPCIÓN</th>
              <th class="col-cantidad">CANTIDAD</th>
            </tr>
          </thead>
          <tbody>
            ${productos.map(producto => `
              <tr>
                <td class="producto-codigo">${escapeHtml(producto.codigo || '')}</td>
                <td class="producto-descripcion">${escapeHtml(producto.descripcion || '')}</td>
                <td class="producto-cantidad">${producto.cantidad || 0}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    };

    // Función para generar HTML de proveedor
    const generateProveedorHtml = (proveedor: any): string => {
      if (!proveedor) return '';

      return `
        <table class="info-proveedor">
          <tr>
            <td class="label-proveedor">PROVEEDOR</td>
            <td class="data-proveedor">${escapeHtml(proveedor.razonSocial || '')}</td>
          </tr>
          ${proveedor.contacto ? `
          <tr>
            <td class="label-ventas">CONTACTO:</td>
            <td class="data-ventas">${escapeHtml(proveedor.contacto.nombre || '')} ${proveedor.contacto.telefono ? `TELÉFONO: ${escapeHtml(proveedor.contacto.telefono)}` : ''}</td>
          </tr>
          ` : ''}
        </table>
      `;
    };

    // Función para generar HTML de destino
    const generateDestinoHtml = (destino: any): string => {
      if (!destino) return '';

      return `
        <table class="info-destino">
          <tr>
            <td class="label-destino">DESTINO ${destino.tipo || ''}</td>
            <td class="data-destino"></td>
          </tr>
          ${destino.cliente ? `
          <tr>
            <td class="label-cliente">Cliente</td>
            <td class="data-cliente">${escapeHtml(destino.cliente.razonSocial || '')}</td>
          </tr>
          ` : ''}
          ${destino.direccion ? `
          <tr>
            <td class="label-direccion">DESTINO:</td>
            <td class="data-direccion">${escapeHtml(destino.direccion)}</td>
          </tr>
          ` : ''}
          ${destino.referencia ? `
          <tr>
            <td class="label-referencia">REFERENCIA:</td>
            <td class="data-referencia">${escapeHtml(destino.referencia)}</td>
          </tr>
          ` : ''}
          ${destino.contacto ? `
          <tr>
            <td class="label-jefe">JEFE DE ALMACÉN:</td>
            <td class="data-jefe">${escapeHtml(destino.contacto.nombre || '')}</td>
          </tr>
          ` : ''}
          ${destino.telefono ? `
          <tr>
            <td class="label-telefono">TELÉFONO:</td>
            <td class="data-telefono">${escapeHtml(destino.telefono)}</td>
          </tr>
          ` : ''}
        </table>
      `;
    };

    // Función para generar HTML de observación
    const generateObservacionHtml = (observacion: string): string => {
      if (!observacion) return '';

      return `
        <table class="info-observacion">
          <tr>
            <td class="label-observacion">OBSERVACIÓN</td>
            <td class="data-observacion">${escapeHtml(observacion)}</td>
          </tr>
        </table>
      `;
    };

    // Generar HTML completo
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Cargos de Entrega</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 12pt;
            line-height: 1.4;
            color: #000;
            background: white;
            padding: 20px;
        }

        @media print {
            body {
                padding: 10px;
                font-size: 10pt;
            }
            
            .fecha-seccion {
                page-break-before: auto;
                page-break-after: auto;
                page-break-inside: avoid;
            }
            
            .op-container {
                page-break-inside: avoid;
                margin-bottom: 15px;
            }
            
            .fecha-titulo {
                page-break-after: avoid;
            }
        }

        .contenedor {
            max-width: 100%;
            margin: 0 auto;
            padding: 20px;
        }

        @media print {
            .contenedor {
                padding: 0;
            }
        }

        .fecha-seccion {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }

        .fecha-titulo {
            font-size: 16pt;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
            padding: 10px;
            background: #007acc;
            color: white;
            border: 2px solid #005999;
        }

        .op-container {
            border: 3px solid green;
            margin-bottom: 20px;
            page-break-inside: avoid;
            background: #f0f8f0;
            padding: 15px;
        }

        .op-header {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        .op-header td {
            border: 1px solid #000;
            padding: 8px;
            vertical-align: top;
        }

        .op-numero {
            background: #333 !important;
            color: white !important;
            font-weight: bold;
            width: 50px;
            text-align: center;
        }

        .op-codigo {
            background: #f0f0f0;
            font-weight: bold;
        }

        .ocf-text {
            font-size: 10pt;
            color: #666;
        }

        .tabla-productos {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            border: 2px solid #333;
        }

        .tabla-productos th {
            background: #333 !important;
            color: white !important;
            padding: 8px;
            text-align: left;
            border: 1px solid #000;
        }

        .tabla-productos td {
            border: 1px solid #000;
            padding: 8px;
            vertical-align: top;
        }

        .info-proveedor {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid orange;
            margin-top: 10px;
            background: #fff8e1;
        }

        .info-proveedor td {
            border: 1px solid #000;
            padding: 6px 8px;
            vertical-align: top;
        }

        .label-proveedor {
            background: #333 !important;
            color: white !important;
            font-weight: bold;
            width: 150px;
            text-align: left;
        }

        .info-destino {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid blue;
            margin-top: 10px;
            background: #e1f5fe;
        }

        .info-destino td {
            border: 1px solid #000;
            padding: 6px 8px;
            vertical-align: top;
        }

        .label-destino {
            background: #333 !important;
            color: white !important;
            font-weight: bold;
            width: 150px;
            text-align: left;
        }

        .info-observacion {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid red;
            margin-top: 10px;
            background: #ffebee;
        }

        .info-observacion td {
            border: 1px solid #000;
            padding: 6px 8px;
            vertical-align: top;
        }

        .label-observacion {
            background: #333 !important;
            color: white !important;
            font-weight: bold;
            width: 150px;
            text-align: left;
        }

        .sin-datos {
            text-align: center;
            padding: 50px;
            border: 2px solid #ccc;
            background: #f9f9f9;
        }

        .sin-datos h3 {
            color: #666;
            margin-bottom: 10px;
        }

        .sin-datos p {
            color: #999;
        }
    </style>
</head>
<body>
    <div class="contenedor">
        ${data.fechasConCargos && data.fechasConCargos.length > 0 ?
        data.fechasConCargos.map(fechaData => `
            <div class="fecha-seccion">
                <h2 class="fecha-titulo">Fecha de Programación: ${escapeHtml(fechaData.fecha)}</h2>
                ${fechaData.ops.map((op, index) => `
                    <div class="op-container">
                        <table class="op-header">
                            <tr>
                                <td class="op-numero">${index + 1}</td>
                                <td class="op-codigo">${escapeHtml(op.codigoOp)}${op.ocf ? `<br><span class="ocf-text">OCF: ${escapeHtml(op.ocf)}</span>` : ''}</td>
                            </tr>
                        </table>

                        ${generateProductosHtml(op.productos)}
                        ${generateProveedorHtml(op.proveedor)}
                        ${generateDestinoHtml(op.destino)}
                        ${generateObservacionHtml(op.observacion || '')}
                    </div>
                `).join('')}
            </div>
          `).join('') :
        `<div class="sin-datos">
            <h3>No se encontraron datos</h3>
            <p>No hay órdenes de proveedor para el período seleccionado</p>
          </div>`
      }
    </div>
<script>
  // Auto-imprimir cuando la página se carga
  window.onload = function() {
    window.print();
  }
</script>
</body>
</html>`;

    // Abrir una nueva ventana con el contenido HTML para imprimir
    const printWindow = window.open('', '_blank', 'width=800,height=600');

    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();

      // Enfocar la ventana para que aparezca el diálogo de impresión
      printWindow.focus();
    } else {
      // Fallback si no se puede abrir la ventana (bloqueador de popups)
      const blob = new Blob([html], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cargos-entrega-${fechaInicio}-${fechaFin}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      throw new Error('No se pudo abrir la ventana de impresión. Verifica que los popups estén habilitados.');
    }

  } catch (error) {
    console.error('Error al imprimir reporte de cargos de entrega:', error);
    throw new Error('Error al generar el reporte de cargos de entrega');
  }
};