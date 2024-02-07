const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('move', (data) => {
    console.log('Movimiento recibido:', data);
    // Aquí puedes implementar la lógica para manejar el movimiento del jugador
    // y emitir el movimiento a todos los clientes excepto al remitente
    socket.broadcast.emit('move', data);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
