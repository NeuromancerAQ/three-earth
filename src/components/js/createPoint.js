import * as THREE from "three";
import Params from "./params";
import {CSS2DObject} from "three-css2drender";
import getPos from "./getPos";
import Global from './Global';
import throttle from 'lodash.throttle';

let vec = new THREE.Vector3();
function createStartName(x, y, z, id, text, group) {
    let nameDiv = document.createElement('div');
    nameDiv.id = 'label' + id;
    nameDiv.className = 'label';
    nameDiv.textContent = text;
    nameDiv.style.margin = Params.startText.margin;
    nameDiv.style.border = Params.startText.border;
    nameDiv.style.borderRadius = Params.startText.borderRadius;
    nameDiv.style.color = Params.startText.color;
    nameDiv.style.fontSize = Params.startText.fontSize;
    nameDiv.style.backgroundColor = Params.startText.backgroundColor;
    let earthLabel = new CSS2DObject(nameDiv);
    earthLabel.position.set(x, y, z + 0.1);
    earthLabel.lookAt(vec);
    group.add(earthLabel);
    nameDiv = null;
    earthLabel = null;
}

//绘制点形状
function createPointMesh(x, y, z, temp, group) {
    let geometry = new THREE.CircleGeometry(Params.marker.radius, Params.marker.segments);
    let material = new THREE.MeshBasicMaterial({
        color: Params.marker.color[temp],
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z + 0.1);
    mesh.lookAt(vec);
    group.add(mesh);

    // material.dispose();
    // material =  null;
    // mesh.geometry.dispose();
    // mesh.material.dispose();
    // mesh = null;
}

//绘制点周围的扩散
function createPointWave(x, y, z, temp, group) {
    let geometry = new THREE.CircleGeometry(Params.marker.radius * 1.5, Params.marker.segments);
    let material = new THREE.MeshBasicMaterial({
        color: Params.marker.color[temp],
    });
    geometry.vertices.shift();
    let wave = new THREE.LineLoop(geometry, material);
    wave.position.set(x, y, z + 0.1);
    wave.lookAt(vec);

    doAnimate(wave);
    group.add(wave);

    // material.dispose();
    // material =  null;
    // wave.geometry.dispose();
    // wave.material.dispose();
    // wave = null;
}

function doAnimate(wave) {
    let colorIndex = 0.1;
    let d = throttle(() => {
        let ratio = colorIndex / Params.marker.pointsLength;
        wave.scale.set(ratio * Params.marker.spreadSize, ratio * Params.marker.spreadSize, wave.scale.z);
        colorIndex++;
        if (colorIndex > Params.marker.pointsLength - 1) {
            colorIndex = 0.1;
        }
    }, Params.marker.spreadSpeed);
    Global.waveList.push(d);
    d = null;
}

//绘制光柱
function createFlashBar(x, y, z, value, temp, group) {
    let t = Math.floor(Math.random() * 2);
    let height = value / 10;
    let geometry = new THREE.PlaneGeometry(Params.marker.radius * 2, height);
    let map = new THREE.TextureLoader().load(Params.marker.textures[t]);
    let material = new THREE.MeshBasicMaterial({
        map: map,
        depthTest: false,
        transparent: true,
        color: Params.marker.color[t],
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });
    let plane = new THREE.Mesh(geometry, material);

    //转换光柱使其面向圆心
    let m = new THREE.Matrix4();
    m.makeRotationX(Math.PI / 2);
    let v = new THREE.Vector3(0, 0, -height / 2);
    m.setPosition(v);
    geometry.applyMatrix(m);
    let plane2 = plane.clone();
    //双面光锥
    plane2.rotation.z = Math.PI / 2;
    plane.add(plane2);
    plane.position.set(x, y, z);
    plane.lookAt(vec);
    plane.matrixAutoUpdate = false;
    plane.updateMatrix();
    group.add(plane);

    // geometry.dispose();
    // geometry = null;
    // map.dispose();
    // map = null;
    // material.map.dispose();
    // // material.map = null;
    // material.dispose();
    // material = null;
    // // console.log(plane2);
    // // console.log(plane);
    // plane2.geometry.dispose();
    // plane2.material.map.dispose();
    // plane2.material.dispose();
    // plane2 = null;
    // plane.geometry.dispose();
    // plane.material.map.dispose();
    // plane.material.dispose();
    // plane.children[0].geometry.dispose();
    // plane.children[0].material.map.dispose();
    // plane.children[0].material.dispose();
    // plane = null;
    // m = null;
    // v = null;
}

export default (d, group)=> {
    let alat = d.attack.position[0];
    let alon = d.attack.position[1];
    // const tlat = d.target.position[0];
    // const tlon = d.target.position[1];
    let value = Math.floor(Math.random() * 200);
    //颜色
    let temp = Math.floor(Math.random() * Params.marker.color.length);
    //坐标转换
    let axyz = getPos(alon, alat, Params.global.radius);
    // const txyz = getPos(tlon, tlat, Params.global.radius);
    let [ax, ay, az] = [axyz.x, axyz.y, axyz.z];
    // const [tx, ty, tz] = [txyz.x, txyz.y, txyz.z];
    let text = d.attack.city;
    let id = d.id;

    createPointMesh(ax,ay,az,temp,group);
    createPointWave(ax,ay,az,temp,group);
    createFlashBar(ax,ay,az,value,temp,group);
    createStartName(ax,ay,az,id,text,group);


    // if(Global.worldData.length >= 30) {
    //     Global.worldData.splice(0,1);
    //     Global.waveList.splice(0,1);
    //     // tween.stop();
    //     // console.log(TWEEN);
    //     let removeMesh = Global.pl.children[0];
    //     removeMesh.traverse(function (node) {
    //         if (node.geometry) {
    //             node.geometry.dispose();
    //             node.geometry = null;
    //         }
    //         if (node.material) {
    //             if (node.material.type === 'MeshLineMaterial') {
    //                 node.material.uniforms.map.value.dispose();
    //                 node.material.uniforms.map.value = null;
    //             }
    //             if (node.material.map) {
    //                 node.material.map.dispose();
    //                 node.material.map = null;
    //             }
    //             node.material.dispose();
    //             node.material = null;
    //         }
    //         node = null;
    //     });
    //     Global.pl.remove(removeMesh);
    //     Global.renderer.renderLists.dispose();
    //     if (document.getElementsByClassName('label')[0]) {
    //         document.getElementsByClassName('label')[0].remove();
    //     }
    // }
}
