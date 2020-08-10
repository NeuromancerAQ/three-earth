import * as THREE from 'three';
import Params from "./params";

export default (lon, lat, r) => {
    lon = (lon) *  Math.PI / 180;
    lat = (lat) *  Math.PI / 180;
    var y = r * Math.sin(lon);
    var temp = r * Math.cos(lon);
    var x = temp * Math.sin(lat);
    var z = temp * Math.cos(lat);
    return new THREE.Vector3(
        x,y,z
    )
}

//地球的经度的0度是定义在本初子午线那里，而我们这里算0度是在ZOY平面的
//第二种坐标转换....很坑....
// export default (lon, lat, r) => {
//     if (void 0 === lon) {
//         var a = "40.705565,-74.1180857".split(",");
//         lon = a[0], lat = a[1]
//     }
//     var i = 1 - (parseFloat(lon) + 90) / 180;
//     (i += .014) > 1 && (i -= 1);
//     var v = (parseFloat(lat) + 180) / 360;
//     v -= .031,v < 0 && (v = 1 + v);
//
//     let vec = new THREE.Vector3();
//     let spherical = new THREE.Spherical();
//     spherical.radius = r;
//     spherical.theta = v * Math.PI * 2 - Math.PI / 2;
//     spherical.phi = i * Math.PI;
//     vec.setFromSpherical(spherical);
//
//     return vec
// }




