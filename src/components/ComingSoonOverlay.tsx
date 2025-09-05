import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

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
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: `blur(${blur}px)`,
                zIndex: 10,
                borderRadius: theme.shape.borderRadius,
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    opacity: 0.7,
                }}
            >
                {message}
            </Typography>
        </Box>
    );
};

export default ComingSoonOverlay;
