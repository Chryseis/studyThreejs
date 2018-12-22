import * as THREE from 'three'
import {TweenMax, RoughEase, Power4} from "gsap"

class Rabbit extends THREE.Group {
    constructor() {
        super();
        this.maxSpeed = 10;
        this.idelingPos = {x: 0, y: 0, eLx: 0, eRx: 0};
        this.runningCycle=0;
        this.createRabbit();
    }

    createRabbit() {
        let blackMat = new THREE.MeshPhongMaterial({
            color: 0x100707,
            shading: THREE.FlatShading
        });

        let brownMat = new THREE.MeshPhongMaterial({
            color: 0xb44b39,
            shininess: 0,
            shading: THREE.FlatShading
        });

        let greenMat = new THREE.MeshPhongMaterial({
            color: 0x7abf8e,
            shininess: 0,
            shading: THREE.FlatShading
        });

        let pinkMat = new THREE.MeshPhongMaterial({
            color: 0xdc5f45, //0xb43b29,//0xff5b49,
            shininess: 0,
            shading: THREE.FlatShading
        });

        let lightBrownMat = new THREE.MeshPhongMaterial({
            color: 0xe07a57,
            shading: THREE.FlatShading
        });

        let whiteMat = new THREE.MeshPhongMaterial({
            color: 0xa49789,
            shading: THREE.FlatShading
        });
        let skinMat = new THREE.MeshPhongMaterial({
            color: 0xff9ea5,
            shading: THREE.FlatShading
        });

        this.body = new THREE.Group();
        this.add(this.body);

        let torsoGeom = new THREE.CubeGeometry(7, 7, 10, 1);

        this.torso = new THREE.Mesh(torsoGeom, brownMat);
        this.torso.position.z = 0;
        this.torso.position.y = 7;
        this.torso.castShadow = true;
        this.body.add(this.torso);

        let pantsGeom = new THREE.CubeGeometry(9, 9, 5, 1);
        this.pants = new THREE.Mesh(pantsGeom, whiteMat);
        this.pants.position.z = -3;
        this.pants.position.y = 0;
        this.pants.castShadow = true;
        this.torso.add(this.pants);

        let tailGeom = new THREE.CubeGeometry(3, 3, 3, 1);
        tailGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, -2));
        this.tail = new THREE.Mesh(tailGeom, lightBrownMat);
        this.tail.position.z = -4;
        this.tail.position.y = 5;
        this.tail.castShadow = true;
        this.torso.add(this.tail);

        this.torso.rotation.x = -Math.PI / 8;

        let headGeom = new THREE.CubeGeometry(10, 10, 13, 1);

        headGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 7.5));
        this.head = new THREE.Mesh(headGeom, brownMat);
        this.head.position.z = 2;
        this.head.position.y = 11;
        this.head.castShadow = true;
        this.body.add(this.head);

        let cheekGeom = new THREE.CubeGeometry(1, 4, 4, 1);
        this.cheekR = new THREE.Mesh(cheekGeom, pinkMat);
        this.cheekR.position.x = -5;
        this.cheekR.position.z = 7;
        this.cheekR.position.y = -2.5;
        this.cheekR.castShadow = true;
        this.head.add(this.cheekR);

        this.cheekL = this.cheekR.clone();
        this.cheekL.position.x = -this.cheekR.position.x;
        this.head.add(this.cheekL);

        let noseGeom = new THREE.CubeGeometry(6, 6, 3, 1);
        this.nose = new THREE.Mesh(noseGeom, lightBrownMat);
        this.nose.position.z = 13.5;
        this.nose.position.y = 2.6;
        this.nose.castShadow = true;
        this.head.add(this.nose);

        let mouthGeom = new THREE.CubeGeometry(4, 2, 4, 1);
        mouthGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 3));
        mouthGeom.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 12));
        this.mouth = new THREE.Mesh(mouthGeom, brownMat);
        this.mouth.position.z = 8;
        this.mouth.position.y = -4;
        this.mouth.castShadow = true;
        this.head.add(this.mouth);

        let pawFGeom = new THREE.CubeGeometry(3, 3, 3, 1);
        this.pawFR = new THREE.Mesh(pawFGeom, lightBrownMat);
        this.pawFR.position.x = -2;
        this.pawFR.position.z = 6;
        this.pawFR.position.y = 1.5;
        this.pawFR.castShadow = true;
        this.body.add(this.pawFR);

        this.pawFL = this.pawFR.clone();
        this.pawFL.position.x = -this.pawFR.position.x;
        this.pawFL.castShadow = true;
        this.body.add(this.pawFL);

        let pawBGeom = new THREE.CubeGeometry(3, 3, 6, 1);
        this.pawBL = new THREE.Mesh(pawBGeom, lightBrownMat);
        this.pawBL.position.y = 1.5;
        this.pawBL.position.z = 0;
        this.pawBL.position.x = 5;
        this.pawBL.castShadow = true;
        this.body.add(this.pawBL);

        this.pawBR = this.pawBL.clone();
        this.pawBR.position.x = -this.pawBL.position.x;
        this.pawBR.castShadow = true;
        this.body.add(this.pawBR);

        let earGeom = new THREE.CubeGeometry(7, 18, 2, 1);
        earGeom.vertices[6].x += 2;
        earGeom.vertices[6].z += .5;

        earGeom.vertices[7].x += 2;
        earGeom.vertices[7].z -= .5;

        earGeom.vertices[2].x -= 2;
        earGeom.vertices[2].z -= .5;

        earGeom.vertices[3].x -= 2;
        earGeom.vertices[3].z += .5;
        earGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 9, 0));

        this.earL = new THREE.Mesh(earGeom, brownMat);
        this.earL.position.x = 2;
        this.earL.position.z = 2.5;
        this.earL.position.y = 5;
        this.earL.rotation.z = -Math.PI / 12;
        this.earL.castShadow = true;
        this.head.add(this.earL);

        this.earR = this.earL.clone();
        this.earR.position.x = -this.earL.position.x;
        this.earR.rotation.z = -this.earL.rotation.z;
        this.earR.castShadow = true;
        this.head.add(this.earR);

        let eyeGeom = new THREE.CubeGeometry(2, 4, 4);

        this.eyeL = new THREE.Mesh(eyeGeom, whiteMat);
        this.eyeL.position.x = 5;
        this.eyeL.position.z = 5.5;
        this.eyeL.position.y = 2.9;
        this.eyeL.castShadow = true;
        this.head.add(this.eyeL);

        let irisGeom = new THREE.CubeGeometry(.6, 2, 2);

        this.iris = new THREE.Mesh(irisGeom, blackMat);
        this.iris.position.x = 1.2;
        this.iris.position.y = 1;
        this.iris.position.z = 1;
        this.eyeL.add(this.iris);

        this.eyeR = this.eyeL.clone();
        this.eyeR.children[0].position.x = -this.iris.position.x;

        this.eyeR.position.x = -this.eyeL.position.x;
        this.head.add(this.eyeR);
    }

    look(xTarget, yTarget, xEarLTarget, xEarRTarget) {

        TweenMax.killTweensOf(this.head.rotation);

        this.head.rotation.x = xTarget;
        this.head.rotation.y = yTarget;
        this.earL.rotation.x = xEarLTarget;
        this.earL.rotation.y = xEarRTarget;

        this.earR.rotation.x = -.2 + xTarget * .5;
        this.earR.rotation.y = -.1 + yTarget * .4;
    }

    idle() {
        TweenMax.killTweensOf(this.head.rotation);

        if (this.isIdeling || Math.random() < .99) return;
        this.isIdeling = true;
        let tx = -Math.PI / 6 + Math.random() * Math.PI / 3;
        let ty = -Math.PI / 6 + Math.random() * Math.PI / 3;
        let tEarLx = -Math.PI / 6 + Math.random() * Math.PI / 3;
        let tEarRx = -Math.PI / 6 + Math.random() * Math.PI / 3;

        let speed = .5 + Math.random() * .5;
        TweenMax.to(this.idelingPos, speed, {
            x: tx, y: ty, eRx: tEarLx, eLx: tEarRx, ease: Power4.easeInOut, onUpdate: () => {
                this.look(this.idelingPos.x, this.idelingPos.y, this.idelingPos.eLx, this.idelingPos.eRx);
            }, onComplete: () => {
                this.isIdeling = false;
            }
        })
    }

    run(delta, speed) {
        this.status = "running";

        let s = Math.min(speed, this.maxSpeed);

        this.runningCycle += delta * s * .7;
        this.runningCycle = this.runningCycle % (Math.PI * 2);
        let t = this.runningCycle;

        let amp = 4;
        let disp = .2;

        // BODY

        this.body.position.y = 6 + Math.sin(t - Math.PI / 2) * amp;
        this.body.rotation.x = .2 + Math.sin(t - Math.PI / 2) * amp * .1;

        this.torso.rotation.x = Math.sin(t - Math.PI / 2) * amp * .1;
        this.torso.position.y = 7 + Math.sin(t - Math.PI / 2) * amp * .5;

        // MOUTH
        this.mouth.rotation.x = Math.PI / 16 + Math.cos(t) * amp * .05;

        // HEAD
        this.head.position.z = 2 + Math.sin(t - Math.PI / 2) * amp * .5;
        this.head.position.y = 8 + Math.cos(t - Math.PI / 2) * amp * .7;
        this.head.rotation.x = -.2 + Math.sin(t + Math.PI) * amp * .1;

        // EARS
        this.earL.rotation.x = Math.cos(-Math.PI / 2 + t) * (amp * .2);
        this.earR.rotation.x = Math.cos(-Math.PI / 2 + .2 + t) * (amp * .3);

        // EYES
        this.eyeR.scale.y = this.eyeL.scale.y = .7 + Math.abs(Math.cos(-Math.PI / 4 + t * .5)) * .6;

        // TAIL
        this.tail.rotation.x = Math.cos(Math.PI / 2 + t) * amp * .3;

        // FRONT RIGHT PAW
        this.pawFR.position.y = 1.5 + Math.sin(t) * amp;
        this.pawFR.rotation.x = Math.cos(t) * Math.PI / 4;


        this.pawFR.position.z = 6 - Math.cos(t) * amp * 2;

        // FRONT LEFT PAW

        this.pawFL.position.y = 1.5 + Math.sin(disp + t) * amp;
        this.pawFL.rotation.x = Math.cos(t) * Math.PI / 4;


        this.pawFL.position.z = 6 - Math.cos(disp + t) * amp * 2;

        // BACK RIGHT PAW
        this.pawBR.position.y = 1.5 + Math.sin(Math.PI + t) * amp;
        this.pawBR.rotation.x = Math.cos(t + Math.PI * 1.5) * Math.PI / 3;


        this.pawBR.position.z = -Math.cos(Math.PI + t) * amp;

        // BACK LEFT PAW
        this.pawBL.position.y = 1.5 + Math.sin(Math.PI + t) * amp;
        this.pawBL.rotation.x = Math.cos(t + Math.PI * 1.5) * Math.PI / 3;


        this.pawBL.position.z = -Math.cos(Math.PI + t) * amp;
    }
}

export default Rabbit;