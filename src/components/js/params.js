import bg from '../../../public/earth/bg.jpg';
import clouds from '../../../public/earth/clouds.jpg';
//光柱
import img1 from '../../../public/earth/lightray.jpg';
import img2 from '../../../public/earth/lightray_yellow.jpg';

export default {
    //scene背景图片
    bg: {
        Url: bg,
    },
    //相机
    camera: {
        //fov, 可视角度
        fov: 70,
        //近端距离
        near: 1,
        //远端距离
        far: 1000,
        position: {
            x: 120,
            y: 0,
            z: 0
        }
    },

    //地球
    global: {
        //球体半径
        radius: 50,
        //水平方向的分段数
        widthSegments: 42,
        //垂直方向的分段数
        heightSegments: 42,
        //球体颜色
        globalMeshColor: 0x333333,
        //是否将地球渲染为线框
        globalMeshwireframe: false,
        //球体透明度
        globalMeshOpacity: 1,
        //是否影响深度缓存
        globalMeshDepthWrite: false,
        //球体国家边界线颜色
        globalLineColor: 0x0fd488
    },

    //云层
    clouds: {
        radius: 60,
        //水平方向的分段数
        widthSegments: 65,
        //垂直方向的分段数
        heightSegments: 45,
        //云层图片
        Url: clouds,
        //云层颜色
        color: 0xfb2f2c5,
        //云层网格波浪速度
        gridOffsetSpeed: 0.6
    },

    //star
    star: {
        //是否展示空间粒子
        showStar: true,
        //空间粒子数
        total: 700,
        //颜色
        color: 0xfb2f2c5,
        size: 0.3,
        opacity: 0.6,
    },

    //marker点和光柱
    marker: {
        //marker点的颜色
        color: ['#fff', '#ff0', '#f0f', '#00f'],
        //半径
        radius: 0.7,
        //多边形marker的边
        segments : 6,
        //调整扩散效果 越小越快（还可配合函数的等待时间调整，相当于speed是 50个点，每个点间隔为spreadSpeed ms）
        pointsLength: 70,
        spreadSpeed: 50,
        //扩散大小(自身几倍)
        spreadSize: 1,
        //光柱纹理
        textures: [img1, img2],
    },

    //飞线
    flyLine: {
        //长度
        length: 15,
        //飞线飞行时间
        time: 3000,
        //将飞线分为多少点
        pointNum: 70,
        //颜色
        color: '#007947',
        //线的粗细
        lineWidth: 7,
        opacity: 0.7,
    },
    startText: {
        color: '#fff',
        fontSize: '16px',
        backgroundColor: 'red',
        margin: '-1em',
        border: '1px solid red',
        borderRadius: '0px',
    }
}
