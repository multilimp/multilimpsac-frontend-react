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

export const printOrdenProveedor = async (orderData: any): Promise<void> => {
  try {
    const data = orderData;

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

    // Función para formatear fecha
    const formatDate = (dateString: string): string => {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('es-ES');
    };

    // Generar HTML de productos
    const generateProductosHtml = (productos: any[]): string => {
      if (!productos || productos.length === 0) return '';

      return `
        <table class="tabla-productos">
          <thead>
            <tr>
              <th class="col-codigo">CÓDIGO</th>
              <th class="col-descripcion">DESCRIPCIÓN</th>
              <th class="col-unidad">UNIDAD</th>
              <th class="col-cantidad">CANTIDAD</th>
              <th class="col-precio">PRECIO UNIT.</th>
              <th class="col-total">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${productos.map(producto => `
              <tr>
                <td class="col-codigo">${escapeHtml(producto.codigo || '')}</td>
                <td class="col-descripcion">${escapeHtml(producto.descripcion || '')}</td>
                <td class="col-unidad">${escapeHtml(producto.unidadMedida || '')}</td>
                <td class="col-cantidad">${producto.cantidad || 0}</td>
                <td class="col-precio">${formatCurrency(producto.precioUnitario)}</td>
                <td class="col-total">${formatCurrency(producto.total)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    };

    // Generar HTML de transportes
    const generateTransportesHtml = (transportes: any[], fechaRecepcion?: string): string => {
      if (!transportes || transportes.length === 0) return '';

      const tituloTransportes = fechaRecepcion
        ? `TRANSPORTES ASIGNADOS - PLAZO DE ENTREGA: ${formatDate(fechaRecepcion)}`
        : 'TRANSPORTES ASIGNADOS';

      return `
        <div class="transportes-card">
          <h3>${tituloTransportes}</h3>
          ${transportes.map(transporte => `
            <div class="transporte-item">
              <h4>${escapeHtml(transporte.transporte?.razonSocial || '')} - ${escapeHtml(transporte.transporte?.ruc || '')}</h4>
              <p><strong>Dirección:</strong> ${escapeHtml(transporte.transporte?.direccion || '')}</p>
              <p><strong>Destino:</strong> ${escapeHtml(transporte.direccion || '')}</p>
              <p><strong>Etiquetado:</strong> ${escapeHtml(transporte.etiquetado || 'No especificado')}</p>
              <p><strong>Embalaje:</strong> ${escapeHtml(transporte.embalaje || 'No especificado')}</p>
              <p><strong>Observaciones:</strong> ${escapeHtml(transporte.notaTransporte || 'Sin observaciones')}</p>
              ${transporte.otros ? `<p><strong>Otros:</strong> ${escapeHtml(transporte.otros)}</p>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    };

    // Generar HTML completo
    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Orden de Proveedor - ${data.codigoOp || data.id}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            font-size: 10px;
            line-height: 1.3;
            margin: 0;
            padding: 8px;
            color: #333;
            background: #fff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
            border-bottom: 1px solid #000;
            padding-bottom: 10px;
            background: white;
            padding: 8px;
          }

          .header-left {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }

          .logo {
            width: 200px;
            height: auto;
            max-height: 80px;
            margin-bottom: 5px;
            border: 1px solid #e0e0e0;
            border-radius: 2px;
            padding: 5px;
            background: white;
            object-fit: contain;
          }

          .contact-info {
            font-size: 8px;
            color: #666;
            line-height: 1.2;
            margin-top: 3px;
          }

          .header-right {
            text-align: right;
          }

          .info-box {
            border: 2px solid #000;
            background: white;
            display: flex;
            flex-direction: column;
            min-width: 250px;
            border-radius: 5px;
          }

          .info-box-row {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 8px;
            border-bottom: 1px solid #000;
          }

          .info-box-row:last-child {
            border-bottom: none;
          }

          .info-box-row h2 {
            margin: 0;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
          }

          .info-box-row .codigo-oc {
            margin: 0;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
          }

          .info-box-row-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 10px;
          }

          .info-box-row-bottom p {
            margin: 0;
            font-size: 10px;
            font-weight: normal;
          }

          .info-box-row-bottom .ruc-text {
            font-weight: bold;
          }

          .provider-card, .products-card, .transportes-card, .facturacion-card {
            border: 1px solid #000;
            padding: 8px;
            margin-bottom: 8px;
            background: white;
            border-radius: 5px;
          }

          .products-card, .transportes-card {
            border: none;
            padding: 0;
            margin-bottom: 8px;
          }

          .provider-card h3, .transportes-card h3, .facturacion-card h3 {
            margin: 0 0 6px 0;
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            border-bottom: 1px solid #000;
            padding-bottom: 4px;
          }

          .provider-card p {
            margin: 2px 0;
            font-size: 10px;
          }

          .transportes-card h3 {
            margin: 0 0 6px 0;
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            padding-bottom: 4px;
          }

          .products-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8px;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #000;
          }

          .products-table th, .products-table td {
            border: 1px solid #000;
            padding: 3px 2px;
            text-align: left;
          }

          .products-table th.titulo-productos {
            background: white;
            color: black;
            font-weight: bold;
            font-size: 12px;
            text-align: center;
            padding: 6px 4px;
            border-bottom: 1px solid #000;
          }

          .products-table th {
            background: white;
            color: black;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 7px;
            text-align: center;
            border-bottom: 2px solid #000;
          }

          .products-table .col-codigo { width: 80px; text-align: center; }
          .products-table .col-cantidad { width: 70px; text-align: center; }
          .products-table .col-unidad { width: 80px; text-align: center; }
          .products-table .col-descripcion { width: auto; }
          .products-table .col-precio { width: 80px; text-align: right; }
          .products-table .col-importe { width: 80px; text-align: right; }

          .total-row {
            font-weight: bold;
            background: white;
            border-top: 1px solid #000;
          }

          .total-row td {
            padding: 8px 4px;
            font-size: 11px;
          }

          .transportes-card {
            border: 1px solid #000;
            padding: 5px;
            margin-bottom: 8px;
            background: #fff;
          }

          .transportes-card h3 {
            margin: 0 0 5px 0;
            font-size: 12px;
            font-weight: bold;
            text-align: center;
          }

          .transporte-item {
            border: 1px solid #000;
            padding: 6px;
            margin-bottom: 5px;
            background: white;
            border-radius: 5px;
          }

          .transporte-item h4 {
            margin: 0 0 4px 0;
            font-size: 10px;
            font-weight: bold;
            border-bottom: 1px solid #000;
            padding-bottom: 2px;
          }

          .transporte-item p {
            margin: 2px 0;
            font-size: 8px;
            line-height: 1.2;
          }

          .facturacion-card {
            border: 1px solid #000;
            padding: 5px;
            margin-bottom: 8px;
            background: #fff;
          }

          .facturacion-card h3 {
            margin: 0 0 4px 0;
            font-size: 12px;
            font-weight: bold;
            text-align: center;
          }

          .facturacion-card p {
            margin: 2px 0;
            font-size: 10px;
          }

          .info-section {
            margin-bottom: 10px;
          }

          .info-section h2 {
            margin: 0 0 5px 0;
            font-size: 12px;
            font-weight: bold;
            border-bottom: 1px solid #000;
            padding-bottom: 5px;
          }

          .info-grid {
            display: table;
            width: 100%;
            margin-bottom: 10px;
          }

          .info-row {
            display: table-row;
          }

          .info-label {
            display: table-cell;
            width: 150px;
            font-weight: bold;
            padding: 2px 0;
          }

          .info-value {
            display: table-cell;
            padding: 2px 0;
          }

          .tabla-productos, .tabla-transportes {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            font-size: 11px;
          }

          .tabla-productos th, .tabla-productos td,
          .tabla-transportes th, .tabla-transportes td {
            border: 1px solid #000;
            padding: 4px;
            text-align: left;
          }

          .tabla-productos th, .tabla-transportes th {
            background: #f0f0f0;
            font-weight: bold;
          }

          .col-codigo { width: 80px; }
          .col-descripcion { width: auto; }
          .col-unidad { width: 60px; }
          .col-cantidad { width: 70px; text-align: center; }
          .col-precio { width: 80px; text-align: right; }
          .col-total { width: 80px; text-align: right; }

          .col-transporte { width: 200px; }
          .col-ruc { width: 100px; }
          .col-telefono { width: 100px; }
          .col-direccion { width: auto; }

          .seccion-transportes {
            margin-top: 30px;
          }

          .seccion-transportes h3 {
            margin: 0 0 10px 0;
            font-size: 14px;
            font-weight: bold;
          }

          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 10px;
            color: #666;
          }

          @media print {
            body { margin: 0; }
            .no-print { display: none; }
            .header, .provider-card, .products-card, .transportes-card, .facturacion-card, .info-section {
              break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-left">
            ${data.empresa?.logo ? `<img src="${data.empresa.logo}" alt="Logo Empresa" class="logo">` : ''}
            <div class="contact-info">
              ${data.empresa?.direccion ? `Dirección: ${escapeHtml(data.empresa.direccion)}<br>` : ''}
              ${[data.empresa?.distrito, data.empresa?.provincia, data.empresa?.departamento].filter(Boolean).length > 0 ? `${[data.empresa?.distrito, data.empresa?.provincia, data.empresa?.departamento].filter(Boolean).join(' - ')}<br>` : ''}
              ${data.empresa?.telefono ? `Tel: ${escapeHtml(data.empresa.telefono)}<br>` : ''}
              ${data.empresa?.email ? `Email: ${escapeHtml(data.empresa.email)}<br>` : ''}
              ${data.empresa?.web ? `Web: ${escapeHtml(data.empresa.web)}` : ''}
            </div>
          </div>
          <div class="header-right">
            <div class="info-box">
              <div class="info-box-row">
                <h2>ORDEN DE COMPRA</h2>
              </div>
              <div class="info-box-row">
                <p class="codigo-oc">${data.codigoOp || data.id}</p>
              </div>
              <div class="info-box-row-bottom">
                <p>Fecha Emisión: ${formatDate(data.fechaEmision || data.createdAt)}</p>
                <p class="ruc-text">RUC: ${escapeHtml(data.empresa?.ruc || '')}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="provider-card">
          <h3>PROVEEDOR</h3>
          <p><strong>Sres:</strong> ${escapeHtml(data.proveedor?.razonSocial || '')}</p>
          <p><strong>RUC:</strong> ${escapeHtml(data.proveedor?.ruc || '')}</p>
        </div>

        <div class="products-card">
          <table class="products-table">
            <thead>
              <tr>
                <th colspan="6" class="titulo-productos">PRODUCTOS</th>
              </tr>
              <tr>
                <th class="col-codigo">CÓDIGO</th>
                <th class="col-cantidad">CANTIDAD</th>
                <th class="col-unidad">UNIDAD</th>
                <th class="col-descripcion">DESCRIPCIÓN</th>
                <th class="col-precio">PRECIO</th>
                <th class="col-importe">IMPORTE</th>
              </tr>
            </thead>
            <tbody>
              ${data.productos && data.productos.length > 0 ? data.productos.map((producto: { codigo: any; cantidad: any; unidadMedida: any; descripcion: any; precioUnitario: any; total: any; }) => `
                <tr>
                  <td class="col-codigo">${escapeHtml(producto.codigo || '')}</td>
                  <td class="col-cantidad">${producto.cantidad || 0}</td>
                  <td class="col-unidad">${escapeHtml(producto.unidadMedida || '')}</td>
                  <td class="col-descripcion">${escapeHtml(producto.descripcion || '')}</td>
                  <td class="col-precio">${formatCurrency(producto.precioUnitario)}</td>
                  <td class="col-importe">${formatCurrency(producto.total)}</td>
                </tr>
              `).join('') : '<tr><td colspan="6" style="text-align: center;">No hay productos</td></tr>'}
              <tr class="total-row">
                <td colspan="5" style="text-align: right; font-weight: bold;">TOTAL INCLUYE IGV:</td>
                <td class="col-importe">${formatCurrency(data.totalProveedor)}</td>
              </tr>
              <tr>
                <td colspan="6" style="text-align: center; font-weight: bold; border-top: 1px solid #000; padding-top: 5px;">
                  FORMA DE PAGO: ${escapeHtml(data.tipoPago || 'No especificado')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        ${generateTransportesHtml(data.transportesAsignados || [], data.fechaRecepcion)}

        <div class="info-section">
          <h2>OBSERVACIONES</h2>
          <div style="border: 1px solid #000; padding: 8px; border-radius: 5px; background: white; margin-top: 5px;">
            <p style="margin: 0;">${escapeHtml(data.notaPedido || 'Sin observaciones')}</p>
          </div>
        </div>

        <div class="facturacion-card">
          <h3>DATOS DE FACTURACIÓN</h3>
          <p><strong>RUC:</strong> ${escapeHtml(data.empresa?.ruc || '')}</p>
          <p><strong>Razón Social:</strong> ${escapeHtml(data.empresa?.razonSocial || '')}</p>
          <p><strong>Enviar factura PDF, Archivo XML y guía de remisión al correo:</strong> ${escapeHtml(data.empresa?.email || '')}</p>
        </div>

        <div class="footer">
          <p>Generado el ${new Date().toLocaleString('es-ES')}</p>
        </div>
      </body>
      <script>
        // Auto-imprimir cuando la página se carga
        window.onload = function() {
          window.print();
        }

        window.onafterprint = function() {
          window.close();
        }
      </script>
    </html>
  `;

    // Abrir en nueva ventana para impresión
    const printWindow = window.open('_blank', 'width=800,height=600');

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
      link.download = `orden-proveedor-${data.codigoOp || data.id}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      throw new Error('No se pudo abrir la ventana de impresión. Verifica que los popups estén habilitados.');
    }
  } catch (error) {
    console.error('Error al imprimir orden de proveedor:', error);
    throw new Error('Error al generar la orden de proveedor para impresión');
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
            border-radius: 8px;
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