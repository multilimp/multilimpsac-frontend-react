import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    CircularProgress,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    Send,
    SmartToy,
    Person,
    Close,
} from '@mui/icons-material';
import apiClient from '@/services/apiClient';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

interface ChatbotModalProps {
    open: boolean;
    onClose: () => void;
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({ open, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: '¡Hola! Soy tu asistente virtual para el sistema ERP Multilimp. ¿En qué puedo ayudarte?\n\nPuedo ayudarte con:\n• Consultas sobre ventas y órdenes de compra\n• Información de proveedores y órdenes de proveedor\n• Datos de clientes y transportes\n• Estadísticas del sistema',
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await apiClient.post('/chatbot/query', {
                message: inputMessage,
            });

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response.data.response,
                sender: 'bot',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Lo siento, tuve un problema procesando tu consulta. Por favor, intenta de nuevo.',
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    height: '80vh',
                    maxHeight: '600px',
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'primary.main',
                    color: 'white',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SmartToy />
                    <Typography variant="h6">Asistente Virtual - Multilimp ERP</Typography>
                </Box>
                <IconButton
                    onClick={onClose}
                    sx={{ color: 'white' }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box
                    sx={{
                        flex: 1,
                        overflow: 'auto',
                        p: 2,
                        bgcolor: '#f5f5f5',
                    }}
                >
                    <List>
                        {messages.map((message) => (
                            <ListItem
                                key={message.id}
                                sx={{
                                    alignItems: 'flex-start',
                                    mb: 1,
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        sx={{
                                            bgcolor: message.sender === 'bot' ? 'primary.main' : 'secondary.main',
                                        }}
                                    >
                                        {message.sender === 'bot' ? <SmartToy /> : <Person />}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                {message.sender === 'bot' ? 'Asistente' : 'Tú'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatTime(message.timestamp)}
                                            </Typography>
                                        </Box>
                                    }
                                    secondary={
                                        <Paper
                                            sx={{
                                                p: 2,
                                                bgcolor: message.sender === 'bot' ? 'white' : 'primary.light',
                                                color: message.sender === 'bot' ? 'text.primary' : 'white',
                                                whiteSpace: 'pre-wrap',
                                                wordWrap: 'break-word',
                                            }}
                                        >
                                            {message.text}
                                        </Paper>
                                    }
                                />
                            </ListItem>
                        ))}
                        {isLoading && (
                            <ListItem sx={{ alignItems: 'flex-start' }}>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                        <SmartToy />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    secondary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CircularProgress size={16} />
                                            <Typography variant="body2" color="text.secondary">
                                                Pensando...
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                        )}
                    </List>
                    <div ref={messagesEndRef} />
                </Box>

                <Box
                    sx={{
                        p: 2,
                        borderTop: 1,
                        borderColor: 'divider',
                        bgcolor: 'white',
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={3}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Escribe tu consulta aquí..."
                            disabled={isLoading}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                            sx={{
                                minWidth: 50,
                                height: 56,
                                borderRadius: 2,
                            }}
                        >
                            {isLoading ? <CircularProgress size={20} /> : <Send />}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 1, justifyContent: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                    Asistente virtual powered by Gemini AI
                </Typography>
            </DialogActions>
        </Dialog>
    );
};

export default ChatbotModal;
