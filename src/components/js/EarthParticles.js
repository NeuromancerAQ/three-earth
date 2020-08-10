import Params from './params';
import * as THREE from "three";
import dot from '../../../public/earth/dot.png';
import contour1 from '../../../public/earth/contour1_1.png';
import contour2 from '../../../public/earth/contour2_1.png';

let earthImg, earthImgData;
let dotTexture = new THREE.TextureLoader().load(dot);
let earthParticles = new THREE.Object3D();

let contour_url = [contour1, contour2];
let contour_texture = [new THREE.TextureLoader().load(contour_url[0]), new THREE.TextureLoader().load(contour_url[1])];

function planetContour(scene) {
    var _geometry = new THREE.SphereGeometry(Params.global.radius, 42, 42, 0, Math.PI);
    var m1 = new THREE.MeshBasicMaterial();
    m1.color = new THREE.Color(0x31b477);
    m1.fog = false;
    m1.transparent = true;
    m1.blending = THREE.AdditiveBlending;
    m1.depthWrite = false;

    var sphere1 = new THREE.Mesh(_geometry, m1);
    sphere1.visible = true;
    sphere1.matrixAutoUpdate = false;
    sphere1.updateMatrix();
    scene.add(sphere1);
    sphere1.matrixAutoUpdate = false;

    var m2 = m1.clone();

    var sphere2 = sphere1.clone();
    sphere2.material = m2;
    scene.add(sphere2);
    sphere2.rotation.y = Math.PI;
    sphere2.updateMatrix();

    m1.map = contour_texture[0];
    m1.map.generateMipalphaMaps = false;
    m1.map.magFilter = THREE.LinearFilter;
    m1.map.minFilter = THREE.LinearFilter;
    m1.needsUpdate = true;

    m2.map = contour_texture[1];
    m2.map.generateMipalphaMaps = false;
    m2.map.magFilter = THREE.LinearFilter;
    m2.map.minFilter = THREE.LinearFilter;
    m2.needsUpdate = true;

}

function createImg() {
    earthImg = document.getElementById('img');
    earthImg.onload = function () {
        let earthCanvas = document.createElement('canvas');
        let earthCtx = earthCanvas.getContext('2d');
        earthCanvas.width = earthImg.width;
        earthCanvas.height = earthImg.height;
        console.log(earthImg.width, earthImg.height);
        earthCtx.drawImage(earthImg, 0, 0, earthImg.width, earthImg.height);
        earthImgData = earthCtx.getImageData(0, 0, earthImg.width, earthImg.height);
        createEarthParticles();
    };
}

function createEarthParticles() {
    let positions = [];
    let materials = [];
    let sizes = [];
    for (var i = 0; i < 2; i++) {
        positions[i] = {
            positions: []
        };
        sizes[i] = {
            sizes: []
        };
        let mat = new THREE.PointsMaterial();
        mat.size = 1;
        mat.color = new THREE.Color(0x03d98e);
        mat.map = dotTexture;
        mat.depthWrite = false;
        mat.transparent = true;
        mat.opacity = 0;
        mat.side = THREE.FrontSide;
        mat.blending = THREE.AdditiveBlending;
        let n = i / 2;
        mat.t_ = n * Math.PI * 2;
        mat.speed_ = 0.05;
        mat.min_ = .2 * Math.random() + .5;
        mat.delta_ = .1 * Math.random() + .1;
        mat.opacity_coef_ = 1;
        materials.push(mat)
    }
    let spherical = new THREE.Spherical();
    spherical.radius = Params.global.radius;
    const step = 250;

    for (let i = 0; i < step; i++) {
        let vec = new THREE.Vector3();
        let radians = step * (1 - Math.sin(i / step * Math.PI)) / step + 0.5;
        // 每个纬线圈内的角度均分
        for (let j = 0; j < step; j += radians) {
            let c = j / step, // 底图上的横向百分比
                f = i / step, // 底图上的纵向百分比
                index = Math.floor(2 * Math.random()),
                pos = positions[index],
                size = sizes[index];
            // 根据横纵百分比判断在底图中的像素值
            if (isLandByUV(c, f)) {
                // 横纵百分比转换为theta和phi夹角
                spherical.theta = c * Math.PI * 2 - Math.PI / 2;
                // 横纵百分比转换为theta和phi夹角
                spherical.phi = f * Math.PI;
                // 夹角转换为世界坐标
                vec.setFromSpherical(spherical);
                pos.positions.push(vec.x);
                pos.positions.push(vec.y);
                pos.positions.push(vec.z);
                if (j % 3 === 0) {
                    size.sizes.push(6.0)
                }
            }
        }
    }

    for (let i = 0; i < positions.length; i++) {
        let pos = positions[i],
            size = sizes[i],
            bufferGeom = new THREE.BufferGeometry(),
            typedArr1 = new Float32Array(pos.positions.length),
            typedArr2 = new Float32Array(size.sizes.length);
        for (let j = 0; j < pos.positions.length; j++) {
            typedArr1[j] = pos.positions[j]
        }
        for (let j = 0; j < size.sizes.length; j++) {
            typedArr2[j] = size.sizes[j]
        }
        bufferGeom.addAttribute("position", new THREE.BufferAttribute(typedArr1, 3));
        bufferGeom.addAttribute('size', new THREE.BufferAttribute(typedArr2, 1));
        bufferGeom.computeBoundingSphere();
        let particle = new THREE.Points(bufferGeom, materials[i]);
        earthParticles.add(particle)
    }
}

function isLandByUV(c, f) {
    if (!earthImgData) { // 底图数据
        console.error('data error!')
    }
    let n = parseInt(earthImg.width * c), // 根据横纵百分比计算图象坐标系中的坐标
        o = parseInt(earthImg.height * f) // 根据横纵百分比计算图象坐标系中的坐标
    return 0 === earthImgData.data[4 * (o * earthImgData.width + n)]
}

export default (scene) => {
    planetContour(scene);
    createImg();
    return earthParticles
}

