import * as THREE from 'three'
import Global from './Global'
import createPoint from './createPoint'
import createFlyLine from './createFlyLine'

export default (data) => {
    let group = new THREE.Group();
    group.name = data.id;
    createPoint(data, group);
    createFlyLine(data, group);
    Global.pl.add(group);
    data = null;
    group = null;
}
