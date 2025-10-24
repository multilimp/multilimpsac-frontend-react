import apiClient from '../apiClient';
import { CargosEntregaData } from './print.requests';

// Función optimizada para impresión monocromatica en pestaña
export const printCargosEntregaMonochrome = async (fechaInicio: string, fechaFin: string): Promise<void> => {
  try {
    // Obtener datos del backend
    const response = await apiClient.get(`/print/cargos-entrega/data`, {
      params: { fechaInicio, fechaFin }
    });

    const data: CargosEntregaData = response.data.data;

    // Función auxiliar para escapar HTML
    const escapeHtml = (text: string): string => {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };

    // Función para generar HTML de productos en formato de tabla compacta
    const generateProductosHtml = (productos: any[]): string => {
      if (!productos || productos.length === 0) return '';

      return `
        <table class="tabla-productos">
          <thead>
            <tr>
              <th class="producto-header">PRODUCTO</th>
              <th class="descripcion-header">DESCRIPCIÓN</th>
              <th class="cantidad-header">CANTIDAD</th>
            </tr>
          </thead>
          <tbody>
            ${productos.map(producto => `
              <tr>
                <td class="producto-cell">${escapeHtml(producto.codigo || '')}</td>
                <td class="descripcion-cell">${escapeHtml(producto.descripcion || '')}</td>
                <td class="cantidad-cell">${producto.cantidad || 0}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    };

    // Función para generar sección de proveedor y transporte
    const generateProveedorTransporteHtml = (proveedor: any, transporteAsignado: any): string => {
      if (!proveedor && !transporteAsignado) return '';

      return `
        <table class="info-horizontal">
          <tr>
            <td class="proveedor-section">
              <strong>PROVEEDOR</strong><br>
              ${escapeHtml(proveedor?.razonSocial || '')}<br>
              ${proveedor?.contacto ? `<strong>${escapeHtml(proveedor.contacto.cargo || 'CONTACTO')}:</strong> ${escapeHtml(proveedor.contacto.nombre || '')} <strong>TELÉFONO:</strong> ${escapeHtml(proveedor.contacto.telefono || '')}` : ''}
            </td>
            <td class="transporte-section">
              ${transporteAsignado ? `
              <strong>${escapeHtml(transporteAsignado.transporte.razonSocial || '')}</strong><br>
              ${transporteAsignado.transporte.direccion ? `<strong>DIRECCIÓN:</strong> ${escapeHtml(transporteAsignado.transporte.direccion)}<br>` : ''}
              ${transporteAsignado.contactoTransporte ? `<strong>${escapeHtml(transporteAsignado.contactoTransporte.cargo || 'CONTACTO')}:</strong> ${escapeHtml(transporteAsignado.contactoTransporte.nombre || '')}` : ''}
              ${transporteAsignado.contactoTransporte?.telefono ? ` <strong>TELÉFONO:</strong> ${escapeHtml(transporteAsignado.contactoTransporte.telefono)}` : ''}<br>
              ` : '<strong>SIN TRANSPORTE ASIGNADO</strong>'}
            </td>
          </tr>
        </table>
      `;
    };

    // Función para generar sección de destino
    const generateDestinoHtml = (destino: any): string => {
      if (!destino) return '';

      return `
        <table class="destino-table">
          <tr>
            <td class="destino-label"><strong>DESTINO</strong><br>Cliente</td>
            <td class="destino-content">
              <strong>DIRECCIÓN REGIONAL DE SALUD TUMBES</strong><br>
              <strong>DESTINO:</strong> ${escapeHtml(destino.direccion || '')}<br>
              ${destino.distrito ? `${escapeHtml(destino.distrito)} / ` : ''}${destino.provincia ? `${escapeHtml(destino.provincia)} / ` : ''}${destino.departamento ? escapeHtml(destino.departamento) : ''}<br>
              ${destino.referencia ? `<strong>REFERENCIA:</strong> ${escapeHtml(destino.referencia)}<br>` : ''}
              ${destino.contacto ? `<strong>${escapeHtml(destino.contacto.cargo || 'CONTACTO')}:</strong> ${escapeHtml(destino.contacto.nombre || '')}<br>` : ''}
              ${destino.contacto?.telefono ? `<strong>TELÉFONO:</strong> ${escapeHtml(destino.contacto.telefono)}<br>` : ''}
            </td>
          </tr>
        </table>
      `;
    };

    // Función para generar sección de observación
    const generateObservacionHtml = (observacion: string): string => {
      if (!observacion) return '';

      return `
        <table class="observacion-table">
          <tr>
            <td class="observacion-label"><strong>OBSERVACIÓN</strong></td>
            <td class="observacion-content">${escapeHtml(observacion)}</td>
          </tr>
        </table>
      `;
    };

    // Generar HTML completo con diseño monocromatico
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Reporte de Programación - ${data.fechaInicio} al ${data.fechaFin}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.2;
            color: #000;
            background: white;
            padding: 15px;
        }

        @media print {
            * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            body {
                padding: 5px;
                font-size: 9pt;
            }
            
            .fecha-seccion {
                page-break-before: auto;
                page-break-after: auto;
                page-break-inside: avoid;
            }
            
            .op-container {
                page-break-inside: avoid;
                margin-bottom: 10px;
            }
        }

        .contenedor {
            max-width: 100%;
            margin: 0 auto;
        }

        @media print {
            .contenedor {
                padding: 0;
            }
        }

        .fecha-titulo {
            font-size: 14pt;
            font-weight: bold;
            text-align: center;
            margin-bottom: 15px;
            padding: 8px;
            background: white;
            color: black;
            border: 1px solid #000;
        }

        .op-container {
            border: 1px solid #000;
            margin-bottom: 15px;
            page-break-inside: avoid;
            background: #fff;
            padding: 0;
        }

        .op-header {
            width: 100%;
            border-collapse: collapse;
            margin: 0;
        }

        .op-header td {
            border: 1px solid #000;
            padding: 6px;
            vertical-align: middle;
            font-size: 10pt;
        }

        .op-numero {
            background: white !important;
            color: black !important;
            font-weight: bold;
            width: 80px;
            text-align: center;
            font-size: 44pt;
            border-right: 2px solid #000;
        }

        .op-codigo {
            background: white;
            font-weight: bold;
            text-align: left;
            padding-left: 10px;
            font-size: 11pt;
        }

        .ocf-text {
            font-size: 10pt;
            color: #666;
            font-weight: normal;
            display: block;
            margin-top: 3px;
        }

        .gestor-estado {
            text-align: left;
            padding-right: 10px;
            font-weight: normal;
        }

        .tabla-productos {
            width: 100%;
            border-collapse: collapse;
            margin: 0;
        }

        .producto-header {
            background: #000 !important;
            color: white !important;
            padding: 6px;
            text-align: center;
            border: 1px solid #000;
            font-weight: bold;
            font-size: 10pt;
            width: 15%;
        }

        .descripcion-header {
            background: #000 !important;
            color: white !important;
            padding: 6px;
            text-align: center;
            border: 1px solid #000;
            font-weight: bold;
            font-size: 10pt;
            width: 70%;
        }

        .cantidad-header {
            background: #000 !important;
            color: white !important;
            padding: 6px;
            text-align: center;
            border: 1px solid #000;
            font-weight: bold;
            font-size: 10pt;
            width: 15%;
        }

        .producto-cell {
            border: 1px solid #000;
            padding: 6px;
            text-align: center;
            font-size: 9pt;
        }

        .descripcion-cell {
            border: 1px solid #000;
            padding: 6px;
            text-align: left;
            font-size: 9pt;
        }

        .cantidad-cell {
            border: 1px solid #000;
            padding: 6px;
            text-align: center;
            font-size: 9pt;
            font-weight: bold;
        }

        .info-horizontal {
            width: 100%;
            border-collapse: collapse;
            margin: 0;
        }

        .proveedor-section {
            border: 1px solid #000;
            padding: 8px;
            vertical-align: top;
            width: 50%;
            font-size: 9pt;
            line-height: 1.3;
        }

        .transporte-section {
            border: 1px solid #000;
            padding: 8px;
            vertical-align: top;
            width: 50%;
            font-size: 9pt;
            line-height: 1.3;
        }

        .destino-table {
            width: 100%;
            border-collapse: collapse;
            margin: 0;
        }

        .destino-label {
            border: 1px solid #000;
            padding: 8px;
            vertical-align: top;
            width: 20%;
            font-size: 9pt;
            font-weight: bold;
            background: #f0f0f0;
        }

        .destino-content {
            border: 1px solid #000;
            padding: 8px;
            vertical-align: top;
            width: 80%;
            font-size: 9pt;
            line-height: 1.3;
        }

        .observacion-table {
            width: 100%;
            border-collapse: collapse;
            margin: 0;
        }

        .observacion-label {
            border: 1px solid #000;
            padding: 8px;
            vertical-align: top;
            width: 20%;
            font-size: 9pt;
            font-weight: bold;
            background: #f0f0f0;
        }

        .observacion-content {
            border: 1px solid #000;
            padding: 8px;
            vertical-align: top;
            width: 80%;
            font-size: 9pt;
        }

        .sin-datos {
            text-align: center;
            padding: 50px;
            border: 2px solid #000;
            background: #f9f9f9;
        }

        .sin-datos h3 {
            color: #000;
            margin-bottom: 10px;
        }

        .sin-datos p {
            color: #666;
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
                                <td class="op-codigo">
                                    ${escapeHtml(op.codigoOp)}
                                    ${op.ocf ? `<span class="ocf-text">OCF: ${escapeHtml(op.ocf)}</span>` : ''}
                                </td>
                                <td class="gestor-estado">Gestor:<br><br>Estado:</td>
                            </tr>
                        </table>

                        ${generateProductosHtml(op.productos)}
                        ${generateProveedorTransporteHtml(op.proveedor, op.transporteAsignado)}
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
  window.onload = function() {
    window.print();
  }

  window.onafterprint = function() {
    window.close();
  }

  window.onbeforeunload = function() {
    return null;
  }

  let printDialogClosed = false;
  
  window.addEventListener('focus', function() {
    if (!printDialogClosed) {
      printDialogClosed = true;
      setTimeout(function() {
        window.close();
      }, 500);
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      window.close();
    }
  });

  setTimeout(function() {
    if (!printDialogClosed) {
      window.close();
    }
  }, 30000);
</script>
</body>
</html>`;

    // Abrir una nueva pestaña con el contenido HTML para imprimir
    const printTab = window.open('', '_blank');

    if (printTab) {
      printTab.document.open();
      printTab.document.write(html);
      printTab.document.close();

      // Enfocar la pestaña para que aparezca el diálogo de impresión
      printTab.focus();
    } else {
      // Fallback si no se puede abrir la pestaña (bloqueador de popups)
      const blob = new Blob([html], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cargos-entrega-${fechaInicio}-${fechaFin}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      throw new Error('No se pudo abrir la pestaña de impresión. Verifica que los popups estén habilitados.');
    }

  } catch (error) {
    console.error('Error al imprimir reporte monocromatico de Reporte de Programación:', error);
    throw new Error('Error al generar el reporte monocromatico de Reporte de Programación');
  }
};

// Función para obtener datos JSON de Reporte de Programación (para tabla)
export const getCargosEntregaData = async (fechaInicio: string, fechaFin: string): Promise<CargosEntregaData> => {
  try {
    const response = await apiClient.get(`/print/cargos-entrega/data`, {
      params: { fechaInicio, fechaFin }
    });

    return response.data.data;
  } catch (error) {
    console.error('Error al obtener datos de Reporte de Programación:', error);
    throw new Error('Error al obtener los datos de Reporte de Programación');
  }
};
