// Conexión WebSocket
const socket = new WebSocket('ws://localhost:3000');

// Variables globales
let scene, camera, renderer, cube;
let otherCube;

// Inicialización de la escena 3D
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
    scene.add(cube);

    camera.position.z = 5;

    // Eventos de teclado
    document.addEventListener('keydown', onKeyDown);
}

// Función para manejar eventos de teclado
function onKeyDown(event) {
    let keyCode = event.keyCode;
    let movement = { x: 0, y: 0 };

    switch (keyCode) {
        case 87: // W
            movement.y = 0.1;
            break;
        case 83: // S
            movement.y = -0.1;
            break;
        case 65: // A
            movement.x = -0.1;
            break;
        case 68: // D
            movement.x = 0.1;
            break;
        default:
            break;
    }

    // Enviar movimiento al servidor
    socket.send(JSON.stringify(movement));
}

// Render loop
function animate() {
    requestAnimationFrame(animate);

    // Actualizar la posición del cubo localmente
    cube.position.x += (movement.x || 0);
    cube.position.y += (movement.y || 0);

    // Renderizar la escena
    renderer.render(scene, camera);
}

// Escuchar mensajes del servidor WebSocket
socket.onmessage = function(event) {
    // Parsear el mensaje
    let data = JSON.parse(event.data);
    
    // Actualizar la posición del cubo del otro jugador
    if (data.id !== socket.id) {
        otherCube.position.x = data.x;
        otherCube.position.y = data.y;
    }
};

// Iniciar la aplicación
init();
animate();
