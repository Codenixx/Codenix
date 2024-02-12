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

    // Suelo
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = Math.PI / 2;
scene.add(ground);

    // Paredes
const wallGeometry = new THREE.BoxGeometry(10, 5, 0.2);
const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
wall1.position.set(0, 5, -10);
wall1.scale.set(2, 2, 2);
scene.add(wall1);

const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
wall2.position.set(0, 5, 10);
wall2.scale.set(2, 2, 2);
scene.add(wall2);

const wall3 = new THREE.Mesh(wallGeometry, wallMaterial);
wall3.rotation.y = Math.PI / 2;
wall3.position.set(10, 5, 0);
wall3.scale.set(2, 2, 2);
scene.add(wall3);

const wall4 = new THREE.Mesh(wallGeometry, wallMaterial);
wall4.rotation.y = Math.PI / 2;
wall4.position.set(-10, 5, 0);
wall4.scale.set(2, 2, 2);
scene.add(wall4);

    // Personaje
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(geometry, material);
player.position.set(0,0,0)
scene.add(player);

    // Cámara
const cameraHeight = 1.6;
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
        const scale = Math.random() * 0.003 + 0.06;
        const initialX = (Math.random() * 20) - 10;
        const initialY = (Math.random() * 20) - 10;
        const initialZ = ((Math.random() * -5)-2) ;

        clonedModel.position.set(initialX, initialY, initialZ);
        clonedModel.scale.set(scale, scale, scale);

        // Generar velocidades y rotaciones aleatorias
        const speedX = Math.random() * 0.01 - 0.005;
        const speedY = Math.random() * 0.01 - 0.005;
        const speedZ = Math.random() * 0.01 - 0.005;
        const rotationSpeedX = Math.random() * 0.01 - 0.005;
        const rotationSpeedY = Math.random() * 0.01 - 0.005;
        const rotationSpeedZ = Math.random() * 0.01 - 0.005;

        models.push({
            model: clonedModel,
            speedX: speedX,
            speedY: speedY,
            speedZ: speedZ,
            rotationSpeedX: rotationSpeedX,
            rotationSpeedY: rotationSpeedY,
            rotationSpeedZ: rotationSpeedZ,
        });

        // Agregar la instancia del modelo a la escena
        scene.add(clonedModel);
    }

    // Animación: Movimiento y rotación aleatoria de los modelos
    function animateModels() {
        for (let i = 0; i < numInstances; i++) {
            const { model, speedX, speedY, speedZ, rotationSpeedX, rotationSpeedY, rotationSpeedZ } = models[i];

            // Actualizar posición
            model.position.x += speedX;
            model.position.y += speedY;
            model.position.z += speedZ;

            // Actualizar rotación
            model.rotation.x += rotationSpeedX;
            model.rotation.y += rotationSpeedY;
            model.rotation.z += rotationSpeedZ;

            model.position.x = Math.max(-10, Math.min(10, model.position.x));
            model.position.z = Math.max(-10, Math.min(10, model.position.z));
            model.position.y = Math.max(-10, Math.min(10, model.position.y));
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

