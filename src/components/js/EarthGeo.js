import * as THREE from 'three';
import drawThreeGeo from './threeGeoJSON';
import worldGeo from '../../../public/earth/worldGeo.json';
import Params from './params';

export default () => {
  let globeGgeometry = new THREE.SphereGeometry(Params.global.radius, Params.global.widthSegments, Params.global.heightSegments);

  let globeMaterial = new THREE.MeshBasicMaterial({
    color: Params.global.globalMeshColor,
    wireframe: Params.global.globalMeshwireframe,
    transparent: true,
    opacity: Params.global.globalMeshColor,
    //是否影响深度缓存
    depthWrite: Params.global.globalMeshDepthWrite
  });

  let earth = new THREE.Mesh(globeGgeometry, globeMaterial);

  drawThreeGeo(worldGeo, Params.global.radius, 'sphere', {
    color: Params.global.globalLineColor,
    transparent: false
  }, earth);

  return earth;
}
