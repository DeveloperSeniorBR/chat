import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: 'http://localhost:3000'
}));

io.on('connection', (socket) => {
  console.log('Usuário conectado:', socket.id);

  socket.on('sendMessage', (message) => {
    // Broadcast a mensagem para todos os clientes conectados
    io.emit('newMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 