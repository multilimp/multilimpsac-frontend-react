import React, { useState, useRef, useEffect } from 'react';
import { 
  Fab, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper, 
  IconButton,
  Chip,
  CircularProgress
} from '@mui/material';
import { 
  Chat as ChatIcon, 
  Send as SendIcon, 
  Close as CloseIcon,
  SmartToy as BotIcon,
  Person as UserIcon
} from '@mui/icons-material';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'data' | 'suggestion';
  data?: Record<string, unknown>;
}

interface ChatbotButtonProps {
  onOpen?: () => void;
  onClose?: () => void;
}

const ChatbotButton: React.FC<ChatbotButtonProps> = ({ onOpen, onClose }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente virtual. Puedo ayudarte con información sobre clientes, productos, ventas, inventario y más. ¿En qué puedo ayudarte?',
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickSuggestions = [
    '¿Cuántos clientes tenemos?',
    '¿Cuál es el producto más vendido?',
    '¿Cuántas ventas tenemos este mes?',
    '¿Hay productos con stock bajo?',
    '¿Cuál es el estado de las órdenes?'
  ];

  const mockDataResponses = {
    'clientes': {
      total: 156,
      nuevos: 12,
      activos: 134,
      inactivos: 10
    },
    'productos': {
      total: 89,
      enStock: 67,
      bajoStock: 15,
      agotados: 7
    },
    'ventas': {
      mesActual: 45000,
      mesAnterior: 38000,
      crecimiento: '+18.4%',
      promedio: 1500
    },
    'inventario': {
      valorTotal: 125000,
      productosBajoStock: 15,
      productosAgotados: 7,
      rotacion: '2.3 meses'
    },
    'ordenes': {
      pendientes: 23,
      enProceso: 45,
      completadas: 156,
      canceladas: 8
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleOpen = () => {
    setOpen(true);
    onOpen?.();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const addMessage = (text: string, isUser: boolean = true, type: 'text' | 'data' | 'suggestion' = 'text', data?: Record<string, unknown>) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      type,
      data
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const processUserMessage = async (message: string) => {
    setIsLoading(true);
    addMessage(message, true);

    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerMessage = message.toLowerCase();
    let response = '';

    if (lowerMessage.includes('cliente') || lowerMessage.includes('clientes')) {
      const data = mockDataResponses.clientes;
      response = `📊 **Información de Clientes:**\n\n• Total de clientes: ${data.total}\n• Clientes nuevos este mes: ${data.nuevos}\n• Clientes activos: ${data.activos}\n• Clientes inactivos: ${data.inactivos}`;
      addMessage(response, false, 'data', data);
    } else if (lowerMessage.includes('producto') || lowerMessage.includes('productos')) {
      const data = mockDataResponses.productos;
      response = `📦 **Información de Productos:**\n\n• Total de productos: ${data.total}\n• En stock: ${data.enStock}\n• Bajo stock: ${data.bajoStock}\n• Agotados: ${data.agotados}`;
      addMessage(response, false, 'data', data);
    } else if (lowerMessage.includes('venta') || lowerMessage.includes('ventas')) {
      const data = mockDataResponses.ventas;
      response = `💰 **Información de Ventas:**\n\n• Ventas del mes actual: S/. ${data.mesActual.toLocaleString()}\n• Ventas del mes anterior: S/. ${data.mesAnterior.toLocaleString()}\n• Crecimiento: ${data.crecimiento}\n• Promedio diario: S/. ${data.promedio.toLocaleString()}`;
      addMessage(response, false, 'data', data);
    } else if (lowerMessage.includes('inventario') || lowerMessage.includes('stock')) {
      const data = mockDataResponses.inventario;
      response = `📋 **Información de Inventario:**\n\n• Valor total del inventario: S/. ${data.valorTotal.toLocaleString()}\n• Productos con bajo stock: ${data.productosBajoStock}\n• Productos agotados: ${data.productosAgotados}\n• Rotación promedio: ${data.rotacion}`;
      addMessage(response, false, 'data', data);
    } else if (lowerMessage.includes('orden') || lowerMessage.includes('órdenes')) {
      const data = mockDataResponses.ordenes;
      response = `📋 **Estado de Órdenes:**\n\n• Pendientes: ${data.pendientes}\n• En proceso: ${data.enProceso}\n• Completadas: ${data.completadas}\n• Canceladas: ${data.canceladas}`;
      addMessage(response, false, 'data', data);
    } else {
      response = 'No tengo información específica sobre eso. ¿Podrías ser más específico? Puedo ayudarte con información sobre clientes, productos, ventas, inventario y órdenes.';
      addMessage(response, false);
    }

    setIsLoading(false);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      processUserMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    processUserMessage(suggestion);
  };

  const renderMessage = (message: ChatMessage) => {
    if (message.type === 'data') {
      return (
        <Paper
          elevation={2}
          sx={{
            p: 2,
            bgcolor: 'primary.50',
            border: '1px solid',
            borderColor: 'primary.200',
            borderRadius: 2
          }}
        >
          <Typography
            variant="body2"
            component="div"
            sx={{
              whiteSpace: 'pre-line',
              fontWeight: 500,
              '& strong': {
                color: 'primary.main'
              }
            }}
            dangerouslySetInnerHTML={{ __html: message.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
          />
        </Paper>
      );
    }

    return (
      <Typography
        variant="body2"
        sx={{
          whiteSpace: 'pre-line',
          fontWeight: message.isUser ? 500 : 400
        }}
      >
        {message.text}
      </Typography>
    );
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chatbot"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.2)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <ChatIcon />
      </Fab>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            height: '70vh',
            maxHeight: '600px'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center" gap={1}>
              <BotIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Asistente Virtual
              </Typography>
              <Chip
                label="Próximamente"
                size="small"
                color="warning"
                variant="filled"
                sx={{
                  fontSize: '0.7rem',
                  height: '20px',
                  fontWeight: 600,
                  '& .MuiChip-label': {
                    px: 1,
                  },
                }}
              />
            </Box>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                  mb: 1
                }}
              >
                <Box
                  sx={{
                    maxWidth: '80%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1
                  }}
                >
                  {!message.isUser && (
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <BotIcon sx={{ color: 'white', fontSize: 18 }} />
                    </Box>
                  )}
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      bgcolor: message.isUser ? 'primary.main' : 'grey.50',
                      color: message.isUser ? 'white' : 'text.primary',
                      borderRadius: 2,
                      maxWidth: '100%'
                    }}
                  >
                    {renderMessage(message)}
                  </Paper>
                  {message.isUser && (
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: 'grey.300',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <UserIcon sx={{ color: 'grey.600', fontSize: 18 }} />
                    </Box>
                  )}
                </Box>
              </Box>
            ))}

            {isLoading && (
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <BotIcon sx={{ color: 'white', fontSize: 18 }} />
                </Box>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    bgcolor: 'grey.50',
                    borderRadius: 2
                  }}
                >
                  <CircularProgress size={20} />
                </Paper>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {messages.length === 1 && (
            <Box sx={{ p: 2, pt: 0 }}>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Consultas rápidas:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {quickSuggestions.map((suggestion, index) => (
                  <Chip
                    key={index}
                    label={suggestion}
                    size="small"
                    variant="outlined"
                    onClick={() => handleSuggestionClick(suggestion)}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
            <TextField
              ref={inputRef}
              fullWidth
              placeholder="Escribe tu consulta..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              size="small"
              disabled={isLoading}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              <SendIcon />
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChatbotButton; 