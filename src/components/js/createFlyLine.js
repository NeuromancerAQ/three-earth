import * as THREE from "three";
import Params from "./params";
import Global from './Global';
import './MeshLine';
import Stroke from "../../../public/earth/stroke.png";
import TWEEN from "tween.js";
import getPos from "./getPos";

//初始化线的行动样式
function generatePath(startLonLat, tartgetLonLat) {
    const R = Params.global.radius;
    let startPos = getPos(...startLonLat, R);
    let targetPos = getPos(...tartgetLonLat, R);
    let midPos = new THREE.Vector3().addVectors(startPos, targetPos).multiplyScalar(0.5);
    let midLonLat = [0.5 * (startLonLat[0] + tartgetLonLat[0]), 0.5 * (startLonLat[1] + tartgetLonLat[1])];
    let midLonLatPos = getPos(...midLonLat, R);
    let r = startPos.distanceTo(targetPos) * 0.5;
    let between = midLonLatPos.length() - midPos.length();
    let factor = (R + r - between) / midPos.length();
    let {x, y, z} = midPos;
    let mid = new THREE.Vector3(x, y, z).multiplyScalar(factor);
    let n = new THREE.CatmullRomCurve3([startPos, mid, targetPos]);
    midPos = null;
    mid = null;
    return n
}

function updateLine(LENGTH, curvePoints, ml, group) {
    let tween = new TWEEN.Tween({x: 0});
    tween.to({x: Params.flyLine.pointNum + LENGTH}, Params.flyLine.time);
    tween.onUpdate(function () {
        let points = curvePoints;
        let length = Math.ceil(this.x);
        let tp = new Float32Array(LENGTH * 3);
        if (length < LENGTH) {
            for (let i = 0; i < LENGTH; i++) {
                let k = i < length ? i : length;
                let {x, y, z} = points[k];
                tp[3 * i] = x;
                tp[3 * i + 1] = y;
                tp[3 * i + 2] = z;
            }
        } else if (length < Params.flyLine.pointNum) {
            for (let i = 0; i < LENGTH; i++) {
                let k = length - LENGTH + i;
                let {x, y, z} = points[k];
                tp[3 * i] = x;
                tp[3 * i + 1] = y;
                tp[3 * i + 2] = z;
            }
        } else {
            for (let i = 0; i < LENGTH; i++) {
                let k = length - LENGTH + i >= Params.flyLine.pointNum ? Params.flyLine.pointNum - 1 : length - LENGTH + i;
                let {x, y, z} = points[k];
                tp[3 * i] = x;
                tp[3 * i + 1] = y;
                tp[3 * i + 2] = z;
            }
        }
        ml.setGeometry(tp, (t) => {
            return t
        })
    });
    tween.onComplete((d) => {
        if (group.name == Global.worldData[0].id && Global.worldData.length >= 30) {
            Global.worldData.splice(0,1);
            Global.waveList.splice(0,1);
            let removeMesh = Global.pl.children[0];
            removeMesh.traverse(function (node) {
                if (node.geometry) {
                    node.geometry.dispose();
                    node.geometry = null;
                }
                if (node.material) {
                    if (node.material.type === 'MeshLineMaterial') {
                        node.material.uniforms.map.value.dispose();
                        node.material.uniforms.map.value = null;
                    }
                    if (node.material.map) {
                        node.material.map.dispose();
                        node.material.map = null;
                    }
                    node.material.dispose();
                    node.material = null;
                }
                node = null;
            });
            Global.pl.remove(removeMesh);
            if (document.getElementsByClassName('label')[0]) {
                document.getElementsByClassName('label')[0].remove();
            }
        }
        else {
            d.x = 0;
            tween.start();
        }
    });
    tween.start()
}

export default (d, group)=> {
    let LENGTH = Params.flyLine.length;
    let start = [d.attack.position[1], d.attack.position[0]];
    let end = [d.target.position[1], d.target.position[0]];
    let latlng = [start, end];
    let curve = generatePath(...latlng);
    let curvePoints = curve.getPoints(Params.flyLine.pointNum);
    let points = new Float32Array(LENGTH * 3);
    // console.log(points);
    for (let [index, point] of curvePoints.entries()) {
        let {x, y, z} = curvePoints[0];
        points[index * 3] = x;
        points[index * 3 + 1] = y;
        points[index * 3 + 2] = z;
    }
    //在MeshLine中引入
    let ml = new THREE.MeshLine();
    ml.setGeometry(points, (p) => {
        return p
    });
    let map = new THREE.TextureLoader().load(Stroke);
    let mat = new THREE.MeshLineMaterial({
        useMap: true,
        map: map,
        color: new THREE.Color(Params.flyLine.color),
        opacity: Params.flyLine.opacity,
        resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
        sizeAttenuation: false,
        lineWidth: Params.flyLine.lineWidth,
        depthTest: true,
        transparent: true
    });
    let mesh = new THREE.Mesh(ml.geometry, mat);
    group.add(mesh);

    // map.dispose();
    // map = null;
    // mat.uniforms.map.value.dispose();
    // mat.dispose();
    // mat = null;
    // mesh.geometry.dispose();
    // mesh.material.uniforms.map.value.dispose();
    // mesh.material.dispose();
    // mesh = null;

    updateLine(LENGTH, curvePoints, ml, group);
    Global.tween = TWEEN;
}
