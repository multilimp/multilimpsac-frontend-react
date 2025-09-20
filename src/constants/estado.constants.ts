// Constantes para colores y etiquetas de estados basados en EstadoRol
export const ESTADO_ROL_COLORS = {
    PENDIENTE: '#f59e0b',    // Amarillo - pendiente
    COMPLETADO: '#10b981',  // Verde - completado
    CANCELADO: '#ef4444',   // Rojo - cancelado
    EN_PROCESO: '#3b82f6',  // Azul - en proceso
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