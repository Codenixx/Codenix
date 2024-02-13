import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
//https://codepen.io/jfirestorm44/pen/RwRPJda
//https://sbcode.net/threejs/
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x9c9c9c);
document.getElementById('fondo3D').appendChild(renderer.domElement);

let light = new THREE.DirectionalLight(0xffffff, 1.0); // soft white light
light.position.set(0, 0, 8);
scene.add(light);

let light2 = new THREE.DirectionalLight(0xffffff, 0.5);
light2.position.set(-5, 0, -5);
scene.add(light2);

    /* Suelo
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = Math.PI / 2;
scene.add(ground);
*/
    // Paredes
const wallGeometry = new THREE.BoxGeometry(10, 10, 0.2);
const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
wall1.position.set(0, 0, -23);
wall1.scale.set(10, 10, 10);
scene.add(wall1);



    // Personaje
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(geometry, material);
player.position.set(0,0,0)
scene.add(player);

    // Cámara
const cameraHeight = 0;
const cameraOffsetZ = -0.5;
camera.position.set(0, cameraHeight, 0);
player.add(camera);

const moveSpeed = 0.1;
const rotateSpeed = 0.001;
const keyState = {};
let isMouseMovementEnabled = false;

const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

const onMouseMove = (event) => {
    if(isMouseMovementEnabled){
        const { movementX, movementY } = event;
        player.rotation.y -= movementX * rotateSpeed;
        camera.rotation.x -= movementY * rotateSpeed;
        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
    }
};

document.addEventListener('keydown', (event) => {
    keyState[event.code] = true;
});

document.addEventListener('keyup', (event) => {
    keyState[event.code] = false;
});

document.addEventListener('mousemove', onMouseMove);

document.addEventListener('keydown', (event) => {
    if (event.code === 'Escape') {
        document.exitPointerLock();
        document.body.style.cursor = 'auto';
    }
});

const animate = function () {
requestAnimationFrame(animate);

    if (document.pointerLockElement === renderer.domElement) {
        if (keyState['KeyW']) player.translateZ(-moveSpeed);
        if (keyState['KeyS']) player.translateZ(moveSpeed);
        if (keyState['KeyA']) player.translateX(-moveSpeed);
        if (keyState['KeyD']) player.translateX(moveSpeed);
    }
    renderer.render(scene, camera);
    };

animate();

    // Entrar en el modo de bloqueo del cursor al hacer clic en el botón
const modeToggle = document.createElement('button');
modeToggle.textContent = 'Modo Navegación';
modeToggle.style.position = 'absolute';
modeToggle.style.top = '10px';
modeToggle.style.left = '10px';
modeToggle.style.position = 'fixed';
modeToggle.addEventListener('click', toggleMode);
document.body.appendChild(modeToggle);


const loader = new GLTFLoader();
const models = [];

loader.load('question.gltf', function (gltf) {
    const model = gltf.scene;

    const numInstances = 100;

    // Crear múltiples instancias del modelo
    for (let i = 0; i < numInstances; i++) {
        const clonedModel = model.clone();
        const scale = Math.random() * 0.09 + 0.13;
        const rotationSpeedX = Math.random() * 0.01 - 0.005;
        const rotationSpeedY = Math.random() * 0.01 - 0.005;
        const rotationSpeedZ = Math.random() * 0.01 - 0.005;

        clonedModel.rotation.x = Math.random() * 10;
        clonedModel.rotation.y = Math.random() * 10;
        clonedModel.rotation.z = Math.random() * 10;

        clonedModel.position.set(
            Math.random() * (15 - (-15)) + (-15), // X en el rango [-10, 10]
            Math.random() * (7 - (-7)) + (-7),    // Y en el rango [-7, 7]
            Math.random() * (-7 - (-10)) + (-10)  // Z en el rango [-10, -3]
        );
        clonedModel.scale.set(scale, scale, scale);

        // Velocidad constante en dirección aleatoria
        const speed = 0.005;

        // Dirección inicial aleatoria
        const direction = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();

        models.push({
            model: clonedModel,
            speed: speed,
            direction: direction,
            rotationSpeedX: rotationSpeedX,
            rotationSpeedY: rotationSpeedY,
            rotationSpeedZ: rotationSpeedZ
        });

        // Agregar la instancia del modelo a la escena
        scene.add(clonedModel);
    }

    // Animación: Movimiento de los modelos
    function animateModels() {
        for (let i = 0; i < numInstances; i++) {
            const { model, speed, direction, rotationSpeedX, rotationSpeedY, rotationSpeedZ} = models[i];

            // Actualizar posición en la dirección actual
            model.position.add(direction.clone().multiplyScalar(speed));

            // Detectar colisiones con otros modelos
            for (let j = 0; j < numInstances; j++) {
                if (i !== j) {
                    const otherModel = models[j].model;
                    const distance = model.position.distanceTo(otherModel.position);

                    if (distance < 0.2) { // Distancia de colisión
                        // Cambiar la dirección aleatoriamente
                        models[i].direction = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
                        models[j].direction = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
                    }
                }
            }

            // Detectar colisiones con límites del área de movimiento
            if (model.position.x < -15 || model.position.x > 15) {
                direction.x *= -1; // Invertir dirección en el eje X
            }
            if (model.position.y < -7 || model.position.y > 7) {
                direction.y *= -1; // Invertir dirección en el eje Y
            }
            if (model.position.z < -10 || model.position.z > -7) {
                direction.z *= -1; // Invertir dirección en el eje Z
            }
            model.rotation.x += rotationSpeedX;
            model.rotation.y += rotationSpeedY;
            model.rotation.z += rotationSpeedZ;
        }

        requestAnimationFrame(animateModels);
    }

    animateModels();
},
undefined,
function (error) {
    console.error('Error al cargar el modelo:', error);
});


function toggleMode() {
    if (document.pointerLockElement === renderer.domElement) {
        document.exitPointerLock();
        document.body.style.cursor = 'auto';
        document.getElementById('totaltienda').style.visibility = 'visible';
        isMouseMovementEnabled = false;
    } else {
        renderer.domElement.requestPointerLock();
        document.body.style.cursor = 'none';
        document.getElementById('totaltienda').style.visibility = 'hidden';
        isMouseMovementEnabled = true;
    }
}

    // Bloquear el cursor al volver al modo de pantalla completa
document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        renderer.domElement.requestPointerLock();
    }
});

