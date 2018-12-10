import './common/css/reset.css'
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import {RoughEase, Power2} from "gsap";

var scene, camera, renderer, orbit, light;

scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x242426, 20, 400);

camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10, 400);
camera.position.z = 100;
camera.position.y = 50;
camera.position.x = 30;
camera.updateProjectionMatrix();

renderer = new THREE.WebGLRenderer({antialias: true});
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

document.body.appendChild(renderer.domElement);

/*////////////////////////////////////////*/
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableZoom = true;
orbit.enablePan = false;

orbit.rotateSpeed = 0.3;
orbit.zoomSpeed = 0.3;

orbit.autoRotate = false;
orbit.autoRotateSpeed = 0.6;

//orbit.minPolarAngle = Math.PI * 0.3;
orbit.maxPolarAngle = Math.PI * 0.45;

//orbit.minAzimuthAngle = -Math.PI * 0.2; // radians
//orbit.maxAzimuthAngle = Math.PI * 0.2; // radians

orbit.minDistance = 40;
orbit.maxDistance = 300;

orbit.target.set(0, 5, 0);
orbit.update();


function makeSprite() {

    let canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

    let spriteSize = 2;
    canvas.width = canvas.height = spriteSize * 2;
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(spriteSize, spriteSize, spriteSize, 0, TWOPI, true);
    ctx.fill();

    let sprite = new THREE.Texture(canvas);
    sprite.needsUpdate = true;

    return sprite;
}


/*////////////////////////////////////////*/


var ambientLight = new THREE.AmbientLight(0x222222);
scene.add(ambientLight);


let hemiLight = new THREE.HemisphereLight(0xEBF7FD, 0xEBF7FD, 0.2);
//hemiLight.color.setRGB(0.75,0.8,0.95);
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


//var gui = new dat.GUI();
//let l = 0;
function makeLight(color) {
    let light = new THREE.PointLight(color || 0xFFFFFF, 1, 0);

    light.castShadow = true;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 120;
    light.shadow.bias = 0.9;
    light.shadow.radius = 5;

    light.power = 9;

    // var sphereSize = 20;
    // var pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
    // light.add( pointLightHelper );

    return light;
}

function Flame(color) {

    THREE.Group.apply(this, arguments);

    this.light = makeLight(color);

    this.light.position.y += 7;
    this.add(this.light);

    let geometry = new THREE.CylinderGeometry(0, 8, 8, 3); //new THREE.BoxGeometry(10,10,10);
    let material = new THREE.MeshPhongMaterial({
        color: color,
        //specular: 0x009900,
        shininess: 550,
        emissive: color,
        transparent: true,
        opacity: 0.4,
        flatShading: THREE.FlatShading
    });

    let flame = new THREE.Mesh(geometry, material);

    this.flame = flame;

    this.add(flame);

    this.scale.y = 2;

    this.flicker(this.flicker);

}

Flame.prototype = Object.assign(THREE.Group.prototype, {
    constructor: Flame,

    flicker(onComplete) {

        let speed = 0.1 + Math.random() * 0.1;
        let ease = RoughEase.ease.config({
            template: Power2.easeInOut,
            strength: 0.3,
            points: 10,
            taper: "none",
            randomize: true,
            clamp: true
        });

        var tl = new TimelineMax({
            onComplete: function () {
                this.reverse()
            },
            onReverseComplete: onComplete,
            onReverseCompleteScope: this,
            onReverseCompleteParams: [onComplete]
        });


        let scale = 2 + Math.random() * 2
        tl.to(this.scale, speed, {
            y: scale,
            ease: ease,
        });
        tl.to(this.position, speed, {
            y: '+=' + (scale * 1.5),
            ease: ease,
        });

        // tl.to(this.rotation, speed, {
        //   x: (Math.PI / 4) * (Math.random() - 0.5),
        //   //y: (Math.PI / 6) * (Math.random() - 0.5),
        //   //z: (Math.PI / 5) * (Math.random() - 0.5),
        //   ease: ease,
        // });

        tl.to(this.light, speed, {
            power: 8 + 9 * Math.random(),
            ease: ease,
        });
    }
});

// fire = new Fire();
// fire.position.y = 10;

let colors = [0xdb2902, 0xfb4402];
const TWOPI = Math.PI * 2;
const HALFPI = Math.PI / 2;
let flames = Array(5).fill(null);
flames.forEach((flame, i) => {

    flame = new Flame(colors[Math.floor(colors.length * Math.random())]);

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
        var vertex = new THREE.Vector3();
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

let logMaterial = new THREE.MeshPhongMaterial({
    color: 0x5C2626,
    shininess: 10,
    flatShading: THREE.FlatShading
});

let logEndMaterial = new THREE.MeshPhongMaterial({
    color: 0xF9F5CE,
    shininess: 10,
    flatShading: THREE.FlatShading
});

function Log() {

    let geometry = new THREE.BoxGeometry(10, 10, 40);

    THREE.Mesh.call(this, geometry, logMaterial);


    let endGeometry = new THREE.BoxGeometry(7, 7, 0.5);
    let end = new THREE.Mesh(endGeometry, logEndMaterial);
    end.position.z = 20;
    this.add(end);

    let otherEnd = new THREE.Mesh(endGeometry, logEndMaterial);
    otherEnd.position.z = -20;
    this.add(otherEnd);
    //let otherEnd = end.clone();

//   otherEnd.position.z = -20;

//   this.add(end, otherEnd);

    this.castShadow = true;
    this.receiveShadow = true;
}

Log.prototype = Object.assign(THREE.Mesh.prototype, {
    constructor: Log
});

let logs = Array(3).fill(null);
logs.forEach((log, i) => {
    log = new Log();
    //log.position.z = 15 * Math.cos((i / logs.length) * TWOPI);
    log.position.x = 15 * Math.sin((i / logs.length) * TWOPI) + Math.sin(Math.random());
    log.position.y = 5;
    log.position.z = 1;

    log.rotation.z = HALFPI / 2;// * Math.sin(i+1);
    //log.rotation.y = HALFPI / 2 * Math.cos((i / logs.length) * TWOPI);
    scene.add(log);
});

/*////////////////////////////////////////*/


/*////////////////////////////////////////*/

// LION
function Lion() {
    this.windTime = 0;
    this.bodyInitPositions = [];
    this.maneParts = [];
    this.threegroup = new THREE.Group();
    this.yellowMat = new THREE.MeshLambertMaterial({
        color: 0xfdd276,
        shading: THREE.FlatShading
    });
    this.redMat = new THREE.MeshLambertMaterial({
        color: 0xad3525,
        shading: THREE.FlatShading
    });

    this.pinkMat = new THREE.MeshLambertMaterial({
        color: 0xe55d2b,
        shading: THREE.FlatShading
    });

    this.whiteMat = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        shading: THREE.FlatShading
    });

    this.purpleMat = new THREE.MeshLambertMaterial({
        color: 0x451954,
        shading: THREE.FlatShading
    });

    this.greyMat = new THREE.MeshLambertMaterial({
        color: 0x653f4c,
        shading: THREE.FlatShading
    });

    this.blackMat = new THREE.MeshLambertMaterial({
        color: 0x302925,
        shading: THREE.FlatShading
    });


    var bodyGeom = new THREE.CylinderGeometry(30, 80, 140, 4);
    var maneGeom = new THREE.BoxGeometry(40, 40, 15);
    var faceGeom = new THREE.BoxGeometry(80, 80, 80);
    var spotGeom = new THREE.BoxGeometry(4, 4, 4);
    var mustacheGeom = new THREE.BoxGeometry(30, 2, 1);
    mustacheGeom.applyMatrix(new THREE.Matrix4().makeTranslation(15, 0, 0));

    var earGeom = new THREE.BoxGeometry(20, 20, 20);
    var noseGeom = new THREE.BoxGeometry(40, 40, 20);
    var eyeGeom = new THREE.BoxGeometry(5, 30, 30);
    var irisGeom = new THREE.BoxGeometry(4, 10, 10);
    var mouthGeom = new THREE.BoxGeometry(20, 20, 10);
    var smileGeom = new THREE.TorusGeometry(12, 4, 2, 10, Math.PI);
    var lipsGeom = new THREE.BoxGeometry(40, 15, 20);
    var kneeGeom = new THREE.BoxGeometry(25, 80, 80);
    kneeGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 50, 0));
    var footGeom = new THREE.BoxGeometry(40, 20, 20);

    // body
    this.body = new THREE.Mesh(bodyGeom, this.yellowMat);
    this.body.position.z = -60;
    this.body.position.y = -30;
    this.bodyVertices = [0, 1, 2, 3, 4, 10];

    for (var i = 0; i < this.bodyVertices.length; i++) {
        var tv = this.body.geometry.vertices[this.bodyVertices[i]];
        if (tv) {
            tv.z = 70;
            //tv.x = 0;
            this.bodyInitPositions.push({x: tv.x, y: tv.y, z: tv.z});
        }
    }

    // knee
    this.leftKnee = new THREE.Mesh(kneeGeom, this.yellowMat);
    this.leftKnee.position.x = 65;
    this.leftKnee.position.z = -20;
    this.leftKnee.position.y = -110;
    this.leftKnee.rotation.z = -.3;

    this.rightKnee = new THREE.Mesh(kneeGeom, this.yellowMat);
    this.rightKnee.position.x = -65;
    this.rightKnee.position.z = -20;
    this.rightKnee.position.y = -110;
    this.rightKnee.rotation.z = .3;

    // feet
    this.backLeftFoot = new THREE.Mesh(footGeom, this.yellowMat);
    this.backLeftFoot.position.z = 30;
    this.backLeftFoot.position.x = 75;
    this.backLeftFoot.position.y = -90;

    this.backRightFoot = new THREE.Mesh(footGeom, this.yellowMat);
    this.backRightFoot.position.z = 30;
    this.backRightFoot.position.x = -75;
    this.backRightFoot.position.y = -90;

    this.frontRightFoot = new THREE.Mesh(footGeom, this.yellowMat);
    this.frontRightFoot.position.z = 40;
    this.frontRightFoot.position.x = -22;
    this.frontRightFoot.position.y = -90;

    this.frontLeftFoot = new THREE.Mesh(footGeom, this.yellowMat);
    this.frontLeftFoot.position.z = 40;
    this.frontLeftFoot.position.x = 22;
    this.frontLeftFoot.position.y = -90;

    // mane

    this.mane = new THREE.Group();

    for (var j = 0; j < 4; j++) {
        for (var k = 0; k < 4; k++) {
            var manePart = new THREE.Mesh(maneGeom, this.redMat);
            manePart.position.x = (j * 40) - 60;
            manePart.position.y = (k * 40) - 60;

            var amp;
            var zOffset;
            var periodOffset = Math.random() * Math.PI * 2;
            var angleOffsetY, angleOffsetX;
            var angleAmpY, angleAmpX;
            var xInit, yInit;


            if ((j == 0 && k == 0) || (j == 0 && k == 3) || (j == 3 && k == 0) || (j == 3 && k == 3)) {
                amp = -10 - Math.floor(Math.random() * 5);
                zOffset = -5;
            } else if (j == 0 || k == 0 || j == 3 || k == 3) {
                amp = -5 - Math.floor(Math.random() * 5);
                zOffset = 0;
            } else {
                amp = 0;
                zOffset = 0;
            }

            this.maneParts.push({
                mesh: manePart,
                amp: amp,
                zOffset: zOffset,
                periodOffset: periodOffset,
                xInit: manePart.position.x,
                yInit: manePart.position.y
            });
            this.mane.add(manePart);
        }
    }

    this.mane.position.y = -10;
    this.mane.position.z = 80;
    //this.mane.rotation.z = Math.PI/4;

    // face
    this.face = new THREE.Mesh(faceGeom, this.yellowMat);
    this.face.position.z = 135;

    // Mustaches

    this.mustaches = [];

    this.mustache1 = new THREE.Mesh(mustacheGeom, this.greyMat);
    this.mustache1.position.x = 30;
    this.mustache1.position.y = -5;
    this.mustache1.position.z = 175;
    this.mustache2 = this.mustache1.clone();
    this.mustache2.position.x = 35;
    this.mustache2.position.y = -12;
    this.mustache3 = this.mustache1.clone();
    this.mustache3.position.y = -19;
    this.mustache3.position.x = 30;
    this.mustache4 = this.mustache1.clone();
    this.mustache4.rotation.z = Math.PI;
    this.mustache4.position.x = -30;
    this.mustache5 = new THREE.Mesh(mustacheGeom, this.blackMat);
    this.mustache5 = this.mustache2.clone();
    this.mustache5.rotation.z = Math.PI;
    this.mustache5.position.x = -35;
    this.mustache6 = new THREE.Mesh(mustacheGeom, this.blackMat);
    this.mustache6 = this.mustache3.clone();
    this.mustache6.rotation.z = Math.PI;
    this.mustache6.position.x = -30;

    this.mustaches.push(this.mustache1);
    this.mustaches.push(this.mustache2);
    this.mustaches.push(this.mustache3);
    this.mustaches.push(this.mustache4);
    this.mustaches.push(this.mustache5);
    this.mustaches.push(this.mustache6);

    // spots
    this.spot1 = new THREE.Mesh(spotGeom, this.redMat);
    this.spot1.position.x = 39;
    this.spot1.position.z = 150;

    this.spot2 = this.spot1.clone();
    this.spot2.position.z = 160;
    this.spot2.position.y = -10;

    this.spot3 = this.spot1.clone();
    this.spot3.position.z = 140;
    this.spot3.position.y = -15;

    this.spot4 = this.spot1.clone();
    this.spot4.position.z = 150;
    this.spot4.position.y = -20;

    this.spot5 = this.spot1.clone();
    this.spot5.position.x = -39;
    this.spot6 = this.spot2.clone();
    this.spot6.position.x = -39;
    this.spot7 = this.spot3.clone();
    this.spot7.position.x = -39;
    this.spot8 = this.spot4.clone();
    this.spot8.position.x = -39;

    // eyes
    this.leftEye = new THREE.Mesh(eyeGeom, this.whiteMat);
    this.leftEye.position.x = 40;
    this.leftEye.position.z = 120;
    this.leftEye.position.y = 25;

    this.rightEye = new THREE.Mesh(eyeGeom, this.whiteMat);
    this.rightEye.position.x = -40;
    this.rightEye.position.z = 120;
    this.rightEye.position.y = 25;

    // iris
    this.leftIris = new THREE.Mesh(irisGeom, this.purpleMat);
    this.leftIris.position.x = 42;
    this.leftIris.position.z = 120;
    this.leftIris.position.y = 25;

    this.rightIris = new THREE.Mesh(irisGeom, this.purpleMat);
    this.rightIris.position.x = -42;
    this.rightIris.position.z = 120;
    this.rightIris.position.y = 25;

    // mouth
    this.mouth = new THREE.Mesh(mouthGeom, this.blackMat);
    this.mouth.position.z = 171;
    this.mouth.position.y = -30;
    this.mouth.scale.set(.5, .5, 1);

    // smile
    this.smile = new THREE.Mesh(smileGeom, this.greyMat);
    this.smile.position.z = 173;
    this.smile.position.y = -15;
    this.smile.rotation.z = -Math.PI;

    // lips
    this.lips = new THREE.Mesh(lipsGeom, this.yellowMat);
    this.lips.position.z = 165;
    this.lips.position.y = -45;


    // ear
    this.rightEar = new THREE.Mesh(earGeom, this.yellowMat);
    this.rightEar.position.x = -50;
    this.rightEar.position.y = 50;
    this.rightEar.position.z = 105;

    this.leftEar = new THREE.Mesh(earGeom, this.yellowMat);
    this.leftEar.position.x = 50;
    this.leftEar.position.y = 50;
    this.leftEar.position.z = 105;

    // nose
    this.nose = new THREE.Mesh(noseGeom, this.greyMat);
    this.nose.position.z = 170;
    this.nose.position.y = 25;

    // head
    this.head = new THREE.Group();
    this.head.add(this.face);
    this.head.add(this.mane);
    this.head.add(this.rightEar);
    this.head.add(this.leftEar);
    this.head.add(this.nose);
    this.head.add(this.leftEye);
    this.head.add(this.rightEye);
    this.head.add(this.leftIris);
    this.head.add(this.rightIris);
    this.head.add(this.mouth);
    this.head.add(this.smile);
    this.head.add(this.lips);
    this.head.add(this.spot1);
    this.head.add(this.spot2);
    this.head.add(this.spot3);
    this.head.add(this.spot4);
    this.head.add(this.spot5);
    this.head.add(this.spot6);
    this.head.add(this.spot7);
    this.head.add(this.spot8);
    this.head.add(this.mustache1);
    this.head.add(this.mustache2);
    this.head.add(this.mustache3);
    this.head.add(this.mustache4);
    this.head.add(this.mustache5);
    this.head.add(this.mustache6);


    this.head.position.y = 60;

    this.threegroup.add(this.body);
    this.threegroup.add(this.head);
    this.threegroup.add(this.leftKnee);
    this.threegroup.add(this.rightKnee);
    this.threegroup.add(this.backLeftFoot);
    this.threegroup.add(this.backRightFoot);
    this.threegroup.add(this.frontRightFoot);
    this.threegroup.add(this.frontLeftFoot);

    this.threegroup.traverse(function (object) {
        if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
        }
    });
}

Lion.prototype.updateBody = function (speed) {

    this.head.rotation.y += (this.tHeagRotY - this.head.rotation.y) / speed;
    this.head.rotation.x += (this.tHeadRotX - this.head.rotation.x) / speed;
    this.head.position.x += (this.tHeadPosX - this.head.position.x) / speed;
    this.head.position.y += (this.tHeadPosY - this.head.position.y) / speed;
    this.head.position.z += (this.tHeadPosZ - this.head.position.z) / speed;

    this.leftEye.scale.y += (this.tEyeScale - this.leftEye.scale.y) / (speed * 2);
    this.rightEye.scale.y = this.leftEye.scale.y;

    this.leftIris.scale.y += (this.tIrisYScale - this.leftIris.scale.y) / (speed * 2);
    this.rightIris.scale.y = this.leftIris.scale.y;

    this.leftIris.scale.z += (this.tIrisZScale - this.leftIris.scale.z) / (speed * 2);
    this.rightIris.scale.z = this.leftIris.scale.z;

    this.leftIris.position.y += (this.tIrisPosY - this.leftIris.position.y) / speed;
    this.rightIris.position.y = this.leftIris.position.y;
    this.leftIris.position.z += (this.tLeftIrisPosZ - this.leftIris.position.z) / speed;
    this.rightIris.position.z += (this.tRightIrisPosZ - this.rightIris.position.z) / speed;

    this.rightKnee.rotation.z += (this.tRightKneeRotZ - this.rightKnee.rotation.z) / speed;
    this.leftKnee.rotation.z += (this.tLeftKneeRotZ - this.leftKnee.rotation.z) / speed;

    this.lips.position.x += (this.tLipsPosX - this.lips.position.x) / speed;
    this.lips.position.y += (this.tLipsPosY - this.lips.position.y) / speed;
    this.smile.position.x += (this.tSmilePosX - this.smile.position.x) / speed;
    this.mouth.position.z += (this.tMouthPosZ - this.mouth.position.z) / speed;
    this.smile.position.z += (this.tSmilePosZ - this.smile.position.z) / speed;
    this.smile.position.y += (this.tSmilePosY - this.smile.position.y) / speed;
    this.smile.rotation.z += (this.tSmileRotZ - this.smile.rotation.z) / speed;
}

Lion.prototype.look = function (xTarget, yTarget) {
    this.tHeagRotY = rule3(xTarget, -200, 200, -Math.PI / 4, Math.PI / 4);
    this.tHeadRotX = rule3(yTarget, -200, 200, -Math.PI / 4, Math.PI / 4);
    this.tHeadPosX = rule3(xTarget, -200, 200, 70, -70);
    this.tHeadPosY = rule3(yTarget, -140, 260, 20, 100);
    this.tHeadPosZ = 0;


    this.tEyeScale = 1;
    this.tIrisYScale = 1;
    this.tIrisZScale = 1;
    this.tIrisPosY = rule3(yTarget, -200, 200, 35, 15);
    this.tLeftIrisPosZ = rule3(xTarget, -200, 200, 130, 110);
    this.tRightIrisPosZ = rule3(xTarget, -200, 200, 110, 130);

    this.tLipsPosX = 0;
    this.tLipsPosY = -45;

    this.tSmilePosX = 0;
    this.tMouthPosZ = 174;
    this.tSmilePosZ = 173;
    this.tSmilePosY = -15;
    this.tSmileRotZ = -Math.PI;

    this.tRightKneeRotZ = rule3(xTarget, -200, 200, .3 - Math.PI / 8, .3 + Math.PI / 8);
    this.tLeftKneeRotZ = rule3(xTarget, -200, 200, -.3 - Math.PI / 8, -.3 + Math.PI / 8)


    this.updateBody(10);

    this.mane.rotation.y = 0;
    this.mane.rotation.x = 0;

    for (var i = 0; i < this.maneParts.length; i++) {
        var m = this.maneParts[i].mesh;
        m.position.z = 0;
        m.rotation.y = 0;
    }

    for (var i = 0; i < this.mustaches.length; i++) {
        var m = this.mustaches[i];
        m.rotation.y = 0;
    }


    for (var i = 0; i < this.bodyVertices.length; i++) {
        var tvInit = this.bodyInitPositions[i];
        var tv = this.body.geometry.vertices[this.bodyVertices[i]];
        if (tv) {
            tv.x = tvInit.x + this.head.position.x;
        }
    }
    this.body.geometry.verticesNeedUpdate = true;
}

Lion.prototype.cool = function (xTarget, yTarget) {
    this.tHeagRotY = rule3(xTarget, -200, 200, Math.PI / 4, -Math.PI / 4);
    this.tHeadRotX = rule3(yTarget, -200, 200, Math.PI / 4, -Math.PI / 4);
    this.tHeadPosX = rule3(xTarget, -200, 200, -70, 70);
    this.tHeadPosY = rule3(yTarget, -140, 260, 100, 20);
    this.tHeadPosZ = 100;

    this.tEyeScale = 0.1;
    this.tIrisYScale = 0.1;
    this.tIrisZScale = 3;

    this.tIrisPosY = 20;
    this.tLeftIrisPosZ = 120;
    this.tRightIrisPosZ = 120;

    this.tLipsPosX = rule3(xTarget, -200, 200, -15, 15);
    this.tLipsPosY = rule3(yTarget, -200, 200, -45, -40);

    this.tMouthPosZ = 168;
    this.tSmilePosX = rule3(xTarget, -200, 200, -15, 15);
    this.tSmilePosY = rule3(yTarget, -200, 200, -20, -8);
    this.tSmilePosZ = 176;
    this.tSmileRotZ = rule3(xTarget, -200, 200, -Math.PI - .3, -Math.PI + .3);

    this.tRightKneeRotZ = rule3(xTarget, -200, 200, .3 + Math.PI / 8, .3 - Math.PI / 8);
    this.tLeftKneeRotZ = rule3(xTarget, -200, 200, -.3 + Math.PI / 8, -.3 - Math.PI / 8);

    this.updateBody(10);

    this.mane.rotation.y = -.8 * this.head.rotation.y;
    this.mane.rotation.x = -.8 * this.head.rotation.x;

    var dt = 20000 / (xTarget * xTarget + yTarget * yTarget);
    dt = Math.max(Math.min(dt, 1), .5);
    this.windTime += dt;

    for (var i = 0; i < this.maneParts.length; i++) {
        var m = this.maneParts[i].mesh;
        var amp = this.maneParts[i].amp;
        var zOffset = this.maneParts[i].zOffset;
        var periodOffset = this.maneParts[i].periodOffset;

        m.position.z = zOffset + Math.cos(this.windTime + periodOffset) * amp * dt * 2;
    }

    this.leftEar.rotation.x = Math.cos(this.windTime) * Math.PI / 16 * dt;
    this.rightEar.rotation.x = -Math.cos(this.windTime) * Math.PI / 16 * dt;


    for (var i = 0; i < this.mustaches.length; i++) {
        var m = this.mustaches[i];
        var amp = (i < 3) ? -Math.PI / 8 : Math.PI / 8;
        m.rotation.y = amp + Math.cos(this.windTime + i) * dt * amp;
    }
    ;

    for (var i = 0; i < this.bodyVertices.length; i++) {
        var tvInit = this.bodyInitPositions[i];
        var tv = this.body.geometry.vertices[this.bodyVertices[i]];
        if (tv) {
            tv.x = tvInit.x + this.head.position.x;
        }
    }
    this.body.geometry.verticesNeedUpdate = true;
}


function rule3(v, vmin, vmax, tmin, tmax) {
    var nv = Math.max(Math.min(v, vmax), vmin);
    var dv = vmax - vmin;
    var pc = (nv - vmin) / dv;
    var dt = tmax - tmin;
    var tv = tmin + (pc * dt);
    return tv;

}

let lion = new Lion();
lion.threegroup.position.x = -50;
lion.threegroup.position.z = 50;
lion.threegroup.position.y = 15;
lion.threegroup.scale.set(.2, .2, .2)
lion.threegroup.rotation.y = Math.PI/4;
scene.add(lion.threegroup);
/*////////////////////////////////////////*/


// OUTSIDE GROUND


function snowyGround() {

    let geometry = new THREE.PlaneGeometry(500, 500, 22, 12);
    for (let i = 0; i < geometry.vertices.length; i++) {
        //geometry.vertices[i].x += (Math.cos( i * i )+1/2);
        //geometry.vertices[i].y += (Math.cos(i )+1/2);
        geometry.vertices[i].z = (Math.sin(i * i * i) + 1 / 2) * 3;
    }
    geometry.verticesNeedUpdate = true;
    geometry.normalsNeedUpdate = true;
    geometry.computeFaceNormals();

    let material = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        shininess: 60,
        //metalness: 1,
        //specularMap: noiseMap(512,255),
        bumpMap: noise,
        bumpScale: 0.025,
        //emissive: 0xEBF7FD,
        //emissiveIntensity: 0.05,
        flatShading: THREE.SmoothShading
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
    //bumpMap: noiseMap(256, 5),
    //bumpScale: 0.5,
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

for (let i = 0; i < 36;) {

    let tree = new Tree;
    tree.scale.set(3.25, 3.25, 3.25);

    tree.position.x = Math.sin(i + Math.random() * 0.2) * 200;//(treeCount/2 - i) * 30;
    tree.position.z = Math.cos(i + Math.random() * 0.1) * 260;
    trees.push(tree);
    scene.add(tree);

    i++; //= Math.random() * 1.2;
}


/*////////////////////////////////////////*/

// FALLING SNOW


function pointsParticles() {

    let pointGeometry = new THREE.Geometry();

    for (let i = 0; i < 120; i++) {
        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 200 - 100;
        vertex.y = Math.random() * 100;
        vertex.z = Math.random() * 200 - 100;
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
        opacity: 0.2,
    });

    let particles = new THREE.Points(pointGeometry, pointMaterial);
    scene.add(particles);
    console.log(particles.geometry);

    let count = 0;
    return function () {
        count += 0.01;
        particles.geometry.vertices.forEach((vertex, i) => {
            vertex.x += Math.sin(count + i) * 0.05;
            vertex.z += Math.cos(count + i) * 0.05;
            vertex.y -= 0.2;
            if (vertex.y < 0) {
                vertex.y = 100;
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

    // scene.traverse( (child) => {
    //   if ( child.material ) { child.material.needsUpdate = true; }
    // });


    renderer.toneMappingExposure = Math.pow(0.91, 5.0);

    renderer.render(scene, camera);


};

render();