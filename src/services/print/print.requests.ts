import apiClient from '../apiClient';
import { loadTemplate, fillTemplate } from './template-loader';

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
      cartaCci?: string | null;
      cartaGarantia?: string | null;
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

export interface Empresa {
  logo?: string;
  direccion?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  telefono?: string;
  email?: string;
  web?: string;
  ruc?: string;
  razonSocial?: string;
}

export interface Proveedor {
  razonSocial?: string;
  ruc?: string;
}

export interface Producto {
  codigo?: string;
  cantidad?: number;
  unidadMedida?: string;
  descripcion?: string;
  precioUnitario?: number;
  total?: number;
}

export interface TransporteAsignado {
  transporte?: {
    razonSocial?: string;
    ruc?: string;
    direccion?: string;
    telefono?: string;
  };
  direccion?: string;
  etiquetado?: string;
  embalaje?: string;
  notaTransporte?: string;
  otros?: string;
}

export interface OrdenProveedorData {
  id?: string | number;
  codigoOp?: string;
  empresa?: Empresa;
  proveedor?: Proveedor;
  productos?: Producto[];
  totalProveedor?: number;
  tipoPago?: string;
  transportesAsignados?: TransporteAsignado[];
  fechaRecepcion?: string;
  notaPedido?: string;
  fechaEmision?: string;
  createdAt?: string;
}
export const printOrdenProveedor = async (id: number): Promise<void> => {
  try {
    const response = await apiClient.get(`/print/orden-proveedor/${id}`);

    if (!response.data || !response.data.data || !response.data.data.ordenProveedor) {
      throw new Error('Datos de orden de proveedor no disponibles');
    }

    const data = response.data.data.ordenProveedor;
    const productos = (data.productos || []) as any[];
    const transportesAsignados = data.transportesAsignados || [];
    const ordenCompra = data.ordenCompra;

    const formatCurrency = (value: unknown): string => {
      if (value === null || value === undefined || value === '') return '';
      const num = typeof value === 'number' ? value : Number(value);
      if (Number.isNaN(num)) return '';
      return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 }).format(num);
    };

    const escapeHtml = (text: string): string => {
      const div = document.createElement('div');
      div.textContent = text ?? '';
      return div.innerHTML;
    };

    const formatDate = (dateString: string): string => {
      if (!dateString) return '';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
    };

    const template = await loadTemplate('/src/services/print/print-op-template.html');

    const logoHtml = data.empresa?.logo
      ? `<img class="company-logo" src="${data.empresa.logo}" alt="Logo Empresa">`
      : '';

    const empresaDirecciones = data.empresa?.direcciones || data.empresa?.direccion || 'Sin dirección';

    const productosRows = productos.map((producto: any) => `
      <tr>
        <td class="product-cell">${escapeHtml(producto.codigo || 'N/A')}</td>
        <td class="product-cell">${producto.cantidad || 0}</td>
        <td class="product-cell">${escapeHtml(producto.unidadMedida || 'UND')}</td>
        <td class="product-cell-description">${escapeHtml(producto.descripcion || 'Sin descripción')}</td>
        <td class="product-cell">${formatCurrency(Number(producto.precioUnitario) || 0)}</td>
        <td class="product-cell-last">${formatCurrency(Number(producto.total) || 0)}</td>
      </tr>
    `).join('');

    const total = productos.reduce((sum: number, p: any) => sum + (Number(p.total) || 0), 0);
    const plazoEntrega = data.fechaRecepcion ? formatDate(data.fechaRecepcion) : 'No especificado';

    let seccionTransporte = '';
    let destinoInfo = '';
    let etiquetadoRow = '';
    let embalajeRow = '';
    let observacionesRow = '';
    let otrosRow = '';

    if (transportesAsignados.length > 0) {
      seccionTransporte = transportesAsignados.map((transporte: any, index: number) => {
        const transporteData = transporte.transporte;
        const transporteDireccion = [
          transporte.direccion,
          transporte.distrito,
          transporte.provincia,
          transporte.region
        ].filter(Boolean).join(' / ') || 'No especificada';

        return `
          <tr>
            <td class="section-label">
              <svg xmlns="http://www.w3.org/2000/svg" height="16" width="15" viewBox="0 0 640 512" class="icon-truck">
                <path d="M48 0C21.5 0 0 21.5 0 48V368c0 26.5 21.5 48 48 48H64c0 53 43 96 96 96s96-43 96-96H384c0 53 43 96 96 96s96-43 96-96h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V288 256 237.3c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7H416V48c0-26.5-21.5-48-48-48H48zM416 160h50.7L544 237.3V256H416V160zM112 416a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm368-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
              </svg>
              TRANSPORTE${transportesAsignados.length > 1 ? ` ${index + 1}` : ''}:
            </td>
            <td class="section-content">
              <div>${escapeHtml(transporteData?.razonSocial || 'Sin información')}</div>
              <div><b>Dirección: </b>${escapeHtml(transporteDireccion)}</div>
              <div><b>RUC: </b>${escapeHtml(transporteData?.ruc || 'N/A')}</div>
            </td>
          </tr>
        `;
      }).join('');

      const primerTransporte = transportesAsignados[0];

      etiquetadoRow = `
        <tr>
          <td class="section-label">ETIQUETADO:</td>
          <td class="section-content">${escapeHtml(primerTransporte.etiquetado || '')}</td>
        </tr>
      `;

      embalajeRow = `
        <tr>
          <td class="section-label">EMBALAJE:</td>
          <td class="section-content">${escapeHtml(primerTransporte.embalaje || '')}</td>
        </tr>
      `;

      observacionesRow = `
        <tr>
          <td class="section-label">OBSERVACIONES:</td>
          <td class="section-content">${escapeHtml(primerTransporte.notaTransporte || '')}</td>
        </tr>
      `;

      otrosRow = `
        <tr>
          <td class="section-label">OTROS:</td>
          <td class="section-content">${escapeHtml(primerTransporte.otros || '')}</td>
        </tr>
      `;
    } else {
      etiquetadoRow = `
        <tr>
          <td class="section-label">ETIQUETADO:</td>
          <td class="section-content"></td>
        </tr>
      `;

      embalajeRow = `
        <tr>
          <td class="section-label">EMBALAJE:</td>
          <td class="section-content"></td>
        </tr>
      `;

      observacionesRow = `
        <tr>
          <td class="section-label">OBSERVACIONES:</td>
          <td class="section-content"></td>
        </tr>
      `;

      otrosRow = `
        <tr>
          <td class="section-label">OTROS:</td>
          <td class="section-content"></td>
        </tr>
      `;
    }

    if (ordenCompra) {
      const direccionCompleta = [
        ordenCompra.direccionEntrega,
        ordenCompra.distritoEntrega,
        ordenCompra.provinciaEntrega,
        ordenCompra.departamentoEntrega
      ].filter(Boolean).join(' / ') || 'No especificada';

      destinoInfo = `
        <div><b>${escapeHtml(ordenCompra.cliente?.razonSocial || 'Sin cliente')}</b></div>
        <div><b>Dirección: </b>${escapeHtml(direccionCompleta)}</div>
        ${ordenCompra.referenciaEntrega ? `<div><b>Referencia: </b>${escapeHtml(ordenCompra.referenciaEntrega)}</div>` : ''}
        ${ordenCompra.contactoCliente ? `<div><b>Contacto: </b>${escapeHtml(ordenCompra.contactoCliente.nombre || '')} - ${escapeHtml(ordenCompra.contactoCliente.telefono || '')}</div>` : ''}
      `;
    } else {
      destinoInfo = '<div>No especificado</div>';
    }

    const htmlFinal = fillTemplate(template, {
      LOGO: logoHtml,
      EMPRESA_TELEFONO: escapeHtml(data.empresa?.telefono || 'Sin teléfono'),
      EMPRESA_DIRECCIONES: escapeHtml(empresaDirecciones),
      FECHA_EMISION: formatDate(data.fechaEmision || data.createdAt),
      RUC_EMPRESA: escapeHtml(data.empresa?.ruc || ''),
      CODIGO_OP: data.codigoOp || data.id,
      PROVEEDOR_RAZON_SOCIAL: escapeHtml(data.proveedor?.razonSocial || ''),
      PROVEEDOR_RUC: escapeHtml(data.proveedor?.ruc || ''),
      PRODUCTOS_ROWS: productosRows,
      TOTAL_INCLUYE_IGV: formatCurrency(total),
      FORMA_PAGO: escapeHtml(data.tipoPago || 'No especificado'),
      PLAZO_ENTREGA: plazoEntrega,
      SECCION_TRANSPORTE: seccionTransporte,
      DESTINO_INFO: destinoInfo,
      ETIQUETADO_ROW: etiquetadoRow,
      EMBALAJE_ROW: embalajeRow,
      OBSERVACIONES_ROW: observacionesRow,
      OTROS_ROW: otrosRow,
      RUC_FACTURACION: escapeHtml(data.empresa?.ruc || ''),
      RAZON_SOCIAL_FACTURACION: escapeHtml(data.empresa?.razonSocial || ''),
      EMAIL_FACTURACION: escapeHtml(data.empresa?.email || 'contabilidad@multilimpsac.com')
    });

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      const blob = new Blob([htmlFinal], { type: 'text/html' });
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

    printWindow.document.write(htmlFinal);
    printWindow.document.close();
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

    // Función auxiliar para formatear moneda (robusta y localizada)
    const formatCurrency = (value: unknown): string => {
      if (value === null || value === undefined || value === '') return '';
      const num = typeof value === 'number' ? value : Number(value);
      if (Number.isNaN(num)) return '';
      return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 }).format(num);
    };

    // Función auxiliar para escapar HTML (prevención XSS en impresión)
    const escapeHtml = (text: string): string => {
      const div = document.createElement('div');
      div.textContent = text ?? '';
      return div.innerHTML;
    };

    // Función para generar HTML de productos
    const generateProductosHtml = (productos: Array<{ codigo?: string; descripcion?: string; cantidad?: number }>): string => {
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
    const generateProveedorHtml = (proveedor: { razonSocial?: string; contacto?: { nombre?: string; telefono?: string; cargo?: string } }): string => {
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
    const generateDestinoHtml = (destino: { tipo?: string; cliente?: { razonSocial?: string }; direccion?: string; referencia?: string; contacto?: { nombre?: string }; telefono?: string }): string => {
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

    // Función auxiliar para formatear moneda (robusta y localizada)
    const formatCurrency = (value: unknown): string => {
      if (value === null || value === undefined || value === '') return '';
      const num = typeof value === 'number' ? value : Number(value);
      if (Number.isNaN(num)) return '';
      return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 }).format(num);
    };

    // Función auxiliar para escapar HTML (prevención XSS en impresión)
    const escapeHtml = (text: string): string => {
      const div = document.createElement('div');
      div.textContent = text ?? '';
      return div.innerHTML;
    };

    // Función para generar HTML de productos
    const generateProductosHtml = (productos: Array<{ codigo?: string; descripcion?: string; cantidad?: number }>): string => {
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
    const generateProveedorHtml = (proveedor: { razonSocial?: string; contacto?: { nombre?: string; telefono?: string; cargo?: string } }): string => {
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
    const generateDestinoHtml = (destino: { tipo?: string; cliente?: { razonSocial?: string }; direccion?: string; referencia?: string; contacto?: { nombre?: string }; telefono?: string }): string => {
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