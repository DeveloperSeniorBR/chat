const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Usuário conectado:', socket.id);

  socket.on('sendMessage', (message) => {
    console.log('Mensagem recebida:', message);
    io.emit('newMessage', message);
  });

  socket.on('typing', (data) => {
    console.log('Evento de digitação recebido:', data);
    socket.broadcast.emit('userTyping', data);
    console.log('Evento de digitação enviado para outros usuários');
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 