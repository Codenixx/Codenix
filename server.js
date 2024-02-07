const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Servir archivos estáticos desde la carpeta public
app.use(express.static('public'));

// Manejar conexiones de Socket.IO
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Escuchar eventos de movimiento del cliente
  socket.on('move', (data) => {
    // Emitir el evento de movimiento a todos los clientes excepto al que lo envió
    socket.broadcast.emit('move', data);
  });

  // Manejar desconexiones de clientes
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
