import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { ClockCircleOutlined } from '@ant-design/icons';

interface ComingSoonOverlayProps {
    message?: string;
    blur?: number;
}

const ComingSoonOverlay: React.FC<ComingSoonOverlayProps> = ({
    message = 'Muy pronto...',
    blur = 4,
}) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                position: 'sticky',
                top: 0,
                left: 0,
                right: 0,
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: `blur(${blur}px)`,
                zIndex: 10,
                borderRadius: theme.shape.borderRadius,
                transition: 'all 0.3s ease',
                marginTop: '-200vh',
                marginBottom: '-100vh',
                pointerEvents: 'none'
            }}
        >
            <Box sx={{ pointerEvents: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <ClockCircleOutlined
                    style={{
                        fontSize: 48,
                        color: theme.palette.primary.main,
                        opacity: 0.6,
                    }}
                />
                <Typography
                    variant="h4"
                    sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                        textAlign: 'center',
                        opacity: 0.8,
                    }}
                >
                    {message}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: theme.palette.text.secondary,
                        textAlign: 'center',
                        opacity: 0.6,
                        maxWidth: 300,
                    }}
                >
                    Esta funcionalidad estará disponible próximamente
                </Typography>
            </Box>
        </Box>
    );
};

export default ComingSoonOverlay;
