import * as THREE from 'three';
import Params from './params';

//创建空间粒子
export default () => {
    var radius = Params.global.radius;
    var total = Params.star.total;
    var positions = new Float32Array(total * 3);
    var color = new THREE.Color(Params.star.color);
    var spherical = new THREE.Spherical();
    var vec3 = new THREE.Vector3();

    for (var i = 0; i < total; i++) {
        var ii = i * 3;
        spherical.radius = radius * (1 + Math.random() * .8);
        spherical.theta = Math.random() * 8;
        spherical.phi = .3 + Math.random() * 2.2;
        vec3.setFromSpherical(spherical);
        positions[ii] = vec3.x;
        positions[ii + 1] = vec3.y;
        positions[ii + 2] = vec3.z;
    }
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.computeBoundingSphere();
    var material = new THREE.PointsMaterial();
    material.size = Params.star.size;
    material.color = color;
    material.transparent = true;
    material.opacity = Params.star.opacity;
    material.blending = THREE.AdditiveBlending;
    material.depthWrite = false;

    var points = new THREE.Points(geometry, material);
    points.matrixAutoUpdate = false;

    var star = new THREE.Object3D();
    star.add(points);
    return star;
}
