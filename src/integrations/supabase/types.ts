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
      banco_proveedores: {
        Row: {
          created_at: string | null
          estado: boolean | null
          id: number
          nombre_banco: string | null
          numero_cuenta: string | null
          proveedor_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          estado?: boolean | null
          id?: number
          nombre_banco?: string | null
          numero_cuenta?: string | null
          proveedor_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          estado?: boolean | null
          id?: number
          nombre_banco?: string | null
          numero_cuenta?: string | null
          proveedor_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "banco_proveedores_proveedor_id_foreign"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["id"]
          },
        ]
      }
      catalogo_empresas: {
        Row: {
          codigo: string | null
          created_at: string | null
          empresa_id: number
          id: number
          updated_at: string | null
        }
        Insert: {
          codigo?: string | null
          created_at?: string | null
          empresa_id: number
          id?: number
          updated_at?: string | null
        }
        Update: {
          codigo?: string | null
          created_at?: string | null
          empresa_id?: number
          id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalogo_empresas_empresa_id_foreign"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          cod_unidad: string
          created_at: string | null
          departamento: string | null
          direccion: string | null
          distrito: string | null
          estado: boolean
          id: number
          provincia: string | null
          razon_social: string
          ruc: string
          updated_at: string | null
        }
        Insert: {
          cod_unidad: string
          created_at?: string | null
          departamento?: string | null
          direccion?: string | null
          distrito?: string | null
          estado?: boolean
          id?: number
          provincia?: string | null
          razon_social: string
          ruc: string
          updated_at?: string | null
        }
        Update: {
          cod_unidad?: string
          created_at?: string | null
          departamento?: string | null
          direccion?: string | null
          distrito?: string | null
          estado?: boolean
          id?: number
          provincia?: string | null
          razon_social?: string
          ruc?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cobranzas: {
        Row: {
          cliente_id: number
          created_at: string | null
          estado_id: number
          factura_id: number
          fecha_vencimiento: string
          id: number
          monto_pendiente: number
          monto_total: number
          observaciones: string | null
          updated_at: string | null
        }
        Insert: {
          cliente_id: number
          created_at?: string | null
          estado_id: number
          factura_id: number
          fecha_vencimiento: string
          id?: number
          monto_pendiente: number
          monto_total: number
          observaciones?: string | null
          updated_at?: string | null
        }
        Update: {
          cliente_id?: number
          created_at?: string | null
          estado_id?: number
          factura_id?: number
          fecha_vencimiento?: string
          id?: number
          monto_pendiente?: number
          monto_total?: number
          observaciones?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cobranzas_cliente_id_foreign"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobranzas_estado_id_foreign"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_cobranza"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobranzas_factura_id_foreign"
            columns: ["factura_id"]
            isOneToOne: false
            referencedRelation: "facturaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      contacto_clientes: {
        Row: {
          cargo: string | null
          cliente_id: number | null
          correo: string | null
          created_at: string | null
          estado: boolean
          id: number
          nombre: string | null
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          cargo?: string | null
          cliente_id?: number | null
          correo?: string | null
          created_at?: string | null
          estado?: boolean
          id?: number
          nombre?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          cargo?: string | null
          cliente_id?: number | null
          correo?: string | null
          created_at?: string | null
          estado?: boolean
          id?: number
          nombre?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacto_clientes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      contacto_proveedores: {
        Row: {
          cargo: string | null
          correo: string | null
          created_at: string | null
          estado: boolean
          id: number
          nombre: string | null
          proveedor_id: number | null
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          cargo?: string | null
          correo?: string | null
          created_at?: string | null
          estado?: boolean
          id?: number
          nombre?: string | null
          proveedor_id?: number | null
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          cargo?: string | null
          correo?: string | null
          created_at?: string | null
          estado?: boolean
          id?: number
          nombre?: string | null
          proveedor_id?: number | null
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
          estado: boolean
          id: number
          nombre: string | null
          telefono: string | null
          transporte_id: number | null
          updated_at: string | null
        }
        Insert: {
          cargo?: string | null
          correo?: string | null
          created_at?: string | null
          estado?: boolean
          id?: number
          nombre?: string | null
          telefono?: string | null
          transporte_id?: number | null
          updated_at?: string | null
        }
        Update: {
          cargo?: string | null
          correo?: string | null
          created_at?: string | null
          estado?: boolean
          id?: number
          nombre?: string | null
          telefono?: string | null
          transporte_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacto_transportes_transporte_id_fkey"
            columns: ["transporte_id"]
            isOneToOne: false
            referencedRelation: "transportes"
            referencedColumns: ["id"]
          },
        ]
      }
      cotizacion_productos: {
        Row: {
          cantidad: number | null
          cantidad_almacen: number | null
          cantidad_total: number | null
          codigo: string | null
          cotizacion_id: number
          created_at: string | null
          descripcion: string | null
          id: number
          p_cliente: number | null
          precio_unitario: number | null
          total: number | null
          unidad_medida: string | null
          updated_at: string | null
        }
        Insert: {
          cantidad?: number | null
          cantidad_almacen?: number | null
          cantidad_total?: number | null
          codigo?: string | null
          cotizacion_id: number
          created_at?: string | null
          descripcion?: string | null
          id?: number
          p_cliente?: number | null
          precio_unitario?: number | null
          total?: number | null
          unidad_medida?: string | null
          updated_at?: string | null
        }
        Update: {
          cantidad?: number | null
          cantidad_almacen?: number | null
          cantidad_total?: number | null
          codigo?: string | null
          cotizacion_id?: number
          created_at?: string | null
          descripcion?: string | null
          id?: number
          p_cliente?: number | null
          precio_unitario?: number | null
          total?: number | null
          unidad_medida?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cotizacion_productos_cotizacion_id_foreign"
            columns: ["cotizacion_id"]
            isOneToOne: false
            referencedRelation: "cotizaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      cotizaciones: {
        Row: {
          cliente_id: number | null
          codigo_cotizacion: string
          contacto_cliente_id: number | null
          created_at: string | null
          departamento_entrega: string | null
          direccion_entrega: string | null
          distrito_entrega: string | null
          empresa_id: number
          estado: Database["public"]["Enums"]["estado_cotizacion"] | null
          fecha_cotizacion: string | null
          fecha_entrega: string | null
          id: number
          monto_total: number | null
          nota_pago: string | null
          nota_pedido: string | null
          provincia_entrega: string | null
          referencia_entrega: string | null
          tipo_pago: string | null
          updated_at: string | null
        }
        Insert: {
          cliente_id?: number | null
          codigo_cotizacion: string
          contacto_cliente_id?: number | null
          created_at?: string | null
          departamento_entrega?: string | null
          direccion_entrega?: string | null
          distrito_entrega?: string | null
          empresa_id: number
          estado?: Database["public"]["Enums"]["estado_cotizacion"] | null
          fecha_cotizacion?: string | null
          fecha_entrega?: string | null
          id?: number
          monto_total?: number | null
          nota_pago?: string | null
          nota_pedido?: string | null
          provincia_entrega?: string | null
          referencia_entrega?: string | null
          tipo_pago?: string | null
          updated_at?: string | null
        }
        Update: {
          cliente_id?: number | null
          codigo_cotizacion?: string
          contacto_cliente_id?: number | null
          created_at?: string | null
          departamento_entrega?: string | null
          direccion_entrega?: string | null
          distrito_entrega?: string | null
          empresa_id?: number
          estado?: Database["public"]["Enums"]["estado_cotizacion"] | null
          fecha_cotizacion?: string | null
          fecha_entrega?: string | null
          id?: number
          monto_total?: number | null
          nota_pago?: string | null
          nota_pedido?: string | null
          provincia_entrega?: string | null
          referencia_entrega?: string | null
          tipo_pago?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cotizaciones_cliente_id_foreign"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cotizaciones_contacto_cliente_id_foreign"
            columns: ["contacto_cliente_id"]
            isOneToOne: false
            referencedRelation: "contacto_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cotizaciones_empresa_id_foreign"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          cod_unidad: string | null
          correo: string | null
          created_at: string | null
          departamento: string | null
          direccion: string | null
          direcciones: string | null
          distrito: string | null
          estado: boolean
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
          cod_unidad?: string | null
          correo?: string | null
          created_at?: string | null
          departamento?: string | null
          direccion?: string | null
          direcciones?: string | null
          distrito?: string | null
          estado?: boolean
          id?: number
          logo?: string | null
          provincia?: string | null
          razon_social?: string | null
          ruc?: string | null
          telefono?: string | null
          updated_at?: string | null
          web?: string | null
        }
        Update: {
          cod_unidad?: string | null
          correo?: string | null
          created_at?: string | null
          departamento?: string | null
          direccion?: string | null
          direcciones?: string | null
          distrito?: string | null
          estado?: boolean
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
      estados_cobranza: {
        Row: {
          created_at: string | null
          descripcion: string | null
          id: number
          nombre: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          id?: number
          nombre: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          id?: number
          nombre?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      facturaciones: {
        Row: {
          created_at: string | null
          detraccion: number | null
          estado: number | null
          factura: string | null
          fecha_factura: string | null
          forma_envio_factura: string | null
          grr: string | null
          id: number
          orden_compra_id: number
          retencion: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          detraccion?: number | null
          estado?: number | null
          factura?: string | null
          fecha_factura?: string | null
          forma_envio_factura?: string | null
          grr?: string | null
          id?: number
          orden_compra_id: number
          retencion?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          detraccion?: number | null
          estado?: number | null
          factura?: string | null
          fecha_factura?: string | null
          forma_envio_factura?: string | null
          grr?: string | null
          id?: number
          orden_compra_id?: number
          retencion?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "facturaciones_orden_compra_id_foreign"
            columns: ["orden_compra_id"]
            isOneToOne: false
            referencedRelation: "ordenes_compra"
            referencedColumns: ["id"]
          },
        ]
      }
      gestion_cobranzas: {
        Row: {
          created_at: string | null
          descripcion: string | null
          documento_url: string | null
          estado: number | null
          fecha_gestion: string | null
          historial: string | null
          id: number
          orden_compra_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          documento_url?: string | null
          estado?: number | null
          fecha_gestion?: string | null
          historial?: string | null
          id?: number
          orden_compra_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          documento_url?: string | null
          estado?: number | null
          fecha_gestion?: string | null
          historial?: string | null
          id?: number
          orden_compra_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gestion_cobranzas_orden_compra_id_foreign"
            columns: ["orden_compra_id"]
            isOneToOne: false
            referencedRelation: "ordenes_compra"
            referencedColumns: ["id"]
          },
        ]
      }
      gestiones_cobranza: {
        Row: {
          cobranza_id: number
          created_at: string | null
          detalle: string
          fecha_gestion: string
          id: number
          monto_cobrado: number
          proxima_gestion: string | null
          resultado: string
          tipo_gestion: string
          updated_at: string | null
          user_id: number
        }
        Insert: {
          cobranza_id: number
          created_at?: string | null
          detalle: string
          fecha_gestion: string
          id?: number
          monto_cobrado?: number
          proxima_gestion?: string | null
          resultado: string
          tipo_gestion: string
          updated_at?: string | null
          user_id: number
        }
        Update: {
          cobranza_id?: number
          created_at?: string | null
          detalle?: string
          fecha_gestion?: string
          id?: number
          monto_cobrado?: number
          proxima_gestion?: string | null
          resultado?: string
          tipo_gestion?: string
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "gestiones_cobranza_cobranza_id_foreign"
            columns: ["cobranza_id"]
            isOneToOne: false
            referencedRelation: "cobranzas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gestiones_cobranza_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      historial_gestiones: {
        Row: {
          created_at: string | null
          descripcion: string | null
          fecha_gestion: string | null
          historial: string | null
          id: number
          orden_compra_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          fecha_gestion?: string | null
          historial?: string | null
          id?: number
          orden_compra_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          fecha_gestion?: string | null
          historial?: string | null
          id?: number
          orden_compra_id?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ordenes_compra: {
        Row: {
          archivo_oc: string | null
          cargo_entrega: number | null
          catalogo: string | null
          catalogo_empresa_id: number | null
          cliente_id: number | null
          codigo_venta: string
          contacto_cliente_id: number | null
          contacto_cobrador: number | null
          contacto_transporte_id: number | null
          cot_transporte: string | null
          created_at: string | null
          departamento_entrega: string | null
          detraccion: number | null
          direccion_entrega: string | null
          distrito_entrega: string | null
          documento_oce: string | null
          documento_ocf: string | null
          documento_peru_compras: string | null
          empresa_id: number | null
          estado_activo: number | null
          estado_cobranza: string | null
          estado_facturacion: string | null
          estado_moroza: string | null
          estado_tesoreria: string | null
          etapa_actual: string
          etapa_siaf: string | null
          factura: string | null
          fecha_cobro: string | null
          fecha_emision: string | null
          fecha_entrega: string | null
          fecha_entrega_oc: string | null
          fecha_estado_cobranza: string | null
          fecha_factura: string | null
          fecha_form: string | null
          fecha_max_form: string | null
          fecha_orden_pedido: string | null
          fecha_peru_compras: string | null
          fecha_programacion: string | null
          fecha_proxima_gestion: string | null
          fecha_siaf: string | null
          fin_cobranza: string | null
          flete: number | null
          forma_envio: string | null
          grr: string | null
          id: number
          inicio_cobranza: string | null
          monto_detraccion: number | null
          monto_retencion: number | null
          monto_venta: number | null
          neto_cobrado: number | null
          nota_credito: string | null
          nota_op: string | null
          op_proveedor: string | null
          orden_compra_id: number | null
          penalidad: number | null
          productos: Json | null
          provincia_entrega: string | null
          proxima_gestion: string | null
          re_detraccion: number | null
          re_factura: string | null
          re_fecha_factura: string | null
          re_forma_envio: string | null
          re_grr: string | null
          re_retencion: number | null
          referencia_entrega: string | null
          retencion: number | null
          siaf: string | null
          t_departamento: string | null
          t_direccion: string | null
          t_distrito: string | null
          t_factura: string | null
          t_fecha_pago: string | null
          t_grt: string | null
          t_provincia: string | null
          tipo_envio: string | null
          transporte_id: number | null
          transporte_nota: string | null
          updated_at: string | null
          venta_privada: boolean
        }
        Insert: {
          archivo_oc?: string | null
          cargo_entrega?: number | null
          catalogo?: string | null
          catalogo_empresa_id?: number | null
          cliente_id?: number | null
          codigo_venta: string
          contacto_cliente_id?: number | null
          contacto_cobrador?: number | null
          contacto_transporte_id?: number | null
          cot_transporte?: string | null
          created_at?: string | null
          departamento_entrega?: string | null
          detraccion?: number | null
          direccion_entrega?: string | null
          distrito_entrega?: string | null
          documento_oce?: string | null
          documento_ocf?: string | null
          documento_peru_compras?: string | null
          empresa_id?: number | null
          estado_activo?: number | null
          estado_cobranza?: string | null
          estado_facturacion?: string | null
          estado_moroza?: string | null
          estado_tesoreria?: string | null
          etapa_actual?: string
          etapa_siaf?: string | null
          factura?: string | null
          fecha_cobro?: string | null
          fecha_emision?: string | null
          fecha_entrega?: string | null
          fecha_entrega_oc?: string | null
          fecha_estado_cobranza?: string | null
          fecha_factura?: string | null
          fecha_form?: string | null
          fecha_max_form?: string | null
          fecha_orden_pedido?: string | null
          fecha_peru_compras?: string | null
          fecha_programacion?: string | null
          fecha_proxima_gestion?: string | null
          fecha_siaf?: string | null
          fin_cobranza?: string | null
          flete?: number | null
          forma_envio?: string | null
          grr?: string | null
          id?: number
          inicio_cobranza?: string | null
          monto_detraccion?: number | null
          monto_retencion?: number | null
          monto_venta?: number | null
          neto_cobrado?: number | null
          nota_credito?: string | null
          nota_op?: string | null
          op_proveedor?: string | null
          orden_compra_id?: number | null
          penalidad?: number | null
          productos?: Json | null
          provincia_entrega?: string | null
          proxima_gestion?: string | null
          re_detraccion?: number | null
          re_factura?: string | null
          re_fecha_factura?: string | null
          re_forma_envio?: string | null
          re_grr?: string | null
          re_retencion?: number | null
          referencia_entrega?: string | null
          retencion?: number | null
          siaf?: string | null
          t_departamento?: string | null
          t_direccion?: string | null
          t_distrito?: string | null
          t_factura?: string | null
          t_fecha_pago?: string | null
          t_grt?: string | null
          t_provincia?: string | null
          tipo_envio?: string | null
          transporte_id?: number | null
          transporte_nota?: string | null
          updated_at?: string | null
          venta_privada?: boolean
        }
        Update: {
          archivo_oc?: string | null
          cargo_entrega?: number | null
          catalogo?: string | null
          catalogo_empresa_id?: number | null
          cliente_id?: number | null
          codigo_venta?: string
          contacto_cliente_id?: number | null
          contacto_cobrador?: number | null
          contacto_transporte_id?: number | null
          cot_transporte?: string | null
          created_at?: string | null
          departamento_entrega?: string | null
          detraccion?: number | null
          direccion_entrega?: string | null
          distrito_entrega?: string | null
          documento_oce?: string | null
          documento_ocf?: string | null
          documento_peru_compras?: string | null
          empresa_id?: number | null
          estado_activo?: number | null
          estado_cobranza?: string | null
          estado_facturacion?: string | null
          estado_moroza?: string | null
          estado_tesoreria?: string | null
          etapa_actual?: string
          etapa_siaf?: string | null
          factura?: string | null
          fecha_cobro?: string | null
          fecha_emision?: string | null
          fecha_entrega?: string | null
          fecha_entrega_oc?: string | null
          fecha_estado_cobranza?: string | null
          fecha_factura?: string | null
          fecha_form?: string | null
          fecha_max_form?: string | null
          fecha_orden_pedido?: string | null
          fecha_peru_compras?: string | null
          fecha_programacion?: string | null
          fecha_proxima_gestion?: string | null
          fecha_siaf?: string | null
          fin_cobranza?: string | null
          flete?: number | null
          forma_envio?: string | null
          grr?: string | null
          id?: number
          inicio_cobranza?: string | null
          monto_detraccion?: number | null
          monto_retencion?: number | null
          monto_venta?: number | null
          neto_cobrado?: number | null
          nota_credito?: string | null
          nota_op?: string | null
          op_proveedor?: string | null
          orden_compra_id?: number | null
          penalidad?: number | null
          productos?: Json | null
          provincia_entrega?: string | null
          proxima_gestion?: string | null
          re_detraccion?: number | null
          re_factura?: string | null
          re_fecha_factura?: string | null
          re_forma_envio?: string | null
          re_grr?: string | null
          re_retencion?: number | null
          referencia_entrega?: string | null
          retencion?: number | null
          siaf?: string | null
          t_departamento?: string | null
          t_direccion?: string | null
          t_distrito?: string | null
          t_factura?: string | null
          t_fecha_pago?: string | null
          t_grt?: string | null
          t_provincia?: string | null
          tipo_envio?: string | null
          transporte_id?: number | null
          transporte_nota?: string | null
          updated_at?: string | null
          venta_privada?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "ordenes_compra_catalogo_empresa_id_foreign"
            columns: ["catalogo_empresa_id"]
            isOneToOne: false
            referencedRelation: "catalogo_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordenes_compra_cliente_id_foreign"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordenes_compra_contacto_cliente_id_foreign"
            columns: ["contacto_cliente_id"]
            isOneToOne: false
            referencedRelation: "contacto_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordenes_compra_empresa_id_foreign"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      ordenes_compra_privadas: {
        Row: {
          cliente_id: number | null
          contacto_cliente_id: number | null
          created_at: string | null
          documento_pago: string | null
          estado_pago: string | null
          fecha_pago: string | null
          id: number
          orden_compra_id: number
          updated_at: string | null
        }
        Insert: {
          cliente_id?: number | null
          contacto_cliente_id?: number | null
          created_at?: string | null
          documento_pago?: string | null
          estado_pago?: string | null
          fecha_pago?: string | null
          id?: number
          orden_compra_id: number
          updated_at?: string | null
        }
        Update: {
          cliente_id?: number | null
          contacto_cliente_id?: number | null
          created_at?: string | null
          documento_pago?: string | null
          estado_pago?: string | null
          fecha_pago?: string | null
          id?: number
          orden_compra_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ordenes_compra_privadas_cliente_id_foreign"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordenes_compra_privadas_contacto_cliente_id_foreign"
            columns: ["contacto_cliente_id"]
            isOneToOne: false
            referencedRelation: "contacto_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordenes_compra_privadas_orden_compra_id_foreign"
            columns: ["orden_compra_id"]
            isOneToOne: false
            referencedRelation: "ordenes_compra"
            referencedColumns: ["id"]
          },
        ]
      }
      ordenes_proveedor: {
        Row: {
          activo: boolean
          cargo_oea: string | null
          codigo_op: string
          contacto_proveedor_id: number | null
          created_at: string | null
          embalaje: string | null
          empresa_id: number | null
          estado_op: string | null
          etiquetado: string | null
          fecha_despacho: string | null
          fecha_entrega: string | null
          fecha_programada: string | null
          fecha_recepcion: string | null
          id: number
          nota_adicional: string | null
          nota_gestion_op: string | null
          nota_pago: string | null
          nota_pedido: string | null
          observaciones: string | null
          proveedor_id: number | null
          retorno_mercaderia: string | null
          tipo_entrega: string | null
          tipo_pago: string | null
          total_proveedor: number | null
          updated_at: string | null
        }
        Insert: {
          activo?: boolean
          cargo_oea?: string | null
          codigo_op: string
          contacto_proveedor_id?: number | null
          created_at?: string | null
          embalaje?: string | null
          empresa_id?: number | null
          estado_op?: string | null
          etiquetado?: string | null
          fecha_despacho?: string | null
          fecha_entrega?: string | null
          fecha_programada?: string | null
          fecha_recepcion?: string | null
          id?: number
          nota_adicional?: string | null
          nota_gestion_op?: string | null
          nota_pago?: string | null
          nota_pedido?: string | null
          observaciones?: string | null
          proveedor_id?: number | null
          retorno_mercaderia?: string | null
          tipo_entrega?: string | null
          tipo_pago?: string | null
          total_proveedor?: number | null
          updated_at?: string | null
        }
        Update: {
          activo?: boolean
          cargo_oea?: string | null
          codigo_op?: string
          contacto_proveedor_id?: number | null
          created_at?: string | null
          embalaje?: string | null
          empresa_id?: number | null
          estado_op?: string | null
          etiquetado?: string | null
          fecha_despacho?: string | null
          fecha_entrega?: string | null
          fecha_programada?: string | null
          fecha_recepcion?: string | null
          id?: number
          nota_adicional?: string | null
          nota_gestion_op?: string | null
          nota_pago?: string | null
          nota_pedido?: string | null
          observaciones?: string | null
          proveedor_id?: number | null
          retorno_mercaderia?: string | null
          tipo_entrega?: string | null
          tipo_pago?: string | null
          total_proveedor?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ordenes_proveedor_contacto_proveedor_id_foreign"
            columns: ["contacto_proveedor_id"]
            isOneToOne: false
            referencedRelation: "contacto_proveedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordenes_proveedor_empresa_id_foreign"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordenes_proveedor_proveedor_id_foreign"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["id"]
          },
        ]
      }
      pagos_ordenes_compra_privadas: {
        Row: {
          archivo_pago: string | null
          banco_pago: string | null
          created_at: string | null
          descripcion_pago: string | null
          estado_pago: boolean
          fecha_pago: string | null
          id: number
          monto_pago: number | null
          orden_compra_privada_id: number
          updated_at: string | null
        }
        Insert: {
          archivo_pago?: string | null
          banco_pago?: string | null
          created_at?: string | null
          descripcion_pago?: string | null
          estado_pago?: boolean
          fecha_pago?: string | null
          id?: number
          monto_pago?: number | null
          orden_compra_privada_id: number
          updated_at?: string | null
        }
        Update: {
          archivo_pago?: string | null
          banco_pago?: string | null
          created_at?: string | null
          descripcion_pago?: string | null
          estado_pago?: boolean
          fecha_pago?: string | null
          id?: number
          monto_pago?: number | null
          orden_compra_privada_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pagos_ordenes_compra_privadas_orden_compra_privada_id_foreign"
            columns: ["orden_compra_privada_id"]
            isOneToOne: false
            referencedRelation: "ordenes_compra_privadas"
            referencedColumns: ["id"]
          },
        ]
      }
      pagos_ordenes_proveedor: {
        Row: {
          activo: boolean
          archivo_pago: string | null
          banco_pago: string | null
          created_at: string | null
          descripcion_pago: string | null
          estado_pago: boolean
          fecha_pago: string | null
          id: number
          monto_pago: number | null
          orden_proveedor_id: number | null
          updated_at: string | null
        }
        Insert: {
          activo?: boolean
          archivo_pago?: string | null
          banco_pago?: string | null
          created_at?: string | null
          descripcion_pago?: string | null
          estado_pago?: boolean
          fecha_pago?: string | null
          id?: number
          monto_pago?: number | null
          orden_proveedor_id?: number | null
          updated_at?: string | null
        }
        Update: {
          activo?: boolean
          archivo_pago?: string | null
          banco_pago?: string | null
          created_at?: string | null
          descripcion_pago?: string | null
          estado_pago?: boolean
          fecha_pago?: string | null
          id?: number
          monto_pago?: number | null
          orden_proveedor_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pagos_ordenes_proveedor_orden_proveedor_id_foreign"
            columns: ["orden_proveedor_id"]
            isOneToOne: false
            referencedRelation: "ordenes_proveedor"
            referencedColumns: ["id"]
          },
        ]
      }
      pagos_transportes_asignados: {
        Row: {
          activo: boolean
          archivo_pago: string | null
          banco_pago: string | null
          created_at: string | null
          descripcion_pago: string | null
          estado_pago: boolean
          fecha_pago: string | null
          id: number
          monto_pago: number | null
          transporte_asignado_id: number
          updated_at: string | null
        }
        Insert: {
          activo?: boolean
          archivo_pago?: string | null
          banco_pago?: string | null
          created_at?: string | null
          descripcion_pago?: string | null
          estado_pago?: boolean
          fecha_pago?: string | null
          id?: number
          monto_pago?: number | null
          transporte_asignado_id: number
          updated_at?: string | null
        }
        Update: {
          activo?: boolean
          archivo_pago?: string | null
          banco_pago?: string | null
          created_at?: string | null
          descripcion_pago?: string | null
          estado_pago?: boolean
          fecha_pago?: string | null
          id?: number
          monto_pago?: number | null
          transporte_asignado_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pagos_transportes_asignados_transporte_asignado_id_foreign"
            columns: ["transporte_asignado_id"]
            isOneToOne: false
            referencedRelation: "transportes_asignados"
            referencedColumns: ["id"]
          },
        ]
      }
      permisos_configuraciones: {
        Row: {
          created_at: string | null
          id: number
          nombre: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          nombre: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          nombre?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      permisos_procesos: {
        Row: {
          created_at: string | null
          id: number
          nombre: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          nombre: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          nombre?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      producto_stock: {
        Row: {
          almacen: string | null
          categoria: string | null
          codigo: string | null
          created_at: string | null
          descripcion: string | null
          foto: string | null
          id: number
          isActive: boolean | null
          marca: string | null
          stock: number | null
          updated_at: string | null
        }
        Insert: {
          almacen?: string | null
          categoria?: string | null
          codigo?: string | null
          created_at?: string | null
          descripcion?: string | null
          foto?: string | null
          id?: number
          isActive?: boolean | null
          marca?: string | null
          stock?: number | null
          updated_at?: string | null
        }
        Update: {
          almacen?: string | null
          categoria?: string | null
          codigo?: string | null
          created_at?: string | null
          descripcion?: string | null
          foto?: string | null
          id?: number
          isActive?: boolean | null
          marca?: string | null
          stock?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      productos_ordenes_proveedor: {
        Row: {
          almacen: number | null
          cantidad: number | null
          cantidad_almacen: number | null
          cantidad_total: number | null
          codigo: string | null
          created_at: string | null
          descripcion: string | null
          id: number
          id_orden_pedido: string | null
          id_seguimiento: string | null
          orden_proveedor_id: number | null
          p_cliente: number | null
          precio_unitario: number | null
          total: number | null
          unidad_medida: string | null
          updated_at: string | null
        }
        Insert: {
          almacen?: number | null
          cantidad?: number | null
          cantidad_almacen?: number | null
          cantidad_total?: number | null
          codigo?: string | null
          created_at?: string | null
          descripcion?: string | null
          id?: number
          id_orden_pedido?: string | null
          id_seguimiento?: string | null
          orden_proveedor_id?: number | null
          p_cliente?: number | null
          precio_unitario?: number | null
          total?: number | null
          unidad_medida?: string | null
          updated_at?: string | null
        }
        Update: {
          almacen?: number | null
          cantidad?: number | null
          cantidad_almacen?: number | null
          cantidad_total?: number | null
          codigo?: string | null
          created_at?: string | null
          descripcion?: string | null
          id?: number
          id_orden_pedido?: string | null
          id_seguimiento?: string | null
          orden_proveedor_id?: number | null
          p_cliente?: number | null
          precio_unitario?: number | null
          total?: number | null
          unidad_medida?: string | null
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
          estado: boolean
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
          estado?: boolean
          id?: number
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
          estado?: boolean
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
          monto: number | null
          proveedor_id: number | null
          tipo: string | null
          total: number | null
          updated_at: string | null
        }
        Insert: {
          banco?: string | null
          created_at?: string | null
          descripcion?: string | null
          fecha_pago?: string | null
          id?: number
          monto?: number | null
          proveedor_id?: number | null
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
          monto?: number | null
          proveedor_id?: number | null
          tipo?: string | null
          total?: number | null
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
          orden_compra_id: number | null
          orden_proveedor_id: number | null
          total: number | null
          updated_at: string | null
        }
        Insert: {
          banco?: string | null
          created_at?: string | null
          descripcion?: string | null
          fecha_pago?: string | null
          id?: number
          orden_compra_id?: number | null
          orden_proveedor_id?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Update: {
          banco?: string | null
          created_at?: string | null
          descripcion?: string | null
          fecha_pago?: string | null
          id?: number
          orden_compra_id?: number | null
          orden_proveedor_id?: number | null
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
          estado: boolean
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
          estado?: boolean
          id?: number
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
          estado?: boolean
          id?: number
          provincia?: string | null
          razon_social?: string | null
          ruc?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transportes_asignados: {
        Row: {
          codigo_transporte: string
          contacto_transporte_id: number
          cotizacion_transporte: string | null
          created_at: string | null
          destino: string
          direccion: string
          distrito: string
          estado_pago: string | null
          grt: string | null
          id: number
          monto_flete: number
          nota_transporte: string | null
          orden_proveedor_id: number
          provincia: string
          region: string
          transporte_id: number
          updated_at: string | null
        }
        Insert: {
          codigo_transporte: string
          contacto_transporte_id: number
          cotizacion_transporte?: string | null
          created_at?: string | null
          destino: string
          direccion: string
          distrito: string
          estado_pago?: string | null
          grt?: string | null
          id?: number
          monto_flete: number
          nota_transporte?: string | null
          orden_proveedor_id: number
          provincia: string
          region: string
          transporte_id: number
          updated_at?: string | null
        }
        Update: {
          codigo_transporte?: string
          contacto_transporte_id?: number
          cotizacion_transporte?: string | null
          created_at?: string | null
          destino?: string
          direccion?: string
          distrito?: string
          estado_pago?: string | null
          grt?: string | null
          id?: number
          monto_flete?: number
          nota_transporte?: string | null
          orden_proveedor_id?: number
          provincia?: string
          region?: string
          transporte_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transportes_asignados_contacto_transporte_id_foreign"
            columns: ["contacto_transporte_id"]
            isOneToOne: false
            referencedRelation: "contacto_transportes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transportes_asignados_orden_proveedor_id_foreign"
            columns: ["orden_proveedor_id"]
            isOneToOne: false
            referencedRelation: "ordenes_proveedor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transportes_asignados_transporte_id_foreign"
            columns: ["transporte_id"]
            isOneToOne: false
            referencedRelation: "transportes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permiso_configuracion: {
        Row: {
          permiso_configuracion_id: number
          user_id: number
        }
        Insert: {
          permiso_configuracion_id: number
          user_id: number
        }
        Update: {
          permiso_configuracion_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_permiso_configuracion_permiso_configuracion_id_foreign"
            columns: ["permiso_configuracion_id"]
            isOneToOne: false
            referencedRelation: "permisos_configuraciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permiso_configuracion_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permiso_proceso: {
        Row: {
          permiso_proceso_id: number
          user_id: number
        }
        Insert: {
          permiso_proceso_id: number
          user_id: number
        }
        Update: {
          permiso_proceso_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_permiso_proceso_permiso_proceso_id_foreign"
            columns: ["permiso_proceso_id"]
            isOneToOne: false
            referencedRelation: "permisos_procesos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permiso_proceso_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          apellido: string | null
          created_at: string | null
          email: string | null
          email_verified_at: string | null
          foto: string | null
          id: number
          nombre: string | null
          password: string
          remember_token: string | null
          rol: Database["public"]["Enums"]["user_role"]
          tabla: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          apellido?: string | null
          created_at?: string | null
          email?: string | null
          email_verified_at?: string | null
          foto?: string | null
          id?: number
          nombre?: string | null
          password: string
          remember_token?: string | null
          rol?: Database["public"]["Enums"]["user_role"]
          tabla?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          apellido?: string | null
          created_at?: string | null
          email?: string | null
          email_verified_at?: string | null
          foto?: string | null
          id?: number
          nombre?: string | null
          password?: string
          remember_token?: string | null
          rol?: Database["public"]["Enums"]["user_role"]
          tabla?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_catalogo_id_from_codigo: {
        Args: { p_catalogo_codigo: string }
        Returns: number
      }
    }
    Enums: {
      estado_cotizacion: "Aprobado" | "Rechazado" | "Enviado"
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      estado_cotizacion: ["Aprobado", "Rechazado", "Enviado"],
      user_role: ["admin", "user"],
    },
  },
} as const
