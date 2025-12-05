import apiClient from '../apiClient';
import { fillTemplate } from './template-loader';
import opTemplate from './print-op-template.html?raw';
import quoteTemplate from './print-quote-template.html?raw';

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
      ordenCompraFisica?: string | null;
      ordenCompraElectronica?: string | null;
      facturasArchivo?: string[];
      grrsArchivo?: string[];
      documentosFacturacion?: Array<{
        fechaFactura?: string | null;
        facturaNumero?: string | null;
        facturaArchivo?: string | null;
        grrNumero?: string | null;
        grrArchivo?: string | null;
      }>;
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

export interface Cliente {
  razonSocial?: string;
  ruc?: string;
}

export interface CotizacionData {
  id?: string | number;
  codigoCotizacion?: string;
  empresa?: Empresa;
  cliente?: Cliente;
  productos?: Producto[];
  montoTotal?: number;
  tipoPago?: string;
  fechaCotizacion?: string;
  fechaEntrega?: string;
  direccionEntrega?: string;
  distritoEntrega?: string;
  provinciaEntrega?: string;
  departamentoEntrega?: string;
  referenciaEntrega?: string;
  notaPedido?: string;
  contactoCliente?: {
    nombre?: string;
    telefono?: string;
    cargo?: string;
  };
}

export interface OrdenProveedorData {
  id?: string | number;
  codigoOp?: string;
  empresa?: Empresa;
  proveedor?: Proveedor;
  productos?: Producto[];
  totalProveedor?: number;
  tipoPago?: string;
  formaPago?: string;
  transportesAsignados?: TransporteAsignado[];
  fechaRecepcion?: string;
  notaPedido?: string;
  fechaEmision?: string;
  createdAt?: string;
}
export const printOrdenProveedor = async (id: number): Promise<void> => {
  try {
    const printWindow = window.open('', '_blank');

    const response = await apiClient.get(`/print/orden-proveedor/${id}`);

    if (!response.data || !response.data.data || !response.data.data.ordenProveedor) {
      throw new Error('Datos de orden de proveedor no disponibles');
    }

    const data = response.data.data.ordenProveedor;
    const productos = (data.productos || []) as Producto[];
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

    const template = opTemplate;

    const logoHtml = data.empresa?.logo
      ? `<img class="company-logo" src="${data.empresa.logo}" alt="Logo Empresa">`
      : '';

    const empresaDirecciones = data.empresa?.direcciones || data.empresa?.direccion || 'Sin dirección';

    const productosRows = productos.map((producto: Producto) => `

      <tr>
        <td class="product-cell">${escapeHtml(producto.codigo || ' ')}</td>
        <td class="product-cell">${producto.cantidad || 0}</td>
        <td class="product-cell">${escapeHtml(producto.unidadMedida || 'UND')}</td>
        <td class="product-cell-description">${escapeHtml(producto.descripcion || 'Sin descripción')}</td>
        <td class="product-cell">${formatCurrency(Number(producto.precioUnitario) || 0)}</td>
        <td class="product-cell-last">${formatCurrency(Number(producto.total) || 0)}</td>
      </tr>
    `).join('');

    const total = productos.reduce((sum: number, p: Producto) => sum + (Number(p.total) || 0), 0);
    const plazoEntrega = data.fechaRecepcion ? formatDate(data.fechaRecepcion) : 'No especificado';

    const formaPagoLabels: Record<string, string> = {
      'CONTADO': 'Pago al Contado',
      'CREDITO': 'Pago al Crédito',
      'ANTICIPADO': 'Anticipado',
      'OTROS': 'Otros'
    };
    const formaPagoLabel = data.formaPago ? formaPagoLabels[data.formaPago] || data.formaPago : 'No especificado';

    let seccionTransporte = '';
    let destinoInfo = '';
    let etiquetadoRow = '';
    let embalajeRow = '';
    let observacionesRow = '';
    let otrosRow = '';

    if (transportesAsignados.length > 0) {
      seccionTransporte = transportesAsignados.map((transporte: TransporteAsignado, index: number) => {
        const transporteData = transporte.transporte;
        const transporteDireccion = escapeHtml(transporteData?.direccion || 'No especificada');

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
              <div><b>Dirección: </b>${transporteDireccion}</div>
              <div><b>RUC: </b>${escapeHtml(transporteData?.ruc || ' ')}</div>
            </td>
          </tr>
        `;
      }).join('');

      etiquetadoRow = `
        <tr>
          <td class="section-label">ETIQUETADO:</td>
          <td class="section-content">${escapeHtml(data.etiquetado || '')}</td>
        </tr>
      `;

      embalajeRow = `
        <tr>
          <td class="section-label">EMBALAJE:</td>
          <td class="section-content">${escapeHtml(data.embalaje || '')}</td>
        </tr>
      `;

      observacionesRow = `
        <tr>
          <td class="section-label">OBSERVACIONES</td>
          <td class="section-content">${escapeHtml(data.notaPedido || '')}</td>
        </tr>
      `;

      otrosRow = `
        <tr>
          <td class="section-label">OTROS:</td>
          <td class="section-content">${escapeHtml(data.observaciones || '')}</td>
        </tr>
      `;
    } else {
      seccionTransporte = '';

      etiquetadoRow = `
        <tr>
          <td class="section-label">ETIQUETADO:</td>
          <td class="section-content">${escapeHtml(data.etiquetado || '')}</td>
        </tr>
      `;

      embalajeRow = `
        <tr>
          <td class="section-label">EMBALAJE:</td>
          <td class="section-content">${escapeHtml(data.embalaje || '')}</td>
        </tr>
      `;

      observacionesRow = `
        <tr>
          <td class="section-label">OBSERVACIONES:</td>
          <td class="section-content">${escapeHtml(data.notaPedido || '')}</td>
        </tr>
      `;

      otrosRow = `
        <tr>
          <td class="section-label">OTROS:</td>
          <td class="section-content">${escapeHtml(data.observaciones || '')}</td>
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
      FORMA_PAGO: escapeHtml(formaPagoLabel),
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

    printWindow.document.open();
    printWindow.document.write(htmlFinal);
    printWindow.document.close();

    printWindow.onafterprint = function () {
      printWindow.close();
    };
  } catch (error) {
    console.error('Error al imprimir orden de proveedor:', error);
    throw new Error('Error al generar la orden de proveedor para impresión');
  }
};

export const printCotizacion = async (id: number): Promise<void> => {
  try {
    const printWindow = window.open('', '_blank');

    const response = await apiClient.get(`/print/cotizacion/${id}`);

    if (!response.data || !response.data.data || !response.data.data.cotizacion) {
      throw new Error('Datos de cotización no disponibles');
    }

    const data = response.data.data.cotizacion;
    const productos = (data.productos || []) as Producto[];

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

    const template = quoteTemplate;

    const logoHtml = data.empresa?.logo
      ? `<img class="company-logo" src="${data.empresa.logo}" alt="Logo Empresa">`
      : '';

    const empresaDirecciones = data.empresa?.direcciones || data.empresa?.direccion || 'Sin dirección';

    const productosRows = productos.map((producto: Producto) => `
      <tr>
        <td class="product-cell">${escapeHtml(producto.codigo || ' ')}</td>
        <td class="product-cell">${producto.cantidad || 0}</td>
        <td class="product-cell">${escapeHtml(producto.unidadMedida || 'UND')}</td>
        <td class="product-cell-description">${escapeHtml(producto.descripcion || 'Sin descripción')}</td>
        <td class="product-cell">${formatCurrency(Number(producto.precioUnitario) || 0)}</td>
        <td class="product-cell-last">${formatCurrency(Number(producto.total) || 0)}</td>
      </tr>
    `).join('');

    const total = productos.reduce((sum: number, p: Producto) => sum + (Number(p.total) || 0), 0);
    const plazoEntrega = data.fechaEntrega ? formatDate(data.fechaEntrega) : 'No especificado';

    const direccionCompleta = [
      data.direccionEntrega,
      data.distritoEntrega,
      data.provinciaEntrega,
      data.departamentoEntrega
    ].filter(Boolean).join(' / ') || 'No especificada';

    const destinoInfo = `
       <div><b>${escapeHtml(data.cliente?.razonSocial || 'Sin cliente')}</b></div>
       <div><b>Dirección: </b>${escapeHtml(direccionCompleta)}</div>
       ${data.referenciaEntrega ? `<div><b>Referencia: </b>${escapeHtml(data.referenciaEntrega)}</div>` : ''}
       ${data.contactoCliente ? `<div><b>Contacto: </b>${escapeHtml(data.contactoCliente.nombre || '')} - ${escapeHtml(data.contactoCliente.telefono || '')}</div>` : ''}
     `;

    const validezCotizacion = '30 días';

    // Generar HTML de cuentas bancarias de la empresa
    const cuentasBancarias = data.empresa?.cuentasBancarias || [];
    const cuentasBancariasHtml = cuentasBancarias.length > 0
      ? cuentasBancarias.map((cuenta: any) => {
        const tipoCuenta = cuenta.tipoCuenta === 'corriente' ? 'cuenta corriente' : 'cuenta de ahorros';
        const moneda = cuenta.moneda === 'DOLARES' ? 'dólares' : 'soles';
        let cuentaHtml = `<b>${escapeHtml(cuenta.banco || '')}:</b> ${tipoCuenta} ${moneda} N° ${escapeHtml(cuenta.numeroCuenta || '')}`;
        if (cuenta.numeroCci) {
          cuentaHtml += ` - CCI N° ${escapeHtml(cuenta.numeroCci)}`;
        }
        return cuentaHtml;
      }).join('<br>')
      : 'No hay cuentas bancarias registradas';

    const htmlFinal = fillTemplate(template, {
      CODIGO_COTIZACION: escapeHtml(data.codigoCotizacion || ''),
      LOGO: logoHtml,
      EMPRESA_TELEFONO: escapeHtml(data.empresa?.telefono || ''),
      EMPRESA_DIRECCIONES: escapeHtml(empresaDirecciones),
      FECHA_EMISION: formatDate(data.fechaCotizacion || new Date().toISOString()),
      RUC_EMPRESA: escapeHtml(data.empresa?.ruc || ''),
      CLIENTE_RAZON_SOCIAL: escapeHtml(data.cliente?.razonSocial || ''),
      CLIENTE_RUC: escapeHtml(data.cliente?.ruc || ''),
      PRODUCTOS_ROWS: productosRows,
      TOTAL_INCLUYE_IGV: formatCurrency(total),
      VALIDEZ_COTIZACION: validezCotizacion,
      PLAZO_ENTREGA: plazoEntrega,
      SECCION_TRANSPORTE: '',
      DESTINO_INFO: destinoInfo,
      OBSERVACIONES_ADICIONALES: escapeHtml(data.notaPedido || ''),
      CUENTAS_BANCARIAS: cuentasBancariasHtml,
      RUC_FACTURACION: escapeHtml(data.empresa?.ruc || ''),
      RAZON_SOCIAL_FACTURACION: escapeHtml(data.empresa?.razonSocial || ''),
      EMAIL_FACTURACION: escapeHtml(data.empresa?.email || '')
    });

    if (!printWindow) {
      const blob = new Blob([htmlFinal], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cotizacion-${data.codigoCotizacion || 'sin-codigo'}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      throw new Error('No se pudo abrir la ventana de impresión. Verifica que los popups estén habilitados.');
    }

    printWindow.document.open();
    printWindow.document.write(htmlFinal);
    printWindow.document.close();

    printWindow.onafterprint = function () {
      printWindow.close();
    };
  } catch (error) {
    console.error('Error al imprimir cotización:', error);
    throw new Error('Error al generar la cotización para impresión');
  }
};