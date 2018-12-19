import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols'
import WordsParticles from './components/WordsParticles'

let fboReady = false;
let scene1 = new THREE.Scene();
let camera1 = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 6500)
camera1.position.z = 6500;
camera1.position.y = 0;
camera1.position.x = 0;


let renderer1 = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

// let controls = new OrbitControls(camera1, renderer1.domElement);
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

camera1.aspect = window.innerWidth / window.innerHeight;
camera1.updateProjectionMatrix();

camera1.lookAt(new THREE.Vector3(0, 0, 0));

renderer1.setPixelRatio(window.devicePixelRatio);
renderer1.setSize(window.innerWidth, window.innerHeight);
renderer1.shadowMap.enabled = true;
renderer1.shadowMapSoft = true;
renderer1.toneMappingExposure = 1.3;


let wordsParticles = new WordsParticles(renderer1);
wordsParticles.init(() => {
    scene1.add(wordsParticles.particles);
    fboReady = true;
    wordsParticles.updateText('WelCome,欢欢,哈哈哈', 0xb297a2);
});

function render() {
    if (fboReady) {
        wordsParticles.updateRender();
    }
    renderer1.render(scene1, camera1);

    requestAnimationFrame(render)
}

render();

document.querySelector('#text-container').appendChild(renderer1.domElement);

export {
    fboReady,
    wordsParticles
}