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
          banco: string | null
          created_at: string | null
          estado: boolean | null
          id: number
          numero_cuenta: string | null
          proveedor_id: number
          updated_at: string | null
        }
        Insert: {
          banco?: string | null
          created_at?: string | null
          estado?: boolean | null
          id?: number
          numero_cuenta?: string | null
          proveedor_id: number
          updated_at?: string | null
        }
        Update: {
          banco?: string | null
          created_at?: string | null
          estado?: boolean | null
          id?: number
          numero_cuenta?: string | null
          proveedor_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "banco_proveedores_proveedor_id_fkey"
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
          empresa_id: number | null
          id: number
          updated_at: string | null
        }
        Insert: {
          codigo?: string | null
          created_at?: string | null
          empresa_id?: number | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          codigo?: string | null
          created_at?: string | null
          empresa_id?: number | null
          id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalogo_empresas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          cod_unidad: string | null
          created_at: string | null
          departamento: string | null
          direccion: string | null
          distrito: string | null
          estado: boolean | null
          id: number
          provincia: string | null
          razon_social: string | null
          ruc: string | null
          updated_at: string | null
        }
        Insert: {
          cod_unidad?: string | null
          created_at?: string | null
          departamento?: string | null
          direccion?: string | null
          distrito?: string | null
          estado?: boolean | null
          id?: number
          provincia?: string | null
          razon_social?: string | null
          ruc?: string | null
          updated_at?: string | null
        }
        Update: {
          cod_unidad?: string | null
          created_at?: string | null
          departamento?: string | null
          direccion?: string | null
          distrito?: string | null
          estado?: boolean | null
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
          cliente_id: number | null
          correo: string | null
          created_at: string | null
          estado: boolean | null
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
          estado?: boolean | null
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
          estado?: boolean | null
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
      contacto_empresas: {
        Row: {
          cargo: string | null
          correo: string | null
          created_at: string | null
          empresa_id: number | null
          id: number
          nombre: string | null
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          cargo?: string | null
          correo?: string | null
          created_at?: string | null
          empresa_id?: number | null
          id?: number
          nombre?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          cargo?: string | null
          correo?: string | null
          created_at?: string | null
          empresa_id?: number | null
          id?: number
          nombre?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacto_empresas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      contacto_proveedores: {
        Row: {
          cargo: string | null
          correo: string | null
          created_at: string | null
          estado: boolean | null
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
          estado?: boolean | null
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
          estado?: boolean | null
          id?: number
          nombre?: string | null
          proveedor_id?: number | null
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacto_proveedores_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["id"]
          },
        ]
      }
      contacto_transportes: {
        Row: {
          cargo: string | null
          correo: string | null
          created_at: string | null
          estado: boolean | null
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
          estado?: boolean | null
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
          estado?: boolean | null
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
          codigo: string | null
          cotizacion_id: number | null
          created_at: string | null
          descripcion: string | null
          id: number
          medida: string | null
          p_cliente: string | null
          precio_unitario: number | null
          total: number | null
          updated_at: string | null
        }
        Insert: {
          cantidad?: number | null
          codigo?: string | null
          cotizacion_id?: number | null
          created_at?: string | null
          descripcion?: string | null
          id?: number
          medida?: string | null
          p_cliente?: string | null
          precio_unitario?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Update: {
          cantidad?: number | null
          codigo?: string | null
          cotizacion_id?: number | null
          created_at?: string | null
          descripcion?: string | null
          id?: number
          medida?: string | null
          p_cliente?: string | null
          precio_unitario?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cotizacion_productos_cotizacion_id_fkey"
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
          codigo_cotizacion: string | null
          contacto_cliente_id: number | null
          created_at: string | null
          departamento_entrega: string | null
          direccion_entrega: string | null
          distrito_entrega: string | null
          empresa_id: number | null
          estado: boolean | null
          fecha_cotizacion: string | null
          fecha_entrega: string | null
          id: number
          monto: number | null
          nota_pago: string | null
          nota_pedido: string | null
          provincia_entrega: string | null
          referencia_entrega: string | null
          tipo_pago: string | null
          updated_at: string | null
        }
        Insert: {
          cliente_id?: number | null
          codigo_cotizacion?: string | null
          contacto_cliente_id?: number | null
          created_at?: string | null
          departamento_entrega?: string | null
          direccion_entrega?: string | null
          distrito_entrega?: string | null
          empresa_id?: number | null
          estado?: boolean | null
          fecha_cotizacion?: string | null
          fecha_entrega?: string | null
          id?: number
          monto?: number | null
          nota_pago?: string | null
          nota_pedido?: string | null
          provincia_entrega?: string | null
          referencia_entrega?: string | null
          tipo_pago?: string | null
          updated_at?: string | null
        }
        Update: {
          cliente_id?: number | null
          codigo_cotizacion?: string | null
          contacto_cliente_id?: number | null
          created_at?: string | null
          departamento_entrega?: string | null
          direccion_entrega?: string | null
          distrito_entrega?: string | null
          empresa_id?: number | null
          estado?: boolean | null
          fecha_cotizacion?: string | null
          fecha_entrega?: string | null
          id?: number
          monto?: number | null
          nota_pago?: string | null
          nota_pedido?: string | null
          provincia_entrega?: string | null
          referencia_entrega?: string | null
          tipo_pago?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cotizaciones_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "cotizaciones"
            referencedColumns: ["id"]
          },
        ]
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
          estado: boolean | null
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
          estado?: boolean | null
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
          cod_unidad?: number | null
          correo?: string | null
          created_at?: string | null
          departamento?: string | null
          direccion?: string | null
          direcciones?: string | null
          distrito?: string | null
          estado?: boolean | null
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
          re_detraccion: string | null
          re_factura: string | null
          re_fecha_factura: string | null
          re_forma_envio: string | null
          re_grr: string | null
          re_retencion: string | null
          retencion: string | null
          updated_at: string | null
          venta_id: number | null
        }
        Insert: {
          created_at?: string | null
          detraccion?: string | null
          factura?: string | null
          fecha_factura?: string | null
          forma_envio?: string | null
          grr?: string | null
          id?: number
          re_detraccion?: string | null
          re_factura?: string | null
          re_fecha_factura?: string | null
          re_forma_envio?: string | null
          re_grr?: string | null
          re_retencion?: string | null
          retencion?: string | null
          updated_at?: string | null
          venta_id?: number | null
        }
        Update: {
          created_at?: string | null
          detraccion?: string | null
          factura?: string | null
          fecha_factura?: string | null
          forma_envio?: string | null
          grr?: string | null
          id?: number
          re_detraccion?: string | null
          re_factura?: string | null
          re_fecha_factura?: string | null
          re_forma_envio?: string | null
          re_grr?: string | null
          re_retencion?: string | null
          retencion?: string | null
          updated_at?: string | null
          venta_id?: number | null
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
          seguimiento_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          fecha_gestion?: string | null
          historial?: string | null
          id?: number
          seguimiento_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          fecha_gestion?: string | null
          historial?: string | null
          id?: number
          seguimiento_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historial_gestiones_seguimiento_id_fkey"
            columns: ["seguimiento_id"]
            isOneToOne: false
            referencedRelation: "seguimientos"
            referencedColumns: ["id"]
          },
        ]
      }
      op_productos: {
        Row: {
          almacen: string | null
          cantidad: number | null
          codigo: string | null
          created_at: string | null
          descripcion: string | null
          id: number
          medida: string | null
          orden_pedido_id: number | null
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
          id?: number
          medida?: string | null
          orden_pedido_id?: number | null
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
          medida?: string | null
          orden_pedido_id?: number | null
          p_cliente?: string | null
          precio_unitario?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "op_productos_orden_pedido_id_fkey"
            columns: ["orden_pedido_id"]
            isOneToOne: false
            referencedRelation: "orden_pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      orden_pedidos: {
        Row: {
          cargo_oea: string | null
          codigo_op: string | null
          contacto_proveedor: number | null
          contacto_transporte: number | null
          cot_transporte: string | null
          created_at: string | null
          embalaje: string | null
          estado_op: string | null
          etiquetado: string | null
          fecha_despacho: string | null
          fecha_entrega: string | null
          fecha_orden_pedido: string | null
          fecha_programacion: string | null
          fecha_recepcion: string | null
          flete: string | null
          id: number
          nota_op: string | null
          nota_pago: string | null
          nota_pedido: string | null
          observaciones: string | null
          proveedor_id: number | null
          retorno_mercaderia: string | null
          seguimiento_id: number | null
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
          transporte_id: number | null
          transporte_nota: string | null
          updated_at: string | null
        }
        Insert: {
          cargo_oea?: string | null
          codigo_op?: string | null
          contacto_proveedor?: number | null
          contacto_transporte?: number | null
          cot_transporte?: string | null
          created_at?: string | null
          embalaje?: string | null
          estado_op?: string | null
          etiquetado?: string | null
          fecha_despacho?: string | null
          fecha_entrega?: string | null
          fecha_orden_pedido?: string | null
          fecha_programacion?: string | null
          fecha_recepcion?: string | null
          flete?: string | null
          id?: number
          nota_op?: string | null
          nota_pago?: string | null
          nota_pedido?: string | null
          observaciones?: string | null
          proveedor_id?: number | null
          retorno_mercaderia?: string | null
          seguimiento_id?: number | null
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
          transporte_id?: number | null
          transporte_nota?: string | null
          updated_at?: string | null
        }
        Update: {
          cargo_oea?: string | null
          codigo_op?: string | null
          contacto_proveedor?: number | null
          contacto_transporte?: number | null
          cot_transporte?: string | null
          created_at?: string | null
          embalaje?: string | null
          estado_op?: string | null
          etiquetado?: string | null
          fecha_despacho?: string | null
          fecha_entrega?: string | null
          fecha_orden_pedido?: string | null
          fecha_programacion?: string | null
          fecha_recepcion?: string | null
          flete?: string | null
          id?: number
          nota_op?: string | null
          nota_pago?: string | null
          nota_pedido?: string | null
          observaciones?: string | null
          proveedor_id?: number | null
          retorno_mercaderia?: string | null
          seguimiento_id?: number | null
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
          transporte_id?: number | null
          transporte_nota?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orden_pedidos_contacto_proveedor_fkey"
            columns: ["contacto_proveedor"]
            isOneToOne: false
            referencedRelation: "contacto_proveedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orden_pedidos_contacto_transporte_fkey"
            columns: ["contacto_transporte"]
            isOneToOne: false
            referencedRelation: "contacto_transportes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orden_pedidos_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orden_pedidos_seguimiento_id_fkey"
            columns: ["seguimiento_id"]
            isOneToOne: false
            referencedRelation: "seguimientos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orden_pedidos_transporte_id_fkey"
            columns: ["transporte_id"]
            isOneToOne: false
            referencedRelation: "transportes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string | null
          id: string
          name: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          id: string
          name?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
          role?: string
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
          estado: boolean | null
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
          estado?: boolean | null
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
          estado?: boolean | null
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
        Relationships: [
          {
            foreignKeyName: "saldo_proveedores_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["id"]
          },
        ]
      }
      seguimientos: {
        Row: {
          cargo_entrega: string | null
          catalogo: string | null
          cdepartamento: string | null
          cdireccion: string | null
          cdistrito: string | null
          cliente_id: number | null
          codigo_venta: string | null
          contacto_cliente: string | null
          contacto_cobrador: string | null
          cprovincia: string | null
          created_at: string | null
          creferencia: string | null
          detraccion: string | null
          empresa_id: number | null
          estado_activo: number | null
          estado_facturacion: number | null
          estado_moroza: string | null
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
          inicio_cobranza: string | null
          monto_detraccion: number | null
          monto_retencion: number | null
          monto_venta: number | null
          neto_cobrado: string | null
          nota_credito: string | null
          oce: string | null
          ocf: string | null
          op_proveedor: string | null
          penalidad: string | null
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
          cliente_id?: number | null
          codigo_venta?: string | null
          contacto_cliente?: string | null
          contacto_cobrador?: string | null
          cprovincia?: string | null
          created_at?: string | null
          creferencia?: string | null
          detraccion?: string | null
          empresa_id?: number | null
          estado_activo?: number | null
          estado_facturacion?: number | null
          estado_moroza?: string | null
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
          inicio_cobranza?: string | null
          monto_detraccion?: number | null
          monto_retencion?: number | null
          monto_venta?: number | null
          neto_cobrado?: string | null
          nota_credito?: string | null
          oce?: string | null
          ocf?: string | null
          op_proveedor?: string | null
          penalidad?: string | null
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
          cliente_id?: number | null
          codigo_venta?: string | null
          contacto_cliente?: string | null
          contacto_cobrador?: string | null
          cprovincia?: string | null
          created_at?: string | null
          creferencia?: string | null
          detraccion?: string | null
          empresa_id?: number | null
          estado_activo?: number | null
          estado_facturacion?: number | null
          estado_moroza?: string | null
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
          inicio_cobranza?: string | null
          monto_detraccion?: number | null
          monto_retencion?: number | null
          monto_venta?: number | null
          neto_cobrado?: string | null
          nota_credito?: string | null
          oce?: string | null
          ocf?: string | null
          op_proveedor?: string | null
          penalidad?: string | null
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
        Relationships: [
          {
            foreignKeyName: "fk_seguimientos_cliente"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_seguimientos_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      tesoreria_registros: {
        Row: {
          banco: string | null
          created_at: string | null
          descripcion: string | null
          fecha_pago: string | null
          id: number
          orden_pedido_id: number | null
          total: number | null
          updated_at: string | null
        }
        Insert: {
          banco?: string | null
          created_at?: string | null
          descripcion?: string | null
          fecha_pago?: string | null
          id?: number
          orden_pedido_id?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Update: {
          banco?: string | null
          created_at?: string | null
          descripcion?: string | null
          fecha_pago?: string | null
          id?: number
          orden_pedido_id?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tesoreria_registros_orden_pedido_id_fkey"
            columns: ["orden_pedido_id"]
            isOneToOne: false
            referencedRelation: "orden_pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      transportes: {
        Row: {
          cobertura: string | null
          created_at: string | null
          departamento: string | null
          direccion: string | null
          distrito: string | null
          estado: boolean | null
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
          estado?: boolean | null
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
          estado?: boolean | null
          id?: number
          provincia?: string | null
          razon_social?: string | null
          ruc?: string | null
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
