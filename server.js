const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });

let clients = [];

wss.on('connection', function connection(ws) {
    // Añadir cliente a la lista de clientes
    clients.push(ws);

    // Manejar mensajes del cliente
    ws.on('message', function incoming(message) {
        // Enviar mensaje a todos los clientes excepto al que lo envió
        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // Manejar cierre de conexión
    ws.on('close', function close() {
        // Remover cliente de la lista de clientes
        clients = clients.filter(client => client !== ws);
    });
});
