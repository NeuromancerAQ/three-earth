<template>
    <div>
        <!--        <div class="title">-->
        <!--            <p>3维地球</p>-->
        <!--        </div>-->
        <div id="three">
            <div class="info">
                <table>
                    <thead>
                    <tr>
                        <td>名字</td>
                        <td>地址</td>
                    </tr>
                    </thead>
                    <tbody id="tby">
                    <tr v-for="(item,index) in country">
                        <td>{{item.name}}</td>
                        <td>{{item.position}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div class="risk">
                <table>
                    <thead>
                    <tr>
                        <td>信息</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in info">
                        <td>{{item.risk.info}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <img id="img" src="../../public/earth/earth.png" style="display: none"/>
    </div>
</template>

<script>
    import * as THREE from 'three';
    import {mapGetters} from 'vuex';
    import Params from '../components/js/params';
    import Global from '../components/js/Global';
    import OrbitControls from 'three-orbitcontrols';
    import {CSS2DRenderer} from 'three-css2drender';
    import createGlobal from '../components/js/EarthGeo';
    import createCloud from '../components/js/clouds';
    import createStars from '../components/js/stars';
    import createDotAndLine from '../components/js/pointAndFlyLine';

    export default {
        name: "threeEarth",
        data() {
            return {
                country: [
                    {
                        name: "北京",
                        position: [116.40, 39.90]
                    }, {
                        name: "沈阳",
                        position: [123.43, 41.80]
                    }, {
                        name: "上海",
                        position: [121.47, 31.23]
                    }, {
                        name: "纽约",
                        position: [-74.0059731, 40.7143528]
                    }
                ],
                info: null,
            }
        },
        computed: {
            ...mapGetters(['getMapData'])
        },
        created() {
            this.$socket.emit('get');
        },
        mounted() {
            let container = document.getElementById('three');
            let camera, scene, renderer, labelRenderer;
            let stats, controls, labelcontrols;
            //场景
            scene = new THREE.Scene();
            scene.background = new THREE.TextureLoader().load(Params.bg.Url);
            Global.scene = scene;
            //相机
            camera = new THREE.PerspectiveCamera(Params.camera.fov, window.innerWidth / window.innerHeight, Params.camera.near, Params.camera.far);
            camera.position.set(Params.camera.position.x, Params.camera.position.y, Params.camera.position.z);
            //设置坐标轴向上方向，默认(0,1,0)
            camera.up.set(0, 1, 0);
            camera.lookAt(0, 0, 0);
            Global.camera = camera;

            //渲染器
            renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            container.appendChild(renderer.domElement);
            Global.renderer = renderer;

            labelRenderer = new CSS2DRenderer();
            labelRenderer.setSize(window.innerWidth, window.innerHeight);
            labelRenderer.domElement.style.position = 'absolute';
            labelRenderer.domElement.style.top = 0;
            container.appendChild(labelRenderer.domElement);

            //控制器
            // controls = new OrbitControls(camera, renderer.domElement);
            labelcontrols = new OrbitControls(camera, labelRenderer.domElement);

            //fps检测
            // stats = new Stats();
            // container.appendChild(stats.dom);

            //自适应大小
            const resize = () => {
                renderer.setSize(window.innerWidth, window.innerHeight);
                labelRenderer.setSize(window.innerWidth, window.innerHeight);
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
            };
            window.addEventListener('resize', resize, false);

            //地球
            let global = createGlobal();
            scene.add(global);

            //球面粒子
            // let particles = EarthParticles(scene);
            // scene.add(particles);

            //云
            let cloud = createCloud();
            scene.add(cloud);

            //空间粒子
            if (Params.star.showStar) {
                let star = createStars();
                scene.add(star);
            }

            let pointLineGroup = new THREE.Group();
            pointLineGroup.name = 'pointLine';
            scene.add(pointLineGroup);

            Global.pl = Global.scene.getObjectByName('pointLine');

            var raycaster = new THREE.Raycaster();
            var mouse = new THREE.Vector2();

            function onMouseMove(event) {
                event.preventDefault()
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            }

            //动画
            const animation = () => {
                THREE.Cache.clear();
                renderer.renderLists.dispose();
                scene.dispose();
                raycaster.setFromCamera(mouse, camera)
                var intersects = raycaster.intersectObjects(scene.children[0].children)
                if (intersects.length> 0) {
                    for (var i = 0; i < intersects.length; i++) {
                        intersects[i].object.material.color.set(0xff0000);
                    }
                } else {

                }

                // for (let i = 0; i < scene.children.length; i++) {
                //     if (i === 2) {
                //         scene.children[i].rotation.y -= 0.0005;
                //     } else {
                //         scene.children[i].rotation.y -= 0.003;
                //     }
                // }
                //对应EarthParticles
                // let objects = particles.children;
                // objects.forEach(obj => {
                //     let material = obj.material;
                //     material.t_ += material.speed_;
                //     material.opacity = (Math.sin(material.t_) * material.delta_ + material.min_) * material.opacity_coef_;
                //     material.needsUpdate = true;
                // });
                if (Global.tween) {
                    Global.tween.update();
                }
                if (Global.waveList.length) {
                    for (let i = 0; i < Global.waveList.length; i++) {
                        Global.waveList[i] && Global.waveList[i]()
                    }
                }
                renderer.render(scene, camera);
                labelRenderer.render(scene, camera);
                // stats.update();
                requestAnimationFrame(animation);
            };
            animation();
            this.info = Global.worldData;
            window.addEventListener( 'mousemove', onMouseMove, false )
        },
        sockets: {
            connect() {
                // console.log('连接connect');
            },
            SOCKET_INFO(value) {
                // this.testtest({
                //      data: value
                //  }).then(res=>{
                //     Global.worldData.push(res.data);
                //     //创建点和飞线
                //     createDotAndLine(res.data);
                // }).catch(err=>{
                //     console.log(err)
                // })
                // Store.commit(MapMutationTypes.GET_DATA_SUCCESS, {
                //     data: value
                // })
                Global.worldData.push(value);
                // 创建点和飞线
                createDotAndLine(value);
            },
            reconnect() {
                // console.log('重新连接');
            },
            disconnect() {
                // console.log('socket断开连接');
            }
        },
        methods: {
        },
        // watch: {
        //     getMapData: {
        //         handler: () => {
        //             let newD = Store.getters.getMapData;
        //             // console.log(newD);
        //             let data = {};
        //             data.attack = newD.attack;
        //             data.target = newD.target;
        //             data.risk = newD.risk;
        //             data.id = newD.id;
        //             Global.worldData.push(data);
        //             // 创建点和飞线
        //             createDotAndLine(data);
        //             data = null;
        //             newD = null;
        //         }
        //     }
        // }
    }
</script>

<style scoped>
    table {
        border-collapse: collapse;
        text-align: center;
    }

    table, thead, tbody, td {
        border: 1px solid #42b983;
    }

    #three {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .info {
        position: absolute;
        right: 0;
        top: 20px;
        color: aqua;
    }

    .risk {
        position: absolute;
        left: 0;
        top: 20px;
        color: aqua;
    }

    .title {
        font-size: 20px;
    }
</style>
