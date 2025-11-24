import React, { useState, useEffect, useCallback, lazy, Suspense, useMemo } from 'react';
import { Button, Stack } from '@mui/material';
import { Tabs, Spin, notification } from 'antd';
import type { TabsProps } from 'antd';
import { Add, Warehouse as WarehouseIcon, Inventory } from '@mui/icons-material';
import PageContent from '@/components/PageContent';
import { useTabPersistenceString } from '@/hooks/useTabPersistence';
import {
    getAlmacenes,
    getProductos,
    getStock
} from '@/services/almacen/almacen.requests';
import {
    Almacen,
    Producto,
    StockWithDetails
} from '@/types/almacen.types';

// Lazy load de componentes para mejorar rendimiento inicial
const AlmacenesTable = lazy(() => import('./components/AlmacenesTable'));
const ProductosTable = lazy(() => import('./components/ProductosTable'));
const StockTable = lazy(() => import('./components/StockTable'));
const ProductoFormModal = lazy(() => import('./components/ProductoFormModal'));
const AlmacenFormModal = lazy(() => import('./components/AlmacenFormModal'));
const StockFormModal = lazy(() => import('./components/StockFormModal'));

// Caché local simple con TTL para almacenes/productos/stock
const CACHE_KEY = 'warehouse_cache_v1';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

type WarehouseCache = {
    almacenes?: { data: Almacen[]; timestamp: number };
    productos?: { data: Producto[]; timestamp: number };
    stock?: { data: StockWithDetails[]; timestamp: number };
};

function loadCache(): WarehouseCache | null {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        return raw ? (JSON.parse(raw) as WarehouseCache) : null;
    } catch {
        return null;
    }
}

function saveCache(next: WarehouseCache) {
    try {
        const current = loadCache() || {};
        const merged = { ...current, ...next };
        localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
    } catch {
        // noop
    }
}

function isFresh(ts?: number): boolean {
    if (!ts) return false;
    return Date.now() - ts < CACHE_TTL_MS;
}

const WarehousePage = () => {
    const [activeTab, setActiveTab] = useTabPersistenceString('almacenes');
    const [loading, setLoading] = useState(false);

    // Cargar datos iniciales desde caché
    const cache = loadCache();

    // Estados para datos (inicializados con caché si existe)
    const [almacenes, setAlmacenes] = useState<Almacen[]>(cache?.almacenes?.data || []);
    const [productos, setProductos] = useState<Producto[]>(cache?.productos?.data || []);
    const [stock, setStock] = useState<StockWithDetails[]>(cache?.stock?.data || []);

    // Estados para modales
    const [almacenModalOpen, setAlmacenModalOpen] = useState(false);
    const [productoModalOpen, setProductoModalOpen] = useState(false);
    const [stockModalOpen, setStockModalOpen] = useState(false);

    // Estados para edición
    const [editingAlmacen, setEditingAlmacen] = useState<Almacen | null>(null);
    const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
    const [editingStock, setEditingStock] = useState<StockWithDetails | null>(null);

    // Cargar datos
    const loadAlmacenes = useCallback(async (force: boolean = false) => {
        try {
            setLoading(true);
            if (!force) {
                const cache = loadCache();
                const cached = cache?.almacenes;
                if (cached && isFresh(cached.timestamp)) {
                    setAlmacenes(cached.data);
                    return;
                }
            }
            const data = await getAlmacenes();
            setAlmacenes(data);
            saveCache({ almacenes: { data, timestamp: Date.now() } });
        } catch (error) {
            console.error('Error al cargar almacenes:', error);
            notification.error({
                message: 'Error',
                description: 'No se pudieron cargar los almacenes',
            });
        } finally {
            setLoading(false);
        }
    }, []);

    const loadProductos = useCallback(async (force: boolean = false) => {
        try {
            setLoading(true);
            if (!force) {
                const cache = loadCache();
                const cached = cache?.productos;
                if (cached && isFresh(cached.timestamp)) {
                    setProductos(cached.data);
                    return;
                }
            }
            const data = await getProductos();
            setProductos(data);
            saveCache({ productos: { data, timestamp: Date.now() } });
        } catch (error) {
            console.error('Error al cargar productos:', error);
            notification.error({
                message: 'Error',
                description: 'No se pudieron cargar los productos',
            });
        } finally {
            setLoading(false);
        }
    }, []);

    const loadStock = useCallback(async (force: boolean = false) => {
        try {
            setLoading(true);
            if (!force) {
                const cache = loadCache();
                const cached = cache?.stock;
                if (cached && isFresh(cached.timestamp)) {
                    setStock(cached.data);
                    return;
                }
            }
            const data = await getStock();
            setStock(data);
            saveCache({ stock: { data, timestamp: Date.now() } });
        } catch (error) {
            console.error('Error al cargar stock:', error);
            notification.error({
                message: 'Error',
                description: 'No se pudo cargar el stock',
            });
        } finally {
            setLoading(false);
        }
    }, []);

    // Efectos para cargar datos según tab activo
    useEffect(() => {
        const cache = loadCache();
        switch (activeTab) {
            case 'almacenes':
                // Recargar si no hay caché fresco
                if (!cache?.almacenes || !isFresh(cache.almacenes.timestamp)) {
                    loadAlmacenes();
                }
                break;
            case 'productos':
                if (!cache?.productos || !isFresh(cache.productos.timestamp)) {
                    loadProductos();
                }
                break;
            case 'stock':
                if (!cache?.stock || !isFresh(cache.stock.timestamp)) {
                    loadStock();
                }
                break;
        }
    }, [activeTab, loadAlmacenes, loadProductos, loadStock]);

    // Handlers para cambio de tab
    const handleTabChange = useCallback((key: string) => {
        setActiveTab(key);
    }, [setActiveTab]);

    // Handlers para abrir modales
    const handleAddAlmacen = useCallback(() => {
        setEditingAlmacen(null);
        setAlmacenModalOpen(true);
    }, []);

    const handleEditAlmacen = useCallback((almacen: Almacen) => {
        setEditingAlmacen(almacen);
        setAlmacenModalOpen(true);
    }, []);

    const handleAddProducto = useCallback(() => {
        setEditingProducto(null);
        setProductoModalOpen(true);
    }, []);

    const handleEditProducto = useCallback((producto: Producto) => {
        setEditingProducto(producto);
        setProductoModalOpen(true);
    }, []);

    const handleAddStock = useCallback(() => {
        setEditingStock(null);
        setStockModalOpen(true);
    }, []);

    const handleEditStock = useCallback((stockItem: StockWithDetails) => {
        setEditingStock(stockItem);
        setStockModalOpen(true);
    }, []);

    // Handlers para cerrar modales y recargar datos (forzar refresh para invalidar caché local)
    const handleCloseAlmacenModal = useCallback(() => {
        setAlmacenModalOpen(false);
        setEditingAlmacen(null);
        loadAlmacenes(true);
    }, [loadAlmacenes]);

    const handleCloseProductoModal = useCallback(() => {
        setProductoModalOpen(false);
        setEditingProducto(null);
        loadProductos(true);
    }, [loadProductos]);

    const handleCloseStockModal = useCallback(() => {
        setStockModalOpen(false);
        setEditingStock(null);
        loadStock(true);
    }, [loadStock]);

    // Función para obtener el botón apropiado según el tab activo
    const getActionButton = () => {
        switch (activeTab) {
            case 'almacenes':
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleAddAlmacen}
                    >
                        Agregar Almacén
                    </Button>
                );
            case 'productos':
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleAddProducto}
                    >
                        Agregar Producto
                    </Button>
                );
            case 'stock':
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleAddStock}
                    >
                        Agregar Stock
                    </Button>
                );
            default:
                return null;
        }
    };

    const tabItems: TabsProps['items'] = useMemo(() => [
        {
            key: 'almacenes',
            label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <WarehouseIcon fontSize="small" />
                    Almacenes
                </span>
            ),
            children: (
                <Suspense fallback={<Spin />}>
                    <AlmacenesTable
                        data={almacenes}
                        loading={loading}
                        onEdit={handleEditAlmacen}
                        onReload={loadAlmacenes}
                    />
                </Suspense>
            ),
        },
        {
            key: 'productos',
            label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Inventory fontSize="small" />
                    Productos
                </span>
            ),
            children: (
                <Suspense fallback={<Spin />}>
                    <ProductosTable
                        data={productos}
                        loading={loading}
                        onEdit={handleEditProducto}
                        onReload={loadProductos}
                    />
                </Suspense>
            ),
        },
        {
            key: 'stock',
            label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Inventory fontSize="small" />
                    Stock
                </span>
            ),
            children: (
                <Suspense fallback={<Spin />}>
                    <StockTable
                        data={stock}
                        loading={loading}
                        onEdit={handleEditStock}
                        onReload={loadStock}
                    />
                </Suspense>
            ),
        },
    ], [almacenes, loading, handleEditAlmacen, loadAlmacenes, productos, handleEditProducto, loadProductos, stock, handleEditStock, loadStock]);

    return (
        <PageContent
            title="Gestión de Almacén"
        >
            <Stack direction="row" spacing={1} justifyContent="flex-end" mb={2}>
                {getActionButton()}
            </Stack>
            <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                items={tabItems}
            />

            {/* Modales con lazy loading */}
            <Suspense fallback={null}>
                <AlmacenFormModal
                    open={almacenModalOpen}
                    onClose={handleCloseAlmacenModal}
                    editingAlmacen={editingAlmacen}
                />

                <ProductoFormModal
                    open={productoModalOpen}
                    onClose={handleCloseProductoModal}
                    editingProducto={editingProducto}
                />

                <StockFormModal
                    open={stockModalOpen}
                    onClose={handleCloseStockModal}
                    editingStock={editingStock}
                    almacenes={almacenes}
                    productos={productos}
                />
            </Suspense>
        </PageContent>
    );
};

export default React.memo(WarehousePage);
