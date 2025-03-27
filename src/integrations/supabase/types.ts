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
          id_proveedor: number
          nombre_banco: string | null
          numero_cuenta: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          estado?: boolean | null
          id?: number
          id_proveedor: number
          nombre_banco?: string | null
          numero_cuenta?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          estado?: boolean | null
          id?: number
          id_proveedor?: number
          nombre_banco?: string | null
          numero_cuenta?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cache: {
        Row: {
          expiration: number
          key: string
          value: string
        }
        Insert: {
          expiration: number
          key: string
          value: string
        }
        Update: {
          expiration?: number
          key?: string
          value?: string
        }
        Relationships: []
      }
      cache_locks: {
        Row: {
          expiration: number
          key: string
          owner: string
        }
        Insert: {
          expiration: number
          key: string
          owner: string
        }
        Update: {
          expiration?: number
          key?: string
          owner?: string
        }
        Relationships: []
      }
      catalogo_empresas: {
        Row: {
          codigo: string | null
          created_at: string | null
          id: number
          id_empresa: number
          updated_at: string | null
        }
        Insert: {
          codigo?: string | null
          created_at?: string | null
          id?: number
          id_empresa: number
          updated_at?: string | null
        }
        Update: {
          codigo?: string | null
          created_at?: string | null
          id?: number
          id_empresa?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      clientes: {
        Row: {
          cod_unidad: string
          created_at: string | null
          departamento: string | null
          direccion: string | null
          distrito: string | null
          estado: boolean | null
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
          estado?: boolean | null
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
          estado?: boolean | null
          id?: number
          provincia?: string | null
          razon_social?: string
          ruc?: string
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
          id?: number
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
      contacto_proveedores: {
        Row: {
          cargo: string | null
          correo: string | null
          created_at: string | null
          estado: number | null
          id: number
          id_proveedor: number | null
          nombre: string | null
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          cargo?: string | null
          correo?: string | null
          created_at?: string | null
          estado?: number | null
          id?: number
          id_proveedor?: number | null
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
          id_proveedor?: number | null
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
          id_transporte: number | null
          nombre: string | null
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          cargo?: string | null
          correo?: string | null
          created_at?: string | null
          estado?: number | null
          id?: number
          id_transporte?: number | null
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
          id_transporte?: number | null
          nombre?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
          precio_unitario?: number | null
          total?: number | null
          unidad_medida?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cotizaciones: {
        Row: {
          cliente_id: number | null
          codigo_cotizacion: string
          contacto_cliente_id: number | null
          created_at: string | null
          direccion: string | null
          distrito: string | null
          empresa_id: number
          estado: string | null
          fecha_cotizacion: string
          fecha_entrega: string
          id: number
          monto_total: number | null
          nota_pago: string | null
          nota_pedido: string | null
          provincia: string | null
          referencia: string | null
          region: string | null
          tipo_pago: string | null
          updated_at: string | null
        }
        Insert: {
          cliente_id?: number | null
          codigo_cotizacion: string
          contacto_cliente_id?: number | null
          created_at?: string | null
          direccion?: string | null
          distrito?: string | null
          empresa_id: number
          estado?: string | null
          fecha_cotizacion: string
          fecha_entrega: string
          id?: number
          monto_total?: number | null
          nota_pago?: string | null
          nota_pedido?: string | null
          provincia?: string | null
          referencia?: string | null
          region?: string | null
          tipo_pago?: string | null
          updated_at?: string | null
        }
        Update: {
          cliente_id?: number | null
          codigo_cotizacion?: string
          contacto_cliente_id?: number | null
          created_at?: string | null
          direccion?: string | null
          distrito?: string | null
          empresa_id?: number
          estado?: string | null
          fecha_cotizacion?: string
          fecha_entrega?: string
          id?: number
          monto_total?: number | null
          nota_pago?: string | null
          nota_pedido?: string | null
          provincia?: string | null
          referencia?: string | null
          region?: string | null
          tipo_pago?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
          cod_unidad?: string | null
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
        Update: {
          cod_unidad?: string | null
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
        Relationships: []
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
        Relationships: []
      }
      migrations: {
        Row: {
          batch: number
          id: number
          migration: string
        }
        Insert: {
          batch: number
          id?: number
          migration: string
        }
        Update: {
          batch?: number
          id?: number
          migration?: string
        }
        Relationships: []
      }
      ordenes_compra: {
        Row: {
          archivo_oc: string | null
          catalogo_empresa_id: number | null
          cliente_id: number | null
          codigo_venta: string
          contacto_cliente_id: number | null
          created_at: string | null
          direccion: string | null
          distrito: string | null
          documento_oce: string | null
          documento_ocf: string | null
          documento_peru_compras: string | null
          empresa_id: number | null
          estado_activo: boolean
          estado_cobranza: string | null
          etapa_actual: string
          etapa_siaf: string | null
          fecha_emision: string | null
          fecha_entrega: string | null
          fecha_entrega_oc: string | null
          fecha_estado_cobranza: string | null
          fecha_form: string | null
          fecha_max_form: string | null
          fecha_peru_compras: string | null
          fecha_proxima_gestion: string | null
          fecha_siaf: string | null
          id: number
          monto_venta: number | null
          neto_cobrado: number | null
          penalidad: number | null
          productos: Json | null
          provincia: string | null
          referencia: string | null
          region: string | null
          siaf: string | null
          updated_at: string | null
          venta_privada: boolean
        }
        Insert: {
          archivo_oc?: string | null
          catalogo_empresa_id?: number | null
          cliente_id?: number | null
          codigo_venta: string
          contacto_cliente_id?: number | null
          created_at?: string | null
          direccion?: string | null
          distrito?: string | null
          documento_oce?: string | null
          documento_ocf?: string | null
          documento_peru_compras?: string | null
          empresa_id?: number | null
          estado_activo?: boolean
          estado_cobranza?: string | null
          etapa_actual?: string
          etapa_siaf?: string | null
          fecha_emision?: string | null
          fecha_entrega?: string | null
          fecha_entrega_oc?: string | null
          fecha_estado_cobranza?: string | null
          fecha_form?: string | null
          fecha_max_form?: string | null
          fecha_peru_compras?: string | null
          fecha_proxima_gestion?: string | null
          fecha_siaf?: string | null
          id?: number
          monto_venta?: number | null
          neto_cobrado?: number | null
          penalidad?: number | null
          productos?: Json | null
          provincia?: string | null
          referencia?: string | null
          region?: string | null
          siaf?: string | null
          updated_at?: string | null
          venta_privada?: boolean
        }
        Update: {
          archivo_oc?: string | null
          catalogo_empresa_id?: number | null
          cliente_id?: number | null
          codigo_venta?: string
          contacto_cliente_id?: number | null
          created_at?: string | null
          direccion?: string | null
          distrito?: string | null
          documento_oce?: string | null
          documento_ocf?: string | null
          documento_peru_compras?: string | null
          empresa_id?: number | null
          estado_activo?: boolean
          estado_cobranza?: string | null
          etapa_actual?: string
          etapa_siaf?: string | null
          fecha_emision?: string | null
          fecha_entrega?: string | null
          fecha_entrega_oc?: string | null
          fecha_estado_cobranza?: string | null
          fecha_form?: string | null
          fecha_max_form?: string | null
          fecha_peru_compras?: string | null
          fecha_proxima_gestion?: string | null
          fecha_siaf?: string | null
          id?: number
          monto_venta?: number | null
          neto_cobrado?: number | null
          penalidad?: number | null
          productos?: Json | null
          provincia?: string | null
          referencia?: string | null
          region?: string | null
          siaf?: string | null
          updated_at?: string | null
          venta_privada?: boolean
        }
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
          isactive: boolean | null
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
          isactive?: boolean | null
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
          isactive?: boolean | null
          marca?: string | null
          stock?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      productos_ordenes_proveedor: {
        Row: {
          cantidad: number | null
          cantidad_almacen: number | null
          cantidad_total: number | null
          codigo: string | null
          created_at: string | null
          descripcion: string | null
          id: number
          orden_proveedor_id: number
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
          created_at?: string | null
          descripcion?: string | null
          id?: number
          orden_proveedor_id: number
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
          created_at?: string | null
          descripcion?: string | null
          id?: number
          orden_proveedor_id?: number
          precio_unitario?: number | null
          total?: number | null
          unidad_medida?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          apellido: string | null
          created_at: string | null
          foto: string | null
          id: string
          nombre: string | null
          rol: Database["public"]["Enums"]["user_role"]
          tabla: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          apellido?: string | null
          created_at?: string | null
          foto?: string | null
          id: string
          nombre?: string | null
          rol?: Database["public"]["Enums"]["user_role"]
          tabla?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          apellido?: string | null
          created_at?: string | null
          foto?: string | null
          id?: string
          nombre?: string | null
          rol?: Database["public"]["Enums"]["user_role"]
          tabla?: string | null
          updated_at?: string | null
          username?: string
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
      refacturaciones: {
        Row: {
          created_at: string | null
          detraccion: number | null
          estado: number | null
          factura: string | null
          facturacion_id: number
          fecha_factura: string | null
          forma_envio: string | null
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
          facturacion_id: number
          fecha_factura?: string | null
          forma_envio?: string | null
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
          facturacion_id?: number
          fecha_factura?: string | null
          forma_envio?: string | null
          grr?: string | null
          id?: number
          orden_compra_id?: number
          retencion?: number | null
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
          estado?: number | null
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
        Relationships: []
      }
      user_permiso_configuracion: {
        Row: {
          id: number
          permiso_configuracion_id: number | null
          user_id: string | null
        }
        Insert: {
          id?: number
          permiso_configuracion_id?: number | null
          user_id?: string | null
        }
        Update: {
          id?: number
          permiso_configuracion_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_permiso_configuracion_permiso_configuracion_id_fkey"
            columns: ["permiso_configuracion_id"]
            isOneToOne: false
            referencedRelation: "permisos_configuraciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permiso_configuracion_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permiso_proceso: {
        Row: {
          id: number
          permiso_proceso_id: number | null
          user_id: string | null
        }
        Insert: {
          id?: number
          permiso_proceso_id?: number | null
          user_id?: string | null
        }
        Update: {
          id?: number
          permiso_proceso_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_permiso_proceso_permiso_proceso_id_fkey"
            columns: ["permiso_proceso_id"]
            isOneToOne: false
            referencedRelation: "permisos_procesos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permiso_proceso_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
