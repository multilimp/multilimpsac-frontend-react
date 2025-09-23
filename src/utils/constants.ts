export const EMAIL_PATTERN = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
export const PHONE_PATTERN = /^\d+$/i;
export const STORAGE_KEY = 'APP_MULTILIMP';

export const ESTADO_ROL_COLORS = {
    PENDIENTE: '#f59e0b',
    COMPLETADO: '#10b981',
    CANCELADO: '#ef4444',
    EN_PROCESO: '#3b82f6',
} as const;

export const ESTADO_ROL_LABELS = {
    PENDIENTE: 'Pendiente',
    COMPLETADO: 'Completo',
    CANCELADO: 'Cancelado',
    EN_PROCESO: 'En proceso',
} as const;

// Opciones para selectores de estado
export const estadoVentaOptions = Object.entries(ESTADO_ROL_LABELS).map(([value, label]) => ({
    value,
    label,
}));

// Mapa de colores para backgrounds
export const estadoBgMap: Record<string, string> = ESTADO_ROL_COLORS;