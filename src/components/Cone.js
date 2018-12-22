import * as THREE from 'three'

let treeMaterial = new THREE.MeshPhongMaterial({
    color: 0x2C9E4B,
    shininess: 20,
    side: THREE.FrontSide,
    flatShading: THREE.SmoothShading
});

class Cone  {
    constructor(size, translate) {
        this.geometry = new THREE.CylinderGeometry(size / 2, size, size, 6);
        if (translate) {
            this.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, size, 0));
        }

       return new THREE.Mesh(this.geometry, treeMaterial)
    }
}

export default Cone;