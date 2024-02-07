const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Servir el cliente HTML y los archivos estáticos
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname));

// Almacenar la posición de los jugadores
const players = {};

// Escuchar la conexión de los clientes
io.on('connection', (socket) => {
  console.log('A user connected');

  // Escuchar el movimiento del jugador
  socket.on('move', (data) => {
    // Actualizar la posición del jugador en el servidor
    const playerId = socket.id;
    if (!players[playerId]) {
      players[playerId] = { x: 0, y: 0, z: 0, color: Math.random() * 0xffffff };
    }
    players[playerId].x += data.x;
    players[playerId].y += data.y;
    players[playerId].z += data.z;

    // Emitir la información de los jugadores a todos los clientes
    io.emit('update', players);
  });

  // Manejar la desconexión de los clientes
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    delete players[socket.id];
    io.emit('update', players);
  });
});

// Iniciar el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
