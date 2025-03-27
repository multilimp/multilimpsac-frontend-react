export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      catalogo_empresas: {
        Row: {
          codigo: string | null
          created_at: string | null
          id: number
          id_empresa: number | null
          updated_at: string | null
        }
        Insert: {
          codigo?: string | null
          created_at?: string | null
          id: number
          id_empresa?: number | null
          updated_at?: string | null
        }
        Update: {
          codigo?: string | null
          created_at?: string | null
          id?: number
          id_empresa?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      clientes: {
        Row: {
          cod_unidad: number | null
          created_at: string | null
          departamento: string | null
          direccion: string | null
          distrito: string | null
          estado: number | null
          id: number
          provincia: string | null
          razon_social: string | null
          ruc: string | null
          updated_at: string | null
        }
        Insert: {
          cod_unidad?: number | null
          created_at?: string | null
          departamento?: string | null
          direccion?: string | null
          distrito?: string | null
          estado?: number | null
          id: number
          provincia?: string | null
          razon_social?: string | null
          ruc?: string | null
          updated_at?: string | null
        }
        Update: {
          cod_unidad?: number | null
          created_at?: string | null
          departamento?: string | null
          direccion?: string | null
          distrito?: string | null
          estado?: number | null
          id?: number
          provincia?: string | null
          razon_social?: string | null
          ruc?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contacto_clientes: {
        Row: {
          cargo: string | null
          correo: string | null
          created_at: string | null
          estado: number | null
          id: number
          id_cliente: number | null
          nombre: string | null
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          cargo?: string | null
          correo?: string | null
          created_at?: string | null
          estado?: number | null
          id: number
          id_cliente?: number | null
          nombre?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          cargo?: string | null
          correo?: string | null
          created_at?: string | null
          estado?: number | null
          id?: number
          id_cliente?: number | null
          nombre?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contacto_empresas: {
        Row: {
          cargo: string | null
          correo: string | null
          created_at: string | null
          id: number
          id_cliente: number | null
          nombre: string | null
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          cargo?: string | null
          correo?: string | null
          created_at?: string | null
          id: number
          id_cliente?: number | null
          nombre?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          cargo?: string | null
          correo?: string | null
          created_at?: string | null
          id?: number
          id_cliente?: number | null
          nombre?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contacto_proveedores: {
        Row: {
          cargo: string | null
          correo: string | null
          created_at: string | null
          estado: number | null
          id: number
          id_cliente: number | null
          nombre: string | null
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          cargo?: string | null
          correo?: string | null
          created_at?: string | null
          estado?: number | null
          id: number
          id_cliente?: number | null
          nombre?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          cargo?: string | null
          correo?: string | null
          created_at?: string | null
          estado?: number | null
          id?: number
          id_cliente?: number | null
          nombre?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contacto_transportes: {
        Row: {
          cargo: string | null
          correo: string | null
          created_at: string | null
          estado: number | null
          id: number
          id_cliente: number | null
          nombre: string | null
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          cargo?: string | null
          correo?: string | null
          created_at?: string | null
          estado?: number | null
          id: number
          id_cliente?: number | null
          nombre?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          cargo?: string | null
          correo?: string | null
          created_at?: string | null
          estado?: number | null
          id?: number
          id_cliente?: number | null
          nombre?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cotizacion_productos: {
        Row: {
          cantidad: number | null
          codigo: string | null
          created_at: string | null
          descripcion: string | null
          id: number
          id_cotizacion: number | null
          medida: number | null
          p_cliente: string | null
          precio_unitario: number | null
          total: number | null
          updated_at: string | null
        }
        Insert: {
          cantidad?: number | null
          codigo?: string | null
          created_at?: string | null
          descripcion?: string | null
          id: number
          id_cotizacion?: number | null
          medida?: number | null
          p_cliente?: string | null
          precio_unitario?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Update: {
          cantidad?: number | null
          codigo?: string | null
          created_at?: string | null
          descripcion?: string | null
          id?: number
          id_cotizacion?: number | null
          medida?: number | null
          p_cliente?: string | null
          precio_unitario?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cotizaciones: {
        Row: {
          c_departamento: string | null
          c_direccion: string | null
          c_distrito: string | null
          c_provincia: string | null
          c_referencia: string | null
          created_at: string | null
          estado: number | null
          fecha_cotizacion: string | null
          fecha_entrega: string | null
          id: number
          id_cliente: number | null
          id_contacto_cliente: number | null
          id_cotizacion: number | null
          id_empresa: number | null
          monto: number | null
          nota_pago: string | null
          nota_pedido: number | null
          tipo_pago: string | null
          updated_at: string | null
        }
        Insert: {
          c_departamento?: string | null
          c_direccion?: string | null
          c_distrito?: string | null
          c_provincia?: string | null
          c_referencia?: string | null
          created_at?: string | null
          estado?: number | null
          fecha_cotizacion?: string | null
          fecha_entrega?: string | null
          id: number
          id_cliente?: number | null
          id_contacto_cliente?: number | null
          id_cotizacion?: number | null
          id_empresa?: number | null
          monto?: number | null
          nota_pago?: string | null
          nota_pedido?: number | null
          tipo_pago?: string | null
          updated_at?: string | null
        }
        Update: {
          c_departamento?: string | null
          c_direccion?: string | null
          c_distrito?: string | null
          c_provincia?: string | null
          c_referencia?: string | null
          created_at?: string | null
          estado?: number | null
          fecha_cotizacion?: string | null
          fecha_entrega?: string | null
          id?: number
          id_cliente?: number | null
          id_contacto_cliente?: number | null
          id_cotizacion?: number | null
          id_empresa?: number | null
          monto?: number | null
          nota_pago?: string | null
          nota_pedido?: number | null
          tipo_pago?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      empresas: {
        Row: {
          cod_unidad: number | null
          correo: string | null
          created_at: string | null
          departamento: string | null
          direccion: string | null
          direcciones: string | null
          distrito: string | null
          estado: number | null
          id: number
          logo: string | null
          provincia: string | null
          razon_social: string | null
          ruc: string | null
          telefono: string | null
          updated_at: string | null
          web: string | null
        }
        Insert: {
          cod_unidad?: number | null
          correo?: string | null
          created_at?: string | null
          departamento?: string | null
          direccion?: string | null
          direcciones?: string | null
          distrito?: string | null
          estado?: number | null
          id: number
          logo?: string | null
          provincia?: string | null
          razon_social?: string | null
          ruc?: string | null
          telefono?: string | null
          updated_at?: string | null
          web?: string | null
        }
        Update: {
          cod_unidad?: number | null
          correo?: string | null
          created_at?: string | null
          departamento?: string | null
          direccion?: string | null
          direcciones?: string | null
          distrito?: string | null
          estado?: number | null
          id?: number
          logo?: string | null
          provincia?: string | null
          razon_social?: string | null
          ruc?: string | null
          telefono?: string | null
          updated_at?: string | null
          web?: string | null
        }
        Relationships: []
      }
      facturaciones: {
        Row: {
          created_at: string | null
          detraccion: string | null
          factura: string | null
          fecha_factura: string | null
          forma_envio: string | null
          grr: string | null
          id: number
          id_ventas: number | null
          re_detraccion: string | null
          re_factura: string | null
          re_fecha_factura: string | null
          re_forma_envio: string | null
          re_grr: string | null
          re_retencion: string | null
          retencion: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          detraccion?: string | null
          factura?: string | null
          fecha_factura?: string | null
          forma_envio?: string | null
          grr?: string | null
          id: number
          id_ventas?: number | null
          re_detraccion?: string | null
          re_factura?: string | null
          re_fecha_factura?: string | null
          re_forma_envio?: string | null
          re_grr?: string | null
          re_retencion?: string | null
          retencion?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          detraccion?: string | null
          factura?: string | null
          fecha_factura?: string | null
          forma_envio?: string | null
          grr?: string | null
          id?: number
          id_ventas?: number | null
          re_detraccion?: string | null
          re_factura?: string | null
          re_fecha_factura?: string | null
          re_forma_envio?: string | null
          re_grr?: string | null
          re_retencion?: string | null
          retencion?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      historial_gestiones: {
        Row: {
          created_at: string | null
          descripcion: string | null
          fecha_gestion: string | null
          historial: string | null
          id: number
          id_seguimiento: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          fecha_gestion?: string | null
          historial?: string | null
          id: number
          id_seguimiento?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          fecha_gestion?: string | null
          historial?: string | null
          id?: number
          id_seguimiento?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      op_productos: {
        Row: {
          almacen: string | null
          cantidad: number | null
          codigo: string | null
          created_at: string | null
          descripcion: string | null
          id: number
          id_orden_pedido: number | null
          id_seguimiento: number | null
          medida: number | null
          p_cliente: string | null
          precio_unitario: number | null
          total: number | null
          updated_at: string | null
        }
        Insert: {
          almacen?: string | null
          cantidad?: number | null
          codigo?: string | null
          created_at?: string | null
          descripcion?: string | null
          id: number
          id_orden_pedido?: number | null
          id_seguimiento?: number | null
          medida?: number | null
          p_cliente?: string | null
          precio_unitario?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Update: {
          almacen?: string | null
          cantidad?: number | null
          codigo?: string | null
          created_at?: string | null
          descripcion?: string | null
          id?: number
          id_orden_pedido?: number | null
          id_seguimiento?: number | null
          medida?: number | null
          p_cliente?: string | null
          precio_unitario?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      orden_pedidos: {
        Row: {
          cargo_oea: string | null
          contacto_proveedor: string | null
          contacto_transporte: string | null
          cot_transporte: string | null
          created_at: string | null
          embalaje: string | null
          estado_op: number | null
          etiquetado: string | null
          fecha_despacho: string | null
          fecha_entrega: string | null
          fecha_orden_pedido: number | null
          fecha_programacion: string | null
          fecha_recepcion: string | null
          flete: string | null
          id: number
          id_empresa: number | null
          id_op: number | null
          id_proveedor: number | null
          id_seguimiento: number | null
          id_transporte: number | null
          nota_op: string | null
          nota_pago: string | null
          nota_pedido: number | null
          observaciones: string | null
          retorno_mercaderia: string | null
          t_departamento: string | null
          t_direccion: string | null
          t_distrito: string | null
          t_factura: string | null
          t_fecha_pago: string | null
          t_grt: string | null
          t_provincia: string | null
          tipo_envio: string | null
          tipo_pago: string | null
          total_proveedor: number | null
          transporte_nota: string | null
          updated_at: string | null
        }
        Insert: {
          cargo_oea?: string | null
          contacto_proveedor?: string | null
          contacto_transporte?: string | null
          cot_transporte?: string | null
          created_at?: string | null
          embalaje?: string | null
          estado_op?: number | null
          etiquetado?: string | null
          fecha_despacho?: string | null
          fecha_entrega?: string | null
          fecha_orden_pedido?: number | null
          fecha_programacion?: string | null
          fecha_recepcion?: string | null
          flete?: string | null
          id: number
          id_empresa?: number | null
          id_op?: number | null
          id_proveedor?: number | null
          id_seguimiento?: number | null
          id_transporte?: number | null
          nota_op?: string | null
          nota_pago?: string | null
          nota_pedido?: number | null
          observaciones?: string | null
          retorno_mercaderia?: string | null
          t_departamento?: string | null
          t_direccion?: string | null
          t_distrito?: string | null
          t_factura?: string | null
          t_fecha_pago?: string | null
          t_grt?: string | null
          t_provincia?: string | null
          tipo_envio?: string | null
          tipo_pago?: string | null
          total_proveedor?: number | null
          transporte_nota?: string | null
          updated_at?: string | null
        }
        Update: {
          cargo_oea?: string | null
          contacto_proveedor?: string | null
          contacto_transporte?: string | null
          cot_transporte?: string | null
          created_at?: string | null
          embalaje?: string | null
          estado_op?: number | null
          etiquetado?: string | null
          fecha_despacho?: string | null
          fecha_entrega?: string | null
          fecha_orden_pedido?: number | null
          fecha_programacion?: string | null
          fecha_recepcion?: string | null
          flete?: string | null
          id?: number
          id_empresa?: number | null
          id_op?: number | null
          id_proveedor?: number | null
          id_seguimiento?: number | null
          id_transporte?: number | null
          nota_op?: string | null
          nota_pago?: string | null
          nota_pedido?: number | null
          observaciones?: string | null
          retorno_mercaderia?: string | null
          t_departamento?: string | null
          t_direccion?: string | null
          t_distrito?: string | null
          t_factura?: string | null
          t_fecha_pago?: string | null
          t_grt?: string | null
          t_provincia?: string | null
          tipo_envio?: string | null
          tipo_pago?: string | null
          total_proveedor?: number | null
          transporte_nota?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      proveedores: {
        Row: {
          created_at: string | null
          departamento: string | null
          direccion: string | null
          distrito: string | null
          estado: number | null
          id: number
          monto: number | null
          provincia: string | null
          razon_social: string | null
          ruc: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          departamento?: string | null
          direccion?: string | null
          distrito?: string | null
          estado?: number | null
          id: number
          monto?: number | null
          provincia?: string | null
          razon_social?: string | null
          ruc?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          departamento?: string | null
          direccion?: string | null
          distrito?: string | null
          estado?: number | null
          id?: number
          monto?: number | null
          provincia?: string | null
          razon_social?: string | null
          ruc?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      saldo_proveedores: {
        Row: {
          banco: string | null
          created_at: string | null
          descripcion: string | null
          fecha_pago: string | null
          id: number
          id_proveedor: number | null
          monto: number | null
          tipo: string | null
          total: number | null
          updated_at: string | null
        }
        Insert: {
          banco?: string | null
          created_at?: string | null
          descripcion?: string | null
          fecha_pago?: string | null
          id: number
          id_proveedor?: number | null
          monto?: number | null
          tipo?: string | null
          total?: number | null
          updated_at?: string | null
        }
        Update: {
          banco?: string | null
          created_at?: string | null
          descripcion?: string | null
          fecha_pago?: string | null
          id?: number
          id_proveedor?: number | null
          monto?: number | null
          tipo?: string | null
          total?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      seguimientos: {
        Row: {
          cargo_entrega: string | null
          catalogo: string | null
          cdepartamento: string | null
          cdireccion: string | null
          cdistrito: string | null
          contacto_cliente: string | null
          contacto_cobrador: string | null
          cprovincia: string | null
          created_at: string | null
          creferencia: string | null
          detraccion: string | null
          estado_activo: number | null
          estado_facturacion: number | null
          estado_moroza: number | null
          estado_tesoreria: number | null
          etapa_siaf: string | null
          factura: string | null
          fecha_cobro: string | null
          fecha_emision: string | null
          fecha_entrega_oc: string | null
          fecha_factura: string | null
          fecha_form: string | null
          fecha_max_form: string | null
          fecha_peru_compras: string | null
          fecha_siaf: string | null
          fin_cobranza: string | null
          forma_envio: string | null
          grr: string | null
          id: number
          id_cliente: number | null
          id_empresa: number | null
          id_venta: number | null
          inicio_cobranza: string | null
          monto_detraccion: number | null
          monto_retencion: number | null
          monto_venta: number | null
          neto_cobrado: string | null
          nota_credito: string | null
          oce: string | null
          ocf: string | null
          op_proveedor: string | null
          penalidad: number | null
          peru_compras: string | null
          productos: string | null
          proxima_gestion: string | null
          re_detraccion: string | null
          re_factura: string | null
          re_fecha_factura: string | null
          re_forma_envio: string | null
          re_grr: string | null
          re_retencion: string | null
          retencion: string | null
          siaf: string | null
          updated_at: string | null
        }
        Insert: {
          cargo_entrega?: string | null
          catalogo?: string | null
          cdepartamento?: string | null
          cdireccion?: string | null
          cdistrito?: string | null
          contacto_cliente?: string | null
          contacto_cobrador?: string | null
          cprovincia?: string | null
          created_at?: string | null
          creferencia?: string | null
          detraccion?: string | null
          estado_activo?: number | null
          estado_facturacion?: number | null
          estado_moroza?: number | null
          estado_tesoreria?: number | null
          etapa_siaf?: string | null
          factura?: string | null
          fecha_cobro?: string | null
          fecha_emision?: string | null
          fecha_entrega_oc?: string | null
          fecha_factura?: string | null
          fecha_form?: string | null
          fecha_max_form?: string | null
          fecha_peru_compras?: string | null
          fecha_siaf?: string | null
          fin_cobranza?: string | null
          forma_envio?: string | null
          grr?: string | null
          id: number
          id_cliente?: number | null
          id_empresa?: number | null
          id_venta?: number | null
          inicio_cobranza?: string | null
          monto_detraccion?: number | null
          monto_retencion?: number | null
          monto_venta?: number | null
          neto_cobrado?: string | null
          nota_credito?: string | null
          oce?: string | null
          ocf?: string | null
          op_proveedor?: string | null
          penalidad?: number | null
          peru_compras?: string | null
          productos?: string | null
          proxima_gestion?: string | null
          re_detraccion?: string | null
          re_factura?: string | null
          re_fecha_factura?: string | null
          re_forma_envio?: string | null
          re_grr?: string | null
          re_retencion?: string | null
          retencion?: string | null
          siaf?: string | null
          updated_at?: string | null
        }
        Update: {
          cargo_entrega?: string | null
          catalogo?: string | null
          cdepartamento?: string | null
          cdireccion?: string | null
          cdistrito?: string | null
          contacto_cliente?: string | null
          contacto_cobrador?: string | null
          cprovincia?: string | null
          created_at?: string | null
          creferencia?: string | null
          detraccion?: string | null
          estado_activo?: number | null
          estado_facturacion?: number | null
          estado_moroza?: number | null
          estado_tesoreria?: number | null
          etapa_siaf?: string | null
          factura?: string | null
          fecha_cobro?: string | null
          fecha_emision?: string | null
          fecha_entrega_oc?: string | null
          fecha_factura?: string | null
          fecha_form?: string | null
          fecha_max_form?: string | null
          fecha_peru_compras?: string | null
          fecha_siaf?: string | null
          fin_cobranza?: string | null
          forma_envio?: string | null
          grr?: string | null
          id?: number
          id_cliente?: number | null
          id_empresa?: number | null
          id_venta?: number | null
          inicio_cobranza?: string | null
          monto_detraccion?: number | null
          monto_retencion?: number | null
          monto_venta?: number | null
          neto_cobrado?: string | null
          nota_credito?: string | null
          oce?: string | null
          ocf?: string | null
          op_proveedor?: string | null
          penalidad?: number | null
          peru_compras?: string | null
          productos?: string | null
          proxima_gestion?: string | null
          re_detraccion?: string | null
          re_factura?: string | null
          re_fecha_factura?: string | null
          re_forma_envio?: string | null
          re_grr?: string | null
          re_retencion?: string | null
          retencion?: string | null
          siaf?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tesoreria_registros: {
        Row: {
          banco: string | null
          created_at: string | null
          descripcion: string | null
          fecha_pago: string | null
          id: number
          id_orden_pedido: number | null
          id_seguimiento: number | null
          total: number | null
          updated_at: string | null
        }
        Insert: {
          banco?: string | null
          created_at?: string | null
          descripcion?: string | null
          fecha_pago?: string | null
          id: number
          id_orden_pedido?: number | null
          id_seguimiento?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Update: {
          banco?: string | null
          created_at?: string | null
          descripcion?: string | null
          fecha_pago?: string | null
          id?: number
          id_orden_pedido?: number | null
          id_seguimiento?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transportes: {
        Row: {
          cobertura: string | null
          created_at: string | null
          departamento: string | null
          direccion: string | null
          distrito: string | null
          estado: number | null
          id: number
          provincia: string | null
          razon_social: string | null
          ruc: string | null
          updated_at: string | null
        }
        Insert: {
          cobertura?: string | null
          created_at?: string | null
          departamento?: string | null
          direccion?: string | null
          distrito?: string | null
          estado?: number | null
          id: number
          provincia?: string | null
          razon_social?: string | null
          ruc?: string | null
          updated_at?: string | null
        }
        Update: {
          cobertura?: string | null
          created_at?: string | null
          departamento?: string | null
          direccion?: string | null
          distrito?: string | null
          estado?: number | null
          id?: number
          provincia?: string | null
          razon_social?: string | null
          ruc?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          apellido: number | null
          created_at: string | null
          email: string | null
          email_verified_at: string | null
          foto: string | null
          id: number
          name: string | null
          nombre: string | null
          password: string | null
          remember_token: string | null
          rol: string | null
          tabla: string | null
          updated_at: string | null
        }
        Insert: {
          apellido?: number | null
          created_at?: string | null
          email?: string | null
          email_verified_at?: string | null
          foto?: string | null
          id: number
          name?: string | null
          nombre?: string | null
          password?: string | null
          remember_token?: string | null
          rol?: string | null
          tabla?: string | null
          updated_at?: string | null
        }
        Update: {
          apellido?: number | null
          created_at?: string | null
          email?: string | null
          email_verified_at?: string | null
          foto?: string | null
          id?: number
          name?: string | null
          nombre?: string | null
          password?: string | null
          remember_token?: string | null
          rol?: string | null
          tabla?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
