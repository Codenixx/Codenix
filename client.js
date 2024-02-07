const socket = io();

// Escuchar eventos de movimiento del otro jugador desde el servidor
socket.on('move', (data) => {
  // Actualizar la posición del otro jugador en la escena 3D
  // Implementa tu lógica aquí
});

// Capturar eventos de teclado para mover tu propio jugador y enviar el movimiento al servidor
document.addEventListener('keydown', (event) => {
  // Implementa tu lógica para mover tu propio jugador
  // Envía el movimiento al servidor
  socket.emit('move', { key: event.code });
});

