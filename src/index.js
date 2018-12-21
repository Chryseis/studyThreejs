import './common/css/reset.css'
import './common/css/common.less'
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import {TweenMax, RoughEase, Power2, Power4} from "gsap";
import Lion from './components/Lion'
import Rabbit from './components/Rabbit'
import Dragon from './components/Dragon'
import Log from './components/Log'
import Flame from './components/Flame'
import {makeSprite} from './common/js/utils'
import {TWOPI, HALFPI, FireColors, TextColors, CamaraInit, CamaraActive} from './common/js/constants'
import {fboReady, wordsParticles} from './text'


let scene, camera, renderer, isActive = false;

scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x242426, 20, 400);

camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10, 400);
camera.position.set(CamaraInit.x, CamaraInit.y, CamaraInit.z)
camera.updateProjectionMatrix();

renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x242426);
renderer.toneMapping = THREE.LinearToneMapping;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

document.body.onclick = function () {
    if (fboReady) {
        isActive = !isActive
        // wordsParticles.hide(function () {
        //     wordsParticles.updateText('WinWin GROUP,Happy', TextColors[Math.floor(Math.random() * TextColors.length)]);
        // })
        // orbit.saveState();
        // TweenMax.to(orbit.object.position, 10, {
        //     x: CamaraActive.x, y: CamaraActive.y, z: CamaraActive.z, ease: Power4.easeInOut, onUpdate: () => {
        //         camera.position.z = orbit.object.position.z;
        //         camera.position.y = orbit.object.position.y;
        //         camera.position.x = orbit.object.position.x;
        //     }, onComplete: () => {
        //         isActive = true;
        //         wordsParticles.hide();
        //     }
        // })
        //
        // TweenMax.to(orbit.object.position, 3, {
        //     x: orbit.position0.x,
        //     y: orbit.position0.y,
        //     z: orbit.position0.z,
        //     ease: Power4.easeInOut,
        //     onUpdate: () => {
        //         camera.position.z = orbit.object.position.z;
        //         camera.position.y = orbit.object.position.y;
        //         camera.position.x = orbit.object.position.x;
        //     },
        //     onComplete: () => {
        //         isActive = false;
        //         wordsParticles.updateText('WinWin GROUP,Happy', TextColors[Math.floor(Math.random() * TextColors.length)]);
        //     }
        // });
    }
}

document.body.appendChild(renderer.domElement);
renderer.domElement.id = 'main'

/*////////////////////////////////////////*/
const orbit = new OrbitControls(camera, renderer.domElement);
// orbit.enableZoom = true;
// orbit.enablePan = false;
//
// orbit.rotateSpeed = 0.3;
// orbit.zoomSpeed = 0.3;
//
// orbit.autoRotate = true;
// orbit.autoRotateSpeed = 0.6;
//
// //orbit.minPolarAngle = Math.PI * 0.3;
// orbit.maxPolarAngle = Math.PI * 0.5;
//
// //orbit.minAzimuthAngle = -Math.PI * 0.2; // radians
// //orbit.maxAzimuthAngle = Math.PI * 0.2; // radians
//
// orbit.minDistance = 40;
// orbit.maxDistance = 500;
//
// orbit.target.set(0, 0, 0);
orbit.update();

let listener = new THREE.AudioListener();
camera.add(listener);

// create a global audio source
let sound = new THREE.Audio(listener);

// load a sound and set it as the Audio object's buffer
// let audioLoader = new THREE.AudioLoader();
// audioLoader.load('/bgMusic.ogg', function (buffer) {
//     sound.setBuffer(buffer);
//     sound.setLoop(true);
//     sound.setVolume(0.1);
//     sound.play();
// });

/*////////////////////////////////////////*/
//Lion
let lion = new Lion();
lion.position.set(-50, 20, 50)
lion.scale.set(.2, .2, .2)
lion.rotation.y = 2.15 * Math.PI / 3;
scene.add(lion);
/*////////////////////////////////////////*/


/*////////////////////////////////////////*/
//Rabbit
let rabbit = new Rabbit();
rabbit.position.set(60, -5, -20);
rabbit.rotation.y = 5 * Math.PI / 3;
// rabbit.scale.set(1.2, 1.2, 1.2)
scene.add(rabbit);
/*////////////////////////////////////////*/

/*////////////////////////////////////////*/
//Dragon
let dragon = new Dragon();
dragon.position.set(-40, 10, -75);
dragon.scale.set(.35, .35, .35)
dragon.rotation.y = 0.4 * Math.PI / 3;
scene.add(dragon);
/*////////////////////////////////////////*/

/*////////////////////////////////////////*/


var ambientLight = new THREE.AmbientLight(0x222222);
scene.add(ambientLight);


let hemiLight = new THREE.HemisphereLight(0xEBF7FD, 0xEBF7FD, 0.2);
hemiLight.position.set(0, 100, 0);
scene.add(hemiLight);

/*////////////////////////////////////////*/

function noiseMap(size, intensity) {
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        width = canvas.width = size || 512,
        height = canvas.height = size || 512;

    intensity = intensity || 120;

    var imageData = ctx.getImageData(0, 0, width, height),
        pixels = imageData.data,
        n = pixels.length,
        i = 0;

    while (i < n) {
        pixels[i++] = pixels[i++] = pixels[i++] = Math.sin(i * i * i + (i / n) * Math.PI) * intensity;
        pixels[i++] = 255;
    }
    ctx.putImageData(imageData, 0, 0);

    let sprite = new THREE.Texture(canvas);
    sprite.needsUpdate = true;

    return sprite;
}

let noise = noiseMap(512, 60);


/*////////////////////////////////////////*/
//Flame
let flames = Array(5).fill(null);
flames.forEach((flame, i) => {
    flame = new Flame(FireColors[Math.floor(FireColors.length * Math.random())]);
    flame.position.z = 9 * Math.cos((i / flames.length) * TWOPI) + Math.sin(Math.random());
    flame.position.x = 9 * Math.sin((i / flames.length) * TWOPI) + Math.sin(Math.random());
    flame.position.y = 14;
    scene.add(flame);

});

let fire;


/*////////////////////////////////////////*/

let fireParticles;

function makeFireParticles() {

    let pointGeometry = new THREE.Geometry();

    for (let i = 0; i < 20; i++) {
        let vertex = new THREE.Vector3();
        vertex.x = Math.random() * 16 - 8;
        vertex.y = Math.random() * 60;
        vertex.z = Math.random() * 16 - 8;
        vertex._maxHeight = 50 + Math.random() * 10;
        vertex._speed = 0.1 + Math.random() * 0.1;
        pointGeometry.vertices.push(vertex);
    }

    pointGeometry.verticesNeedUpdate = true;
    pointGeometry.normalsNeedUpdate = true;
    pointGeometry.computeFaceNormals();

    let pointMaterial = new THREE.PointsMaterial({
        //size: 16,
        color: 0xFF0000,
        map: makeSprite(),
        blending: THREE.AdditiveBlending,
        depthTest: true,
        transparent: true,
        opacity: 0.4,
    });

    let particles = new THREE.Points(pointGeometry, pointMaterial);
    scene.add(particles);

    let count = 0;
    return function () {
        count += 0.01;
        particles.geometry.vertices.forEach((vertex, i) => {
            vertex.x += Math.sin(count * 1.5 + i) * 0.1;
            vertex.z += Math.cos(count * 1.5 + i) * 0.1;
            vertex.y += vertex._speed;
            if (vertex.y > vertex._maxHeight) {
                vertex.y = 0;
            }
        });
        particles.geometry.verticesNeedUpdate = true;
    }
}

fireParticles = makeFireParticles();


/*////////////////////////////////////////*/
// LOG
let logs = Array(5).fill(null);
logs.forEach((log, i) => {
    log = new Log();
    log.position.x = 15 * Math.sin((i / logs.length) * TWOPI) + Math.sin(Math.random());
    log.position.y = 5;
    log.position.z = 1;
    log.rotation.z = HALFPI / 2;// * Math.sin(i+1);
    scene.add(log);
});

/*////////////////////////////////////////*/

// OUTSIDE GROUND


function snowyGround() {

    let geometry = new THREE.PlaneGeometry(1000, 1000, 22, 12);
    for (let i = 0; i < geometry.vertices.length; i++) {
        geometry.vertices[i].z = (Math.sin(i * i * i) + 1 / 2) * 3;
    }
    geometry.verticesNeedUpdate = true;
    geometry.normalsNeedUpdate = true;
    geometry.computeFaceNormals();

    let material = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        shininess: 60,
        bumpMap: noise,
        bumpScale: 0.025,
    });

    let plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = Math.PI / -2;
    plane.receiveShadow = true;
    plane.position.y = -5;

    return plane;

}

scene.add(snowyGround());


/*////////////////////////////////////////*/


let treeMaterial = new THREE.MeshPhongMaterial({
    color: 0x2C9E4B,
    shininess: 20,
    side: THREE.FrontSide,
    flatShading: THREE.SmoothShading
});

function Cone(size, translate) {
    size = size || 10;
    this.geometry = new THREE.CylinderGeometry(size / 2, size, size, 6);
    if (translate) {
        this.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, size, 0));
    }
    THREE.Mesh.call(this, this.geometry, treeMaterial);
}

Cone.prototype = Object.assign(THREE.Mesh.prototype, {
    constructor: Cone,
});

function Tree(size) {

    size = size || 6 + Math.random();

    THREE.Object3D.call(this);

    let lastCone;
    let cone;

    for (let i = 0; i < size; i++) {
        cone = new Cone((size - i) + 1, i);
        cone.position.y = 0;
        if (lastCone) {
            let box = new THREE.Box3().setFromObject(lastCone);
            cone.position.y = (box.max.y + box.min.y) / 2;
        } else {
            cone.position.y += 2;
        }
        lastCone = cone;
        cone.castShadow = true;
        cone.receiveShadow = true;
        this.add(cone);
    }

};

Tree.prototype = Object.assign(THREE.Object3D.prototype, {
    constructor: Tree,
});

/*////////////////////////////////////////*/

let trees = [];

let rounds = [{
    x: 280,
    z: 360,
    count: 50,
    size: 10
}]

for (let k = 0; k < rounds.length; k++) {
    for (let i = 0; i < rounds[k].count; i++) {
        let tree = new Tree(rounds[k].size);
        tree.scale.set(3.25, 3.25, 3.25);
        tree.position.x = Math.sin(i + Math.random() * 0.2) * rounds[k].x;//(treeCount/2 - i) * 30;
        tree.position.z = Math.cos(i + Math.random() * 0.1) * rounds[k].z;
        trees.push(tree);
        scene.add(tree);
    }
}


/*////////////////////////////////////////*/

// FALLING SNOW

function pointsParticles() {

    let pointGeometry = new THREE.Geometry();

    for (let i = 0; i < 10000; i++) {
        let vertex = new THREE.Vector3();
        vertex.x = Math.random() * 1000;
        vertex.y = Math.random() * 500;
        vertex.z = Math.random() * 1000;
        pointGeometry.vertices.push(vertex);
    }

    for (let i = 0; i < 10000; i++) {
        let vertex = new THREE.Vector3();
        vertex.x = -(Math.random() * 1000);
        vertex.y = Math.random() * 500;
        vertex.z = -(Math.random() * 1000);
        pointGeometry.vertices.push(vertex);
    }

    for (let i = 0; i < 10000; i++) {
        let vertex = new THREE.Vector3();
        vertex.x = (Math.random() * 1000);
        vertex.y = Math.random() * 500;
        vertex.z = -(Math.random() * 1000);
        pointGeometry.vertices.push(vertex);
    }

    for (let i = 0; i < 10000; i++) {
        let vertex = new THREE.Vector3();
        vertex.x = -(Math.random() * 1000);
        vertex.y = Math.random() * 500;
        vertex.z = (Math.random() * 1000);
        pointGeometry.vertices.push(vertex);
    }

    pointGeometry.verticesNeedUpdate = true;
    pointGeometry.normalsNeedUpdate = true;
    pointGeometry.computeFaceNormals();

    let pointMaterial = new THREE.PointsMaterial({
        //size: 16,
        map: makeSprite(),
        blending: THREE.AdditiveBlending,
        depthTest: true,
        transparent: true,
        opacity: 0.3,
    });

    let particles = new THREE.Points(pointGeometry, pointMaterial);
    scene.add(particles);

    let count = 0;
    return function () {
        count += 0.01;
        particles.geometry.vertices.forEach((vertex, i) => {
            vertex.x += Math.sin(count + i) * 0.05;
            vertex.z += Math.cos(count + i) * 0.05;
            vertex.y -= 0.5;
            if (vertex.y < 0) {
                vertex.y = 500;
            }
        });
        particles.geometry.verticesNeedUpdate = true;
    }
}

let updateParticles;
updateParticles = pointsParticles();

renderer.gammaInput = true;
renderer.gammaOutput = true;

/*////////////////////////////////////////*/

let count = 3;

function render() {

    requestAnimationFrame(render);
    count += 0.03;
    orbit.update();

    if (updateParticles) {
        updateParticles();
    }
    if (fireParticles) {
        fireParticles(count);
    }
    if (fire && fire.flicker) {
        fire.flicker(count);
    }

    rabbit.run(.1, 6);

    dragon.idle();
    console.log(isActive,'isActive')

    if (!isActive) {
        lion.idle();
    } else {
        lion.active();
    }


    renderer.toneMappingExposure = Math.pow(0.91, 5.0);

    renderer.render(scene, camera);

};

render();

