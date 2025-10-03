import React, { useState } from 'react';
import { Button, Box, Typography, InputAdornment } from '@mui/material';
import { LocalShipping, Search } from '@mui/icons-material';
import SelectTransportsTable from './SelectTransportsTable';
import { TransportProps } from '@/services/transports/transports.d';

interface SelectTransportButtonProps {
    onSelect: (transport: TransportProps) => void;
    selectedTransport?: TransportProps;
    placeholder?: string;
    disabled?: boolean;
    fullWidth?: boolean;
}

const SelectTransportButton: React.FC<SelectTransportButtonProps> = ({
    onSelect,
    selectedTransport,
    placeholder = 'Seleccionar empresa de transporte',
    disabled = false,
    fullWidth = true,
}) => {
    const [modalOpen, setModalOpen] = useState(false);

    const handleSelect = (transport: TransportProps) => {
        onSelect(transport);
        setModalOpen(false);
    };

    return (
        <>
            <Button
                onClick={() => setModalOpen(true)}
                disabled={disabled}
                variant="outlined"
                fullWidth={fullWidth}
                sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    py: 1.5,
                    px: 2,
                    border: '1px solid #d1d5db',
                    borderRadius: 1,
                    bgcolor: 'white',
                    color: selectedTransport ? 'text.primary' : 'text.secondary',
                    '&:hover': {
                        borderColor: '#9ca3af',
                        bgcolor: '#f9fafb',
                    },
                    '&:disabled': {
                        bgcolor: '#f3f4f6',
                        color: '#9ca3af',
                    },
                    minHeight: 48,
                }}
                startIcon={
                    selectedTransport ? (
                        <LocalShipping sx={{ color: '#10b981' }} />
                    ) : (
                        <Search sx={{ color: '#9ca3af' }} />
                    )
                }
            >
                <Box sx={{ flex: 1, textAlign: 'left' }}>
                    {selectedTransport ? (
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                                {selectedTransport.razonSocial}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.2 }}>
                                RUC: {selectedTransport.ruc}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography variant="body2" sx={{ color: 'inherit' }}>
                            {placeholder}
                        </Typography>
                    )}
                </Box>
            </Button>

            <SelectTransportsTable
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSelect={handleSelect}
                selectedTransportId={selectedTransport?.id}
                title="Seleccionar Empresa de Transporte"
            />
        </>
    );
};

export default SelectTransportButton;