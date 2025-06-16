// HeroUI Color System para Multilimp
// Compatible con Material-UI y Ant Design

export const heroUIColors = {
  // Colores primarios estilo HeroUI basados en su verde Multilimp
  primary: {
    50: '#e0f7ed',
    100: '#b3ecd3',
    200: '#80dfb6',
    300: '#4dd299',
    400: '#26c985',
    500: '#04BA6B', // Su color principal
    600: '#03a861',
    700: '#039354',
    800: '#027f47',
    900: '#015c32',
    950: '#003d21',
  },

  // Colores secundarios inspirados en HeroUI
  secondary: {
    50: '#e6f7ff',
    100: '#bae7ff',
    200: '#91d5ff',
    300: '#69c0ff',
    400: '#40a9ff',
    500: '#1890ff',
    600: '#096dd9',
    700: '#0050b3',
    800: '#003a8c',
    900: '#002766',
    950: '#001529',
  },

  // Colores neutros modernos
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },

  // Estados de color
  success: {
    50: '#f0fff4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#04BA6B',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#022c22',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },

  // Gradientes estilo HeroUI
  gradients: {
    primary: 'linear-gradient(135deg, #04BA6B 0%, #03a861 50%, #039354 100%)',
    secondary: 'linear-gradient(135deg, #1890ff 0%, #096dd9 50%, #0050b3 100%)',
    hero: 'linear-gradient(135deg, #04BA6B 0%, #1890ff 50%, #667eea 100%)',
    glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    dark: 'linear-gradient(135deg, #262626 0%, #171717 50%, #0a0a0a 100%)',
    success: 'linear-gradient(135deg, #04BA6B 0%, #059669 100%)',
    warning: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    error: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)',
  },

  // Sombras y efectos
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glow: '0 0 20px rgba(4, 186, 107, 0.4)',
    glowHover: '0 0 30px rgba(4, 186, 107, 0.6)',
  },

  // Bordes radius
  radius: {
    none: '0px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    full: '9999px',
  },
};

// Funciones utilitarias para alpha
export const alpha = (color: string, opacity: number) => {
  // Si el color ya incluye alpha, lo retornamos tal como está
  if (color.includes('rgba') || color.includes('hsla')) return color;
  
  // Convertir hex a rgba
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  return color;
};

export default heroUIColors;
