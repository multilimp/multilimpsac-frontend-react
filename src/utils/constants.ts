import { heroUIColors } from '@/styles/theme/heroui-colors';

export const EMAIL_PATTERN = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
export const PHONE_PATTERN = /^\d+$/i;
export const STORAGE_KEY = 'APP_MULTILIMP';

export type EstadoVentaType = 'PENDIENTE' | 'COMPLETADO' | 'CANCELADO' | 'EN_PROCESO';
export type EstadoCobranzaType = 'REQ' | 'REIT1' | 'REIT2' | 'OCI' | 'PC' | 'MAXIMA_AUTORIDAD' | 'CARTA_NOTARIAL' | 'DENUNCIA_JUDICIAL';

// Estados unificados con toda la información necesaria usando HeroUI Colors
export const ESTADOS = {
    PENDIENTE: {
        key: 'PENDIENTE' as const,
        label: 'Pendiente',
        color: heroUIColors.warning[500],
        value: 'PENDIENTE' as EstadoVentaType
    },
    COMPLETADO: {
        key: 'COMPLETADO' as const,
        label: 'Completo',
        color: heroUIColors.success[500],
        value: 'COMPLETADO' as EstadoVentaType
    },
    CANCELADO: {
        key: 'CANCELADO' as const,
        label: 'Cancelado',
        color: heroUIColors.error[500],
        value: 'CANCELADO' as EstadoVentaType
    },
    EN_PROCESO: {
        key: 'EN_PROCESO' as const,
        label: 'En proceso',
        color: heroUIColors.secondary[500],
        value: 'EN_PROCESO' as EstadoVentaType
    }
} as const;

// Estados de Seguimiento (rol) específicos
export type EstadoSeguimientoType = 'PENDIENTE' | 'ENTREGADO' | 'EN_PROCESO' | 'COMPLETO' | 'ANULADO';

export const ESTADOS_SEGUIMIENTO = {
    PENDIENTE: {
        key: 'PENDIENTE' as const,
        label: 'Pendiente',
        color: heroUIColors.warning[500],
        value: 'PENDIENTE' as EstadoSeguimientoType,
    },
    ENTREGADO: {
        key: 'ENTREGADO' as const,
        label: 'Entregado En Proceso',
        color: heroUIColors.secondary[500],
        value: 'ENTREGADO' as EstadoSeguimientoType,
    },
    // EN_PROCESO: {
    //     key: 'EN_PROCESO' as const,
    //     label: 'En Proceso',
    //     color: heroUIColors.secondary[500],
    //     value: 'EN_PROCESO' as EstadoSeguimientoType,
    // },
    COMPLETO: {
        key: 'COMPLETO' as const,
        label: 'Completo',
        color: heroUIColors.primary[500],
        value: 'COMPLETO' as EstadoSeguimientoType,
    },
    ANULADO: {
        key: 'ANULADO' as const,
        label: 'Anulado',
        color: heroUIColors.error[600],
        value: 'ANULADO' as EstadoSeguimientoType,
    },
} as const;

// Estados de cobranza
export const ESTADOS_COBRANZA = {
    REQ: {
        key: 'REQ' as const,
        label: 'Requerimiento',
        color: heroUIColors.warning[500],
        value: 'REQ' as EstadoCobranzaType
    },
    REIT1: {
        key: 'REIT1' as const,
        label: 'Reiterativo 1',
        color: heroUIColors.warning[600],
        value: 'REIT1' as EstadoCobranzaType
    },
    REIT2: {
        key: 'REIT2' as const,
        label: 'Reiterativo 2',
        color: heroUIColors.warning[700],
        value: 'REIT2' as EstadoCobranzaType
    },
    OCI: {
        key: 'OCI' as const,
        label: 'Org. Control Institucional',
        color: heroUIColors.secondary[500],
        value: 'OCI' as EstadoCobranzaType
    },
    PC: {
        key: 'PC' as const,
        label: 'Peru Compras',
        color: heroUIColors.primary[500],
        value: 'PC' as EstadoCobranzaType
    },
    MAXIMA_AUTORIDAD: {
        key: 'MAXIMA_AUTORIDAD' as const,
        label: 'Máxima Autoridad',
        color: heroUIColors.error[500],
        value: 'MAXIMA_AUTORIDAD' as EstadoCobranzaType
    },
    CARTA_NOTARIAL: {
        key: 'CARTA_NOTARIAL' as const,
        label: 'Carta Notarial',
        color: heroUIColors.error[600],
        value: 'CARTA_NOTARIAL' as EstadoCobranzaType
    },
    DENUNCIA_JUDICIAL: {
        key: 'DENUNCIA_JUDICIAL' as const,
        label: 'Denuncia Judicial',
        color: heroUIColors.error[700],
        value: 'DENUNCIA_JUDICIAL' as EstadoCobranzaType
    }
} as const;

// Extractores para mantener compatibilidad
export const ESTADO_ROL_COLORS = Object.fromEntries(
    Object.entries(ESTADOS).map(([key, estado]) => [key, estado.color])
) as Record<keyof typeof ESTADOS, string>;

export const ESTADO_ROL_LABELS = Object.fromEntries(
    Object.entries(ESTADOS).map(([key, estado]) => [key, estado.label])
) as Record<keyof typeof ESTADOS, string>;

export const ESTADO_SEGUIMIENTO_COLORS = Object.fromEntries(
    Object.entries(ESTADOS_SEGUIMIENTO).map(([key, estado]) => [key, estado.color])
) as Record<keyof typeof ESTADOS_SEGUIMIENTO, string>;

export const ESTADO_SEGUIMIENTO_LABELS = Object.fromEntries(
    Object.entries(ESTADOS_SEGUIMIENTO).map(([key, estado]) => [key, estado.label])
) as Record<keyof typeof ESTADOS_SEGUIMIENTO, string>;

export const ESTADO_COBRANZA_COLORS = Object.fromEntries(
    Object.entries(ESTADOS_COBRANZA).map(([key, estado]) => [key, estado.color])
) as Record<keyof typeof ESTADOS_COBRANZA, string>;

export const ESTADO_COBRANZA_LABELS = Object.fromEntries(
    Object.entries(ESTADOS_COBRANZA).map(([key, estado]) => [key, estado.label])
) as Record<keyof typeof ESTADOS_COBRANZA, string>;

// Opciones para selectores
export const estadoOptions = Object.values(ESTADOS).map(estado => ({
    value: estado.value,
    label: estado.label
}));

export const estadoSeguimientoOptions = Object.values(ESTADOS_SEGUIMIENTO).map(estado => ({
    value: estado.value,
    label: estado.label,
}));

export const estadoCobranzaOptions = Object.values(ESTADOS_COBRANZA).map(estado => ({
    value: estado.value,
    label: estado.label
}));

// Funciones utilitarias
export const getEstadoByValue = (value: string) =>
    Object.values(ESTADOS).find(estado => estado.value === value);

export const getEstadoByKey = (key: keyof typeof ESTADOS) => ESTADOS[key];

export const getEstadoSeguimientoByValue = (value: string) =>
    Object.values(ESTADOS_SEGUIMIENTO).find(estado => estado.value === value);

export const getEstadoSeguimientoByKey = (key: keyof typeof ESTADOS_SEGUIMIENTO) => ESTADOS_SEGUIMIENTO[key];

export const getEstadoCobranzaByValue = (value: string) =>
    Object.values(ESTADOS_COBRANZA).find(estado => estado.value === value);

export const getEstadoCobranzaByKey = (key: keyof typeof ESTADOS_COBRANZA) => ESTADOS_COBRANZA[key];

// Mapas de colores para backgrounds
export const estadoBgMap: Record<string, string> = ESTADO_ROL_COLORS;
export const estadoSeguimientoBgMap: Record<string, string> = ESTADO_SEGUIMIENTO_COLORS;
export const estadoCobranzaBgMap: Record<string, string> = ESTADO_COBRANZA_COLORS;