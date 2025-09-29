import { heroUIColors } from '@/styles/theme/heroui-colors';

export const EMAIL_PATTERN = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
export const PHONE_PATTERN = /^\d+$/i;
export const STORAGE_KEY = 'APP_MULTILIMP';

// Estados unificados con toda la información necesaria usando HeroUI Colors
export const ESTADOS = {
    PENDIENTE: {
        key: 'PENDIENTE',
        label: 'Pendiente',
        color: heroUIColors.warning[500],
        value: 'pendiente'
    },
    COMPLETADO: {
        key: 'COMPLETADO',
        label: 'Completo',
        color: heroUIColors.success[500],
        value: 'COMPLETADO'
    },
    CANCELADO: {
        key: 'CANCELADO',
        label: 'Cancelado',
        color: heroUIColors.error[500],
        value: 'CANCELADO'
    },
    EN_PROCESO: {
        key: 'EN_PROCESO',
        label: 'En proceso',
        color: heroUIColors.secondary[500],
        value: 'EN_PROCESO'
    }
} as const;

// Extractores para mantener compatibilidad
export const ESTADO_ROL_COLORS = Object.fromEntries(
    Object.entries(ESTADOS).map(([key, estado]) => [key, estado.color])
) as Record<keyof typeof ESTADOS, string>;

export const ESTADO_ROL_LABELS = Object.fromEntries(
    Object.entries(ESTADOS).map(([key, estado]) => [key, estado.label])
) as Record<keyof typeof ESTADOS, string>;

// Opciones para selectores
export const estadoOptions = Object.values(ESTADOS).map(estado => ({
    value: estado.value,
    label: estado.label
}));

// Funciones utilitarias
export const getEstadoByValue = (value: string) =>
    Object.values(ESTADOS).find(estado => estado.value === value);

export const getEstadoByKey = (key: keyof typeof ESTADOS) => ESTADOS[key];

// Mapas de colores para backgrounds
export const estadoBgMap: Record<string, string> = ESTADO_ROL_COLORS;