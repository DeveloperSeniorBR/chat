import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Paper, Typography, Container, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

// @ts-ignore
const io = require('socket.io-client');

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
  };
  createdAt: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [openLogin, setOpenLogin] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log('Iniciando conexão com o servidor...');
    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('connect', () => {
      console.log('Conectado ao servidor!');
    });

    socketRef.current.on('connect_error', (error: any) => {
      console.error('Erro na conexão:', error);
    });

    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    socketRef.current.on('newMessage', (message: Message) => {
      console.log('Nova mensagem recebida:', message);
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, message];
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    });

    socketRef.current.on('userTyping', (data: { userId: string, userName: string, isTyping: boolean }) => {
      console.log('Evento de digitação recebido:', data);
      if (data.userId !== userId) {
        console.log('Atualizando estado de digitação:', data);
        setIsTyping(data.isTyping);
        setTypingUser(data.userName);
      }
    });

    return () => {
      console.log('Desconectando do servidor...');
      socketRef.current?.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogin = () => {
    if (userName) {
      const newUserId = Date.now().toString();
      console.log('Usuário logado:', { userId: newUserId, userName });
      setUserId(newUserId);
      setOpenLogin(false);
    }
  };

  const handleTyping = () => {
    if (!userId || !userName) {
      console.log('Não é possível emitir evento de digitação: usuário não logado');
      return;
    }
    
    const data = { userId, userName, isTyping: true };
    console.log('Emitindo evento de digitação:', data);
    socketRef.current?.emit('typing', data);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      const stopData = { userId, userName, isTyping: false };
      console.log('Emitindo evento de parada de digitação:', stopData);
      socketRef.current?.emit('typing', stopData);
    }, 1000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: {
        id: userId,
        name: userName
      },
      createdAt: new Date().toISOString()
    };

    console.log('Enviando mensagem:', message);
    socketRef.current?.emit('sendMessage', message);
    setNewMessage('');
  };

  return (
    <Container maxWidth="sm">
      <Dialog open={openLogin} maxWidth="sm" fullWidth>
        <DialogTitle>Bem-vindo ao Chat</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Seu Nome"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              autoFocus
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleLogin} 
            variant="contained" 
            disabled={!userName}
          >
            Entrar
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', py: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Chat em Tempo Real
        </Typography>
        
        <Paper 
          elevation={3} 
          sx={{ 
            flex: 1, 
            mb: 2, 
            p: 2, 
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#f5f5f5'
          }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                mb: 1,
                alignSelf: message.sender.id === userId ? 'flex-end' : 'flex-start',
                maxWidth: '70%'
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 1,
                  bgcolor: message.sender.id === userId ? 'primary.main' : 'white',
                  color: message.sender.id === userId ? 'white' : 'text.primary'
                }}
              >
                <Typography variant="subtitle2" component="div">
                  {message.sender.name}
                </Typography>
                <Typography variant="body1">
                  {message.content}
                </Typography>
                <Typography variant="caption" display="block">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </Typography>
              </Paper>
            </Box>
          ))}
          {isTyping && (
            <Box
              sx={{
                alignSelf: 'flex-start',
                mt: 1,
                mb: 1,
                p: 1,
                bgcolor: 'rgba(0, 0, 0, 0.04)',
                borderRadius: 1,
                animation: 'fadeIn 0.3s ease-in-out'
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  fontStyle: 'italic'
                }}
              >
                ✍️ {typingUser} está digitando...
              </Typography>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Paper>

        <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            disabled={!userId}
          />
          <Button 
            type="submit" 
            variant="contained" 
            disabled={!userId || !newMessage.trim()}
          >
            Enviar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Chat; 