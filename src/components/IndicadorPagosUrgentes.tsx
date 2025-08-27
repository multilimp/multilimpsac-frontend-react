import React from 'react';
import { Badge, IconButton, Tooltip } from '@mui/material';
import { NotificationsActive, Payment } from '@mui/icons-material';
import { useContadorPagosUrgentes } from '@/hooks/usePagosUrgentes';
import { useNavigate } from 'react-router-dom';

interface IndicadorPagosUrgentesProps {
    /**
     * Función callback que se ejecuta al hacer clic en el indicador
     * Si no se proporciona, redirige a la página de tesorería
     */
    onClick?: () => void;
    /**
     * Tamaño del icono
     */
    size?: 'small' | 'medium' | 'large';
    /**
     * Color del icono cuando no hay notificaciones
     */
    color?: 'inherit' | 'primary' | 'secondary' | 'default';
}

const IndicadorPagosUrgentes: React.FC<IndicadorPagosUrgentesProps> = ({
    onClick,
    size = 'medium',
    color = 'inherit'
}) => {
    const totalUrgentes = useContadorPagosUrgentes();
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            // Redirigir a tesorería por defecto
            navigate('/treasurys');
        }
    };

    if (totalUrgentes === 0) {
        return null; // No mostrar nada si no hay pagos urgentes
    }

    return (
        <Tooltip title={`${totalUrgentes} pagos urgentes pendientes`} arrow>
            <IconButton
                onClick={handleClick}
                color={totalUrgentes > 0 ? 'error' : color}
                size={size}
                sx={{
                    animation: totalUrgentes > 0 ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': {
                        '0%': {
                            transform: 'scale(1)',
                        },
                        '50%': {
                            transform: 'scale(1.1)',
                        },
                        '100%': {
                            transform: 'scale(1)',
                        },
                    },
                }}
            >
                <Badge
                    badgeContent={totalUrgentes}
                    color="error"
                    max={99}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    {totalUrgentes > 0 ? (
                        <NotificationsActive />
                    ) : (
                        <Payment />
                    )}
                </Badge>
            </IconButton>
        </Tooltip>
    );
};

export default IndicadorPagosUrgentes;
