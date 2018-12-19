import * as THREE from 'three'
import {Power2, RoughEase} from "gsap";

class Flame extends THREE.Group {
    constructor(color) {
        super();
        this.light = this.makeLight(color);

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

    makeLight(color) {
        let light = new THREE.PointLight(color || 0xFFFFFF, 1, 0);

        light.castShadow = true;
        light.shadow.mapSize.width = 512;
        light.shadow.mapSize.height = 512;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 120;
        light.shadow.bias = 0.9;
        light.shadow.radius = 13;
        light.power = 20;
        return light;
    }

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

        tl.to(this.light, speed, {
            power: 8 + 9 * Math.random(),
            ease: ease,
        });
    }
}

export default Flame;