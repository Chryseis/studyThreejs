import * as THREE from 'three'

class Log extends THREE.Mesh {
    constructor() {
        super(new THREE.BoxGeometry(10, 10, 40), new THREE.MeshPhongMaterial({
            color: 0x5C2626,
            shininess: 10,
            flatShading: THREE.FlatShading
        }))

        let logEndMaterial = new THREE.MeshPhongMaterial({
            color: 0xF9F5CE,
            shininess: 10,
            flatShading: THREE.FlatShading
        });

        let endGeometry = new THREE.BoxGeometry(7, 7, 0.5);
        let end = new THREE.Mesh(endGeometry, logEndMaterial);
        end.position.z = 20;
        this.add(end);

        let otherEnd = new THREE.Mesh(endGeometry, logEndMaterial);
        otherEnd.position.z = -20;
        this.add(otherEnd);
    }
}


export default Log;