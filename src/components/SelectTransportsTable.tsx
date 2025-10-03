import React, { useState, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Button,
    TextField,
    InputAdornment,
    Chip,
    Avatar,
    Modal,
    Stack,
} from '@mui/material';
import {
    Search,
    LocalShipping,
    Business,
    Phone,
    Email,
    LocationOn,
    CheckCircle,
    RadioButtonUnchecked,
} from '@mui/icons-material';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { TransportProps } from '@/services/transports/transports.d';

interface SelectTransportsTableProps {
    open: boolean;
    onClose: () => void;
    onSelect: (transport: TransportProps) => void;
    selectedTransportId?: number;
    title?: string;
    multiple?: boolean;
    onMultiSelect?: (transports: TransportProps[]) => void;
}

const SelectTransportsTable: React.FC<SelectTransportsTableProps> = ({
    open,
    onClose,
    onSelect,
    selectedTransportId,
    title = 'Seleccionar Empresa de Transporte',
    multiple = false,
    onMultiSelect,
}) => {
    const { transports, loadingTransports } = useGlobalInformation();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTransports, setSelectedTransports] = useState<TransportProps[]>([]);

    // Filtrar transportes por búsqueda
    const filteredTransports = useMemo(() => {
        if (!searchTerm) return transports;

        return transports.filter(transport =>
            transport.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transport.ruc.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (transport.email && transport.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (transport.telefono && transport.telefono.includes(searchTerm))
        );
    }, [transports, searchTerm]);

    const handleSelectTransport = (transport: TransportProps) => {
        if (multiple) {
            const isSelected = selectedTransports.some(t => t.id === transport.id);
            let newSelected;

            if (isSelected) {
                newSelected = selectedTransports.filter(t => t.id !== transport.id);
            } else {
                newSelected = [...selectedTransports, transport];
            }

            setSelectedTransports(newSelected);
        } else {
            onSelect(transport);
            onClose();
        }
    };

    const handleConfirmSelection = () => {
        if (multiple && onMultiSelect) {
            onMultiSelect(selectedTransports);
        }
        onClose();
    };

    const isSelected = (transportId: number) => {
        if (multiple) {
            return selectedTransports.some(t => t.id === transportId);
        }
        return selectedTransportId === transportId;
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
            }}
        >
            <Box
                sx={{
                    width: '90%',
                    maxWidth: 1200,
                    maxHeight: '90vh',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        p: 3,
                        borderBottom: '1px solid #e0e0e0',
                        bgcolor: '#f8fafc',
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <Avatar sx={{ bgcolor: '#10b981' }}>
                            <LocalShipping />
                        </Avatar>
                        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                            {title}
                        </Typography>
                    </Stack>

                    {/* Search */}
                    <TextField
                        fullWidth
                        placeholder="Buscar por razón social, RUC, email o teléfono..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                        size="small"
                    />
                </Box>

                {/* Table */}
                <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                <TableCell sx={{ fontWeight: 600, width: 50 }}></TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Empresa</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>RUC</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Contacto</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Ubicación</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loadingTransports ? (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography color="text.secondary">Cargando transportes...</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : filteredTransports.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography color="text.secondary">
                                            {searchTerm ? 'No se encontraron transportes' : 'No hay transportes disponibles'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredTransports.map((transport) => (
                                    <TableRow
                                        key={transport.id}
                                        hover
                                        onClick={() => handleSelectTransport(transport)}
                                        sx={{
                                            cursor: 'pointer',
                                            bgcolor: isSelected(transport.id) ? '#ecfdf5' : 'inherit',
                                            '&:hover': {
                                                bgcolor: isSelected(transport.id) ? '#ecfdf5' : '#f8fafc',
                                            },
                                        }}
                                    >
                                        <TableCell>
                                            {isSelected(transport.id) ? (
                                                <CheckCircle sx={{ color: '#10b981' }} />
                                            ) : (
                                                <RadioButtonUnchecked sx={{ color: '#d1d5db' }} />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar sx={{ bgcolor: '#10b981', width: 32, height: 32 }}>
                                                    <Business sx={{ fontSize: 16 }} />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {transport.razonSocial}
                                                    </Typography>
                                                    {transport.cobertura && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            Cobertura: {transport.cobertura}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{transport.ruc}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Stack spacing={0.5}>
                                                {transport.telefono && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                        <Typography variant="caption">{transport.telefono}</Typography>
                                                    </Box>
                                                )}
                                                {transport.email && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Email sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                        <Typography variant="caption">{transport.email}</Typography>
                                                    </Box>
                                                )}
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LocationOn sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                <Typography variant="caption">
                                                    {[transport.departamento?.name, transport.provincia?.name, transport.distrito?.name]
                                                        .filter(Boolean)
                                                        .join(' - ') || 'Sin ubicación'}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={transport.estado ? 'Activo' : 'Inactivo'}
                                                size="small"
                                                color={transport.estado ? 'success' : 'default'}
                                                variant={transport.estado ? 'filled' : 'outlined'}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Footer */}
                <Box
                    sx={{
                        p: 3,
                        borderTop: '1px solid #e0e0e0',
                        bgcolor: '#f8fafc',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        {filteredTransports.length} transportes encontrados
                        {multiple && selectedTransports.length > 0 && (
                            <span> • {selectedTransports.length} seleccionados</span>
                        )}
                    </Typography>

                    <Stack direction="row" spacing={2}>
                        <Button onClick={onClose} variant="outlined">
                            Cancelar
                        </Button>
                        {multiple && (
                            <Button
                                onClick={handleConfirmSelection}
                                variant="contained"
                                disabled={selectedTransports.length === 0}
                                sx={{
                                    bgcolor: '#10b981',
                                    '&:hover': { bgcolor: '#059669' },
                                    '&:disabled': { bgcolor: '#d1d5db' },
                                }}
                            >
                                Seleccionar ({selectedTransports.length})
                            </Button>
                        )}
                    </Stack>
                </Box>
            </Box>
        </Modal>
    );
};

export default SelectTransportsTable;