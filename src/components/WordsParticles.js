import * as THREE from 'three';
import ShaderLoader from '../common/js/ShaderLoader';
import FBO from '../common/js/fbo';
import {TweenMax, Linear} from "gsap";

const Deferred = require('../common/js/deferred');
const WebFont = require('webfontloader');

let wordsInstance = null;
let textCreated = false;

class WordsParticles {

    constructor(renderer) {
        if (wordsInstance) {
            return wordsInstance;
        }
        this.bgr1 = document.getElementsByClassName("bgr1")[0];
        this.bgr2 = document.getElementsByClassName("bgr2")[0];
        this.bgrBack = this.bgr1;
        this.bgrFront = this.bgr2;
        this.renderer = renderer;
        this.index = this.oldIndex = 0;
        this.color = this.oldColor = 0x000000;
        this.timer = 0;
        this.isVisible = false;
        wordsInstance = this;
    }

    get fontReady() {
        const dfd = new Deferred();

        try {
            WebFont.load({
                custom: {
                    families: ['YesevaOne-Regular'],
                },
                loading: function () {
                },
                active: function () {
                    dfd.resolve();
                },
                inactive: function () {
                    dfd.resolve();
                },
            });
        } catch (e) {
            dfd.resolve();
        }

        return dfd.promise;
    }

    init(callback) {
        if (textCreated) {
            callback();
            return;
        }

        this.callback = callback;
        // var myFont = new FontFace('Yeseva', 'url(/assets/fonts/YesevaOne-Regular.ttf)');
        // myFont.load().then(() => {
        this.fontReady.then(() => {
            this.createTexts();
        });
    }

    createTexts() {
        this.texts = [];
        this.timer = 0;
        this.particlesColumns = 2048;
        this.particlesRows = 1000;
        this.particlesCount = this.particlesColumns * this.particlesRows;
        //this.titleCanvas = document.getElementById("mycanvas");
        this.titleCanvas = document.createElement('canvas');

        this.ctx = this.titleCanvas.getContext("2d");
        this.ctx.scale(1, 1);
        this.titleCanvas.width = this.particlesColumns;
        this.titleCanvas.height = this.particlesColumns;

        this.ctx.textAlign = "center";
        //this.ctx.font = "230px 'Tangerine'";
        var posY = 0;

        // for (var i = 0, l = this.texts.length; i < l; i++) {
        //     posY += 180;
        //     var t = this.texts[i].toUpperCase();
        //     t = t.split("").join("");
        //     this.ctx.fillText(t, this.titleCanvas.width / 2, posY);
        //     posY += 10;
        // }

        this.tex = new THREE.CanvasTexture(this.titleCanvas);
        var sl = new ShaderLoader();
        sl.loadShaders({
            simulation_vs: "",
            simulation_fs: "",
            render_vs: "",
            render_fs: ""
        }, "/", this.createPoints.bind(this));

        textCreated = true;
    }

    createPoints() {
        this.simulationShader = new THREE.ShaderMaterial({
            uniforms: {
                timer: {type: "f", value: this.timer},
                currentPosition: {type: "f", value: 0},
                newPosition: {type: "f", value: 0},
                texture: {type: "t", value: this.tex},
                texSize: {type: "f", value: this.particlesColumns},
                texStep: {type: "f", value: this.particlesRows},
                depth: {type: "f", value: 300},
                scale: {type: "f", value: 7000},
                animRatio: {type: "f", value: 0},
                hideRatio: {type: "f", value: 2}
            },
            vertexShader: require('../assets/glsl/simulation_vs.glsl'),
            fragmentShader: require('../assets/glsl/simulation_fs.glsl'),
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });

        this.renderShader = new THREE.ShaderMaterial({
            uniforms: {
                positions: {type: "t", value: null},
                currentCol: {type: "v3", value: new THREE.Vector3(1, 1, 1)},
                newCol: {type: "v3", value: new THREE.Vector3(1, 1, 1)},
                pointSize: {type: "f", value: 1},
                animRatio: {type: "f", value: 0},
            },
            vertexShader: require('../assets/glsl/render_vs.glsl'),
            fragmentShader: require('../assets/glsl/render_fs.glsl'),
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });

        //*
        FBO.init(this.particlesColumns, this.particlesRows, this.renderer, this.simulationShader, this.renderShader);
        this.particles = FBO.particles;
        this.particles.position.z = 0;
        this.particles.position.x = 0;
        this.particles.position.y = -1500

        this.callback();

    }

    updateText(text, color) {
        this.color = color;
        // texture swap
        // console.log(this.simulationShader)
        // this.simulationShader.uniforms.currentPosition.value = this.oldIndex;
        // this.simulationShader.uniforms.newPosition.value = this.index;
        this.ctx.clearRect(0, 0, this.particlesColumns, this.particlesColumns);
        this.ctx.font = "200px 'Tangerine-Regular'";

        let texts = text.split(',');
        let posY = 0;
        for (let i = 0, l = texts.length; i < l; i++) {
            posY += 180;
            let t = texts[i].toUpperCase();
            t = t.split("").join("");
            this.ctx.fillText(t, this.titleCanvas.width / 2, posY);
            posY += 50;
        }
        // this.ctx.fillText(text, this.titleCanvas.width / 2, 180);
        this.simulationShader.uniforms.texture.value = new THREE.CanvasTexture(this.titleCanvas);

        // color particles
        this.renderShader.uniforms.animRatio.value = 0;
        this.renderShader.uniforms.currentCol.value = new THREE.Color(this.oldColor);
        this.renderShader.uniforms.newCol.value = new THREE.Color(this.color);
        TweenMax.to(this.renderShader.uniforms.animRatio, .5, {value: 5, ease: Linear.easeNone});

        // position particles
        this.simulationShader.uniforms.animRatio.value = 0;
        TweenMax.to(this.simulationShader.uniforms.animRatio, 1.5, {value: 2, ease: Linear.easeNone});

        this.oldColor = color;

        this.show();

    }

    hide(callback) {
        this.isVisible = false;
        TweenMax.to(this.simulationShader.uniforms.hideRatio, 1, {
            value: 2,
            ease: Linear.easeNone,
            onComplete: callback
        });
    }

    show() {
        if (this.isVisible) return;
        this.isVisible = true;
        this.simulationShader.uniforms.hideRatio.value = 2;
        TweenMax.to(this.simulationShader.uniforms.hideRatio, 2, {value: 0, ease: Linear.easeNone});
    }

    updateRender() {
        this.timer++;
        this.simulationShader.uniforms.timer.value = this.timer;
        FBO.update();
    }
}

export default WordsParticles;


// WEBPACK FOOTER //
// ./src/assets/scripts/worlds/WordsParticles.js