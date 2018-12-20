import * as THREE from 'three'
import {TweenMax, RoughEase, Power4} from "gsap"
import {rule3} from '../common/js/utils'


class Lion extends THREE.Group {
    constructor() {
        super();
        this.idelingPos = {x: 0, y: 0};
        ;
        this.windTime = 0;
        this.isIdeling = false;
        this.acitve = false;
        this.createLion();
    }

    createLion() {
        this.bodyInitPositions = [];
        this.maneParts = [];
        //this.group = new THREE.Group();
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


        let bodyGeom = new THREE.CylinderGeometry(30, 80, 140, 4);
        let maneGeom = new THREE.BoxGeometry(40, 40, 15);
        let faceGeom = new THREE.BoxGeometry(80, 80, 80);
        let spotGeom = new THREE.BoxGeometry(4, 4, 4);
        let mustacheGeom = new THREE.BoxGeometry(30, 2, 1);
        mustacheGeom.applyMatrix(new THREE.Matrix4().makeTranslation(15, 0, 0));

        let earGeom = new THREE.BoxGeometry(20, 20, 20);
        let noseGeom = new THREE.BoxGeometry(40, 40, 20);
        let eyeGeom = new THREE.BoxGeometry(5, 30, 30);
        let irisGeom = new THREE.BoxGeometry(4, 10, 10);
        let mouthGeom = new THREE.BoxGeometry(20, 20, 10);
        let smileGeom = new THREE.TorusGeometry(12, 4, 2, 10, Math.PI);
        let lipsGeom = new THREE.BoxGeometry(40, 15, 20);
        let kneeGeom = new THREE.BoxGeometry(25, 80, 80);
        kneeGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 50, 0));
        let footGeom = new THREE.BoxGeometry(40, 20, 20);

        // body
        this.body = new THREE.Mesh(bodyGeom, this.yellowMat);
        this.body.position.z = -60;
        this.body.position.y = -30;
        this.bodyVertices = [0, 1, 2, 3, 4, 10];

        for (let i = 0; i < this.bodyVertices.length; i++) {
            let tv = this.body.geometry.vertices[this.bodyVertices[i]];
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

        for (let j = 0; j < 4; j++) {
            for (let k = 0; k < 4; k++) {
                let manePart = new THREE.Mesh(maneGeom, this.redMat);
                manePart.position.x = (j * 40) - 60;
                manePart.position.y = (k * 40) - 60;

                let amp;
                let zOffset;
                let periodOffset = Math.random() * Math.PI * 2;
                let angleOffsetY, angleOffsetX;
                let angleAmpY, angleAmpX;
                let xInit, yInit;


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

        this.add(this.body);
        this.add(this.head);
        this.add(this.leftKnee);
        this.add(this.rightKnee);
        this.add(this.backLeftFoot);
        this.add(this.backRightFoot);
        this.add(this.frontRightFoot);
        this.add(this.frontLeftFoot);

        this.traverse(function (object) {
            if (object instanceof THREE.Mesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
    }

    updateBody(speed) {
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

    look(xTarget, yTarget) {
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

        for (let i = 0; i < this.maneParts.length; i++) {
            let m = this.maneParts[i].mesh;
            m.position.z = 0;
            m.rotation.y = 0;
        }

        for (let i = 0; i < this.mustaches.length; i++) {
            let m = this.mustaches[i];
            m.rotation.y = 0;
        }


        for (let i = 0; i < this.bodyVertices.length; i++) {
            let tvInit = this.bodyInitPositions[i];
            let tv = this.body.geometry.vertices[this.bodyVertices[i]];
            if (tv) {
                tv.x = tvInit.x + this.head.position.x;
            }
        }
        this.body.geometry.verticesNeedUpdate = true;
    }

    cool(xTarget, yTarget) {
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

        let dt = 20000 / (xTarget * xTarget + yTarget * yTarget);
        dt = Math.max(Math.min(dt, 1), .5);
        this.windTime += dt;

        for (let i = 0; i < this.maneParts.length; i++) {
            let m = this.maneParts[i].mesh;
            let amp = this.maneParts[i].amp;
            let zOffset = this.maneParts[i].zOffset;
            let periodOffset = this.maneParts[i].periodOffset;

            m.position.z = zOffset + Math.cos(this.windTime + periodOffset) * amp * dt * 2;
        }

        this.leftEar.rotation.x = Math.cos(this.windTime) * Math.PI / 16 * dt;
        this.rightEar.rotation.x = -Math.cos(this.windTime) * Math.PI / 16 * dt;


        for (let i = 0; i < this.mustaches.length; i++) {
            let m = this.mustaches[i];
            let amp = (i < 3) ? -Math.PI / 8 : Math.PI / 8;
            m.rotation.y = amp + Math.cos(this.windTime + i) * dt * amp;
        }
        ;

        for (let i = 0; i < this.bodyVertices.length; i++) {
            let tvInit = this.bodyInitPositions[i];
            let tv = this.body.geometry.vertices[this.bodyVertices[i]];
            if (tv) {
                tv.x = tvInit.x + this.head.position.x;
            }
        }
        this.body.geometry.verticesNeedUpdate = true;
    }

    idle() {
        TweenMax.killTweensOf(this.head.rotation);

        if (this.isIdeling || Math.random() < .90) return;
        this.isIdeling = true;
        let tx = -600 + Math.random() * 1000;
        let ty = -100 + Math.random() * 500;
        let speed = 1 + Math.random() * 1;


        TweenMax.to(this.idelingPos, speed, {
            x: tx, y: ty, ease: Power4.easeInOut, onUpdate: () => {
                this.look(this.idelingPos.x, this.idelingPos.y);
            }, onComplete: () => {
                this.isIdeling = false;
            }
        })
    }

    active() {
        TweenMax.killTweensOf(this.head.rotation);

        if (this.isActive || Math.random() < .90) return;
        this.isActive = true;
        let tx = -500 + Math.random() * 500;
        let ty = -100 + Math.random() * 500;
        let speed = 1 + Math.random() * 0.8;
        TweenMax.to(this.idelingPos, speed, {
            x: tx, y: ty, ease: Power4.easeInOut, onUpdate: () => {
                this.cool(this.idelingPos.x, this.idelingPos.y);
            }, onComplete: () => {
                this.isActive = false;
            }
        })
    }

    fix() {
        TweenMax.killTweensOf(this.head.rotation);

        this.tHeadRotY = 0;
        this.tHeadRotX = 0;
        this.tHeadRotZ = 0;
        this.tHeadPosX = 0;
        this.tHeadPosY = 60;
        this.tHeadPosZ = -40;

        this.tEyeScale = 1;
        this.tIrisYScale = 1;
        this.tIrisZScale = 1;
        this.tIrisPosY = 25;
        this.tLeftIrisPosZ = 120;
        this.tRightIrisPosZ = 120;

        this.tLipsPosX = 0;
        this.tLipsPosY = -45;

        this.tSmilePosX = 0;
        this.tMouthPosZ = 174;
        this.tSmilePosZ = 173;
        this.tSmilePosY = -15;
        this.tSmileRotZ = -Math.PI;

        this.tRightKneeRotZ = .3;
        this.tLeftKneeRotZ = .3;

        this.updateBody(10);

        this.mane.rotation.y = 0;
        this.mane.rotation.x = 0;

        for (let i = 0; i < this.maneParts.length; i++) {
            let m = this.maneParts[i].mesh;
            m.position.z = 0;
            m.rotation.y = 0;
        }

        for (let i = 0; i < this.mustaches.length; i++) {
            let m = this.mustaches[i];
            m.rotation.y = 0;
        }

        for (let i = 0; i < this.bodyVertices.length; i++) {
            let tvInit = this.bodyInitPositions[i];
            let tv = this.body.geometry.vertices[this.bodyVertices[i]];
            if (tv) {
                tv.x = tvInit.x + this.head.position.x;
            }
        }
        this.body.geometry.verticesNeedUpdate = true;
    }
}


export default Lion;