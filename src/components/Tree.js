import * as THREE from 'three'
import Cone from './Cone'


class Tree extends THREE.Object3D {
    constructor(size) {
        super();
        this.size = size || 6 + Math.random();
    }

    makeTree() {
        let lastCone;
        let cone;

        for (let i = 0; i < this.size; i++) {
            cone = new Cone((this.size - i) + 1, i);
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
    }
}

export default Tree;