import * as THREE from 'three'

const TWOPI = Math.PI * 2;
const HALFPI = Math.PI / 2;

function rule3(v, vmin, vmax, tmin, tmax) {
    var nv = Math.max(Math.min(v, vmax), vmin);
    var dv = vmax - vmin;
    var pc = (nv - vmin) / dv;
    var dt = tmax - tmin;
    var tv = tmin + (pc * dt);
    return tv;
}

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

export {
    rule3,
    makeSprite
}