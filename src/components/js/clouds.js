import * as THREE from 'three';
import Params from './params'

THREE.XRayMaterial = function (params) {
    var uniforms = {
        uTex: {type: "t", value: params.map || new THREE.Texture()},
        offsetRepeat: {value: new THREE.Vector4(0, 0, 1, 1)},
        alphaProportion: {type: "1f", value: params.alphaProportion || 0.5},
        diffuse: {value: params.color || new THREE.Color(0xffffff)},
        opacity: {value: params.opacity || 1},
        gridOffset: {value: 0}
    };

    setInterval(function () {
        uniforms.gridOffset.value += params.gridOffsetSpeed || 1;
    }, 40);

    //webGL着色器
    var m = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader:
            "\
                  varying float _alpha;\
                  varying vec2 vUv;\
                  uniform vec4 offsetRepeat;\
                  uniform float alphaProportion;\
                  \
                  void main() {\
                      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\
                      vUv = uv * offsetRepeat.zw + offsetRepeat.xy;\
                      \
                      vec4 worldPosition = modelMatrix * vec4( vec3( position ), 1.0 );\
                      vec3 cameraToVertex = normalize( cameraPosition - worldPosition.xyz);\
                      _alpha = 1.0 - max( 0.0, dot( normal, cameraToVertex ) );\
                      _alpha = max( 0.0, (_alpha - alphaProportion) / (1.0 - alphaProportion) );\
                  }"
        ,
        fragmentShader:
            "uniform sampler2D uTex;\
                  uniform vec3 diffuse;\
                  uniform float opacity;\
                  uniform float gridOffset;\
                  \
                varying float _alpha;\
                varying vec2 vUv;\
                  \
                  void main() {\
                    vec4 texColor = texture2D( uTex, vUv );\
                    float _a = _alpha * opacity;\
                    if( _a <= 0.0 ) discard;\
                    _a = _a * ( sin( vUv.y * 2000.0 + gridOffset ) * .5 + .5 );\
                    gl_FragColor = vec4( texColor.rgb * diffuse, _a );\
                \
                }"
        ,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false
    });

    return m;
};

export default () => {
    var geometry = new THREE.SphereGeometry(Params.clouds.radius, Params.clouds.widthSegments, Params.clouds.heightSegments);

    //创建云层材料
    var material = new THREE.XRayMaterial({
        map: new THREE.TextureLoader().load(Params.clouds.Url),
        alphaProportion: .5,
        color: new THREE.Color(Params.clouds.color),
        opacity: 1,
        gridOffsetSpeed: Params.clouds.gridOffsetSpeed
    });
    var clouds_mesh = new THREE.Mesh(geometry, material);
    clouds_mesh.matrixAutoUpdate = false;

    return clouds_mesh
}
