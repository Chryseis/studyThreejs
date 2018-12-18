import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols'
import WordsParticles from './components/WordsParticles'


let fboReady = false;
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 3000)
camera.position.z = 3000;
camera.position.y = 0;
camera.position.x = 0;


let renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

// let controls = new OrbitControls(camera, renderer.domElement);
// controls.enableZoom = true;
// controls.enablePan = false;
//
// controls.rotateSpeed = 0.3;
// controls.zoomSpeed = 0.3;
//
// controls.autoRotate = false;
// controls.autoRotateSpeed = 0.6;
//
// //orbit.minPolarAngle = Math.PI * 0.3;
// controls.maxPolarAngle = Math.PI * 0.5;
//
// //orbit.minAzimuthAngle = -Math.PI * 0.2; // radians
// //orbit.maxAzimuthAngle = Math.PI * 0.2; // radians
//
// controls.minDistance = 40;
// controls.maxDistance = 5000;
//
// controls.target.set(0, 5, 0);

camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

camera.lookAt(new THREE.Vector3(0, 0, 0));

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;
renderer.toneMappingExposure = 1.3;


let wordsParticles = new WordsParticles(renderer);
wordsParticles.init(() => {
    scene.add(wordsParticles.particles);
    fboReady = true;
    wordsParticles.updateText('WelCome，欢欢', 0x652e37);
});

function render() {
    if (fboReady) {
        wordsParticles.updateRender();
    }
    renderer.render(scene, camera);

    requestAnimationFrame(render)
}

render();

document.body.onclick = function () {
    wordsParticles.updateText('WelCome，莎莎', 0x000000);
    //wordsParticles.updateText('哈哈哈哈', 0x000000);
}

document.body.appendChild(renderer.domElement);