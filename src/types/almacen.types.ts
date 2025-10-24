// Tipos para Almacén
export interface Almacen {
    id: number;
    nombre: string;
    direccion?: string;
    ciudad?: string;
    createdAt: string;
    updatedAt: string;
    stockProductos?: StockProducto[];
}

export interface CreateAlmacenData {
    nombre: string;
    direccion?: string;
    ciudad?: string;
}

export type UpdateAlmacenData = Partial<CreateAlmacenData>;

// Tipos para Producto  
export interface Producto {
    id: number;
    nombre: string;
    descripcion?: string;
    unidadMedida?: string;
    precioBase?: number;
    estado?: boolean;
    createdAt: string;
    updatedAt: string;
    stockProductos?: StockProducto[];
}

export interface CreateProductoData {
    nombre: string;
    descripcion?: string;
    unidadMedida?: string;
    precioBase?: number;
    estado?: boolean;
}

export type UpdateProductoData = Partial<CreateProductoData>;

// Tipos para Stock
export interface StockProducto {
    id: number;
    productoId: number;
    almacenId: number;
    cantidad: number;
    createdAt: string;
    updatedAt: string;
    producto?: Producto;
    almacen?: Almacen;
}

export interface CreateStockData {
    productoId: number;
    almacenId: number;
    cantidad: number;
    referencia?: string; // nueva referencia opcional al crear/actualizar stock
}

export interface UpdateStockData {
    cantidad: number;
    referencia?: string; // nueva referencia opcional al actualizar stock
}

// Tipos combinados para visualización
export interface AlmacenWithStock extends Almacen {
    stockProductos: StockProducto[];
}

export interface ProductoWithStock extends Producto {
    stockProductos: StockProducto[];
}

export interface StockWithDetails extends StockProducto {
    producto: Producto;
    almacen: Almacen;
}

export interface MovimientoStock {
    id: number;
    productoId: number;
    almacenId: number;
    cantidad: number;
    tipo: 'ENTRADA' | 'SALIDA';
    referencia?: string;
    createdAt: string;
    producto?: Producto;
    almacen?: Almacen;
}
