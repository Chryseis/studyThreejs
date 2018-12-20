import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols'
import WordsParticles from './components/WordsParticles'

let fboReady = false;
let sceneText = new THREE.Scene();
let cameraText = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 6500)
cameraText.position.z = 6500;
cameraText.position.y = 0;
cameraText.position.x = 0;


let rendererText = new THREE.WebGLRenderer({
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

cameraText.aspect = window.innerWidth / window.innerHeight;
cameraText.updateProjectionMatrix();

cameraText.lookAt(new THREE.Vector3(0, 0, 0));

rendererText.setPixelRatio(window.devicePixelRatio);
rendererText.setSize(window.innerWidth, window.innerHeight);
rendererText.shadowMap.enabled = true;
rendererText.shadowMapSoft = true;
rendererText.toneMappingExposure = 1.3;


let wordsParticles = new WordsParticles(rendererText);
wordsParticles.init(() => {
    sceneText.add(wordsParticles.particles);
    fboReady = true;
    wordsParticles.updateText('WelCome to,WinWin Group', 0xb297a2);
});

function render() {
    if (fboReady) {
        wordsParticles.updateRender();
    }
    rendererText.render(sceneText, cameraText);

    requestAnimationFrame(render)
}

render();

window.addEventListener('resize', function () {
    cameraText.aspect = window.innerWidth / window.innerHeight;
    cameraText.updateProjectionMatrix();
    rendererText.setSize(window.innerWidth, window.innerHeight);
}, false);

document.querySelector('#text-container').appendChild(rendererText.domElement);

export {
    fboReady,
    wordsParticles
}