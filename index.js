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

//segunda camara:
const camera2 = new THREE.PerspectiveCamera(75, 190 / 150, 0.1, 1000);
camera2.position.set(-60, 0, 5);
camera2.lookAt(-60, 0, 0);

const renderer2 = new THREE.WebGLRenderer({ canvas: document.getElementById('c1') });
renderer2.setSize(190, 150);

//luces:
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
wall1.position.set(0, 0, -25);
wall1.scale.set(20, 10, 10);
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
let lolitoelmejor = true;

const mouse = new THREE.Vector2();
const target = new THREE.Vector2();
const windowHalf = new THREE.Vector2( window.innerWidth / 2, window.innerHeight / 2 );

const onMouseMove = (event) => {
    if(isMouseMovementEnabled){
        const { movementX, movementY } = event;
        player.rotation.y -= movementX * rotateSpeed;
        camera.rotation.x -= movementY * rotateSpeed;
        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
    }
    if(lolitoelmejor){
        mouse.x = ( event.clientX - windowHalf.x );
        mouse.y = ( event.clientY - windowHalf.x );
    }

};

function smoothScroll(){
    target = window.scrollY;
    current = lerp(current, target, ease);
    scrollable.style.transform = `translate3d(0,${-current}px, 0)`;
}


document.addEventListener('keydown', (event) => {
    keyState[event.code] = true;
});

document.addEventListener('keyup', (event) => {
    keyState[event.code] = false;
});

document.addEventListener('mousemove', onMouseMove, false);

window.addEventListener( 'resize', onResize, false );

const div3D = document.querySelectorAll('product');

document.addEventListener('mousemove', (event) => {
    const xRotation = (event.clientY / window.innerHeight - 0.5) * 30;
    const yRotation = (event.clientX / window.innerWidth - 0.5) * 30;

    div3D.style.transform = `translate(-50%, -50%) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
});

document.addEventListener('keydown', (event) => {
    if (event.code === 'Escape') {
        document.exitPointerLock();
        document.body.style.cursor = 'auto';
    }
});

function animateMouse() {
    if(lolitoelmejor){
    target.x = ( 1 - mouse.x ) * 0.00009;
    target.y = ( 1 - mouse.y ) * 0.00009;

    camera.rotation.x += 0.05 * ( target.y - camera.rotation.x );
    camera.rotation.y += 0.05 * ( target.x - camera.rotation.y );

    requestAnimationFrame(animateMouse);
    }
}
animateMouse();


function onResize( event ) {
	const width = window.innerWidth;
	const height = window.innerHeight;

    windowHalf.set( width / 2, height / 2 );

    camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize( width, height );
}

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
modeToggle.style.top = '96%';
modeToggle.style.left = '1%';
modeToggle.style.position = 'fixed';
modeToggle.addEventListener('click', toggleMode);
document.body.appendChild(modeToggle);


const loader = new GLTFLoader();
const models = [];

loader.load('question.gltf', function (gltf) {
    const model = gltf.scene;

    const numInstances = 150;

    // Crear múltiples instancias del modelo
    for (let i = 0; i < numInstances; i++) {
        const clonedModel = model.clone();
        const scale = Math.random() * 0.06 + 0.09;
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

let model1, model2;

const loader2 = new GLTFLoader();
loader2.load('question.gltf', function (gltf) {
    model1 = gltf.scene;
    scene.add(model1);
    model1.position.set(-60, 0, -17);
});

const loader3 = new GLTFLoader();
loader3.load('circuloquestion.gltf', function (gltf) {
    model2 = gltf.scene;
    scene.add(model2);
    model2.position.set(-60, 0, -17);
});


function toggleMode() {
    if (document.pointerLockElement === renderer.domElement) {
        document.exitPointerLock();
        document.body.style.cursor = 'auto';
        document.getElementById('totaltienda').style.visibility = 'visible';
        isMouseMovementEnabled = false;
        lolitoelmejor = true;
        animateMouse();
    } else {
        renderer.domElement.requestPointerLock();
        document.body.style.cursor = 'none';
        document.getElementById('totaltienda').style.visibility = 'hidden';
        isMouseMovementEnabled = true;
        lolitoelmejor = false;
    }
}

    // Bloquear el cursor al volver al modo de pantalla completa
document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        renderer.domElement.requestPointerLock();
    }
})
window.onscroll = function() {scrollFunction()};



function animate2() {
    requestAnimationFrame(animate2);
    renderer2.render(scene, camera2);
}
animate2();

function animate3() {
    requestAnimationFrame(animate3);

    // Rotación de los modelos en sentido horario sobre el eje Z
    if (model1) {
        model1.rotation.y += 0.01; // Velocidad de rotación para el primer modelo
    }

    // Rotación de los modelos en sentido antihorario sobre el eje Z
    if (model2) {
        model2.rotation.y -= 0.01; // Velocidad de rotación para el segundo modelo
    }

    renderer.render(scene, camera);
}

// Llamar a la función animate para comenzar la animación
animate3();

function scrollFunction() {
    const scaleDownFactor = 0.5; // Factor de escala para reducir el tamaño
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        document.getElementById("titulo1").style.fontSize = "30px";
        const originalWidth = 190;
        const originalHeight = 150;
        const scaledWidth = originalWidth * scaleDownFactor;
        const scaledHeight = originalHeight * scaleDownFactor;
        document.getElementById("c1").style.height = scaledHeight + "px";
        document.getElementById("c1").style.width = scaledWidth + "px";
    } else {
        document.getElementById("titulo1").style.fontSize = "60px";
        document.getElementById("c1").style.height = "150px";
        document.getElementById("c1").style.width = "190px";
    }
    const width = document.getElementById("c1").clientWidth;
    const height = document.getElementById("c1").clientHeight;
    camera2.aspect = width / height;
    camera2.updateProjectionMatrix();
}
;

