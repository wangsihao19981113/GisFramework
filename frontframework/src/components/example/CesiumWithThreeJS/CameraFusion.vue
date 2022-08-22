<template>
  <div>
    <div id="cesiumContainer"></div>
    <div id="ThreeContainer"></div>
  </div>
</template>

<script>
//Ceisum和Threejs相机融合
import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
var scene = null;
export default {
  name: "ThreeJSContainer",
  data() {
    return {
      clock: new THREE.Clock(),
      mixers : [],
      light: '',
      camera: '',
      controls: '',
      renderer: '',
      popupDiv:"",
      model_list:[],
      PopupDivLabel:null,
      cesium : {
        viewer: null
      }
    }
  },
  methods: {
    // 初始化three.js相关内容
    initThree() {
      scene = new THREE.Scene()
      scene.add(new THREE.AmbientLight(0x999999)) // 环境光
      this.light = new THREE.DirectionalLight(0xdfebff, 1.3) // 从正上方（不是位置）照射过来的平行光，0.45的强度
      this.light.position.set(100, 600, 400)
      this.light.position.multiplyScalar(0.3)
      this.light.shadow.camera.near = 20 // 产生阴影的最近距离
      this.light.shadow.camera.far = 20000 // 产生阴影的最远距离
      this.light.shadow.camera.left = -500 // 产生阴影距离位置的最左边位置
      this.light.shadow.camera.right = 500 // 最右边
      this.light.shadow.camera.top = 500 // 最上边
      this.light.shadow.camera.bottom = -500 // 最下面
      // 光源开启阴影
      this.light.castShadow = true
      this.light.shadow.mapSize = new THREE.Vector2(1024, 1024)
      scene.add(this.light)
      // 初始化相机
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000000)
      this.camera.position.set(0, 0, 100000)
      const container = document.getElementById('ThreeContainer') // threeJS挂载位置
      this.renderer = new THREE.WebGLRenderer({
        alpha: true
      })
      // this.renderer.setClearColor(0xff0000) // 设置背景颜色
      this.renderer.setPixelRatio(window.devicePixelRatio) // 为了兼容高清屏幕
      this.renderer.setSize(window.innerWidth, window.innerHeight) // 改成这样就可以居中
      this.renderer.shadowMap.enabled = true;
      container.appendChild(this.renderer.domElement)
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.target.set(0, 0, 0) // ------------------
      this.controls.minDistance = 80
      this.controls.maxDistance = 500000
      // this.controls.maxPolarAngle = Math.PI / 3
      // this.controls.update()
      window.addEventListener('resize', this.onWindowResize, false) // 添加窗口监听事件（resize-onresize即窗口或框架被重新调整大小）
    },
    initCesium() {
      var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDg1ZWFmNS1mYWE4LTRmNTktYjE5MC1jM2M1MTQ5ZDVjZDkiLCJpZCI6MTI1ODYsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjE0Mjk1NDl9.v4k0l7bOOcnU4qHEU-ddKnGBnKmRQFHMXYGOjPvayqE";
      Cesium.Ion.defaultAccessToken = token;
      this.cesium.viewer = new Cesium.Viewer("cesiumContainer", {
        useDefaultRenderLoop: true,
        selectionIndicator: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animate: false,
        timeline: false,
        fullscreenButton: false,
        navigationInstructionsInitiallyVisible: false,
        allowTextureFilterAnisotropic: false,
        contextOptions: {
          webgl: {
            alpha: false,
            antialias: true,
            preserveDrawingBuffer: true,
            failIfMajorPerformanceCaveat: false,
            depth: true,
            stencil: false,
            anialias: false
          }
        },
        animation:false,
        targetFrameRate: 60,
        resolutionScale: 0.1,
        orderIndependentTranslucency: true,
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
          url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
        }),
        baseLayerPicker: true,
        geocoder: false,
        automaticallyTrackDataSourceClocks: false,
        dataSources: null,
        clock: null,
        terrainShadows: Cesium.ShadowMode.DISABLED
      });
      //帧率显示
      this.cesium.viewer.scene.debugShowFramesPerSecond = true;
      this.cesium.viewer.camera.flyTo({
        destination : Cesium.Cartesian3.fromDegrees(112,23,100000),
        orientation : {
          heading : Cesium.Math.toRadians(0.0),
          pitch : Cesium.Math.toRadians(-90.0),//倾斜角度
          roll : 0.0
        },
        duration:0,//动画持续时间
        complete:()=>{//飞行结束之后执行的方法
        }
      });
      this.cesium.viewer.cesiumWidget.creditContainer.style.display = "none";
    },
    // 窗口监听函数
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    },
    render() {
      requestAnimationFrame(this.render)
      this.renderCamera();
      this.renderer.render(scene, this.camera);
    },
    addGeometry(){
      let geometry = new THREE.SphereGeometry(1, 32, 32);
      let sphere = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xFFFF00, side: THREE.DoubleSide }));   //12面体
      // sphere.scale.set(5000,5000,5000);
      // sphere.position.z+=15000;
      // translate "up" in Three.js space so the "bottom" of the mesh is the handle
      let position = Cesium.Cartesian3.fromDegrees(112,23,0);
      sphere.scale.set(5000,5000,5000);
      sphere.uuid = "sphere";
      var sphereYup = new THREE.Group();
      sphereYup.add(sphere)
      scene.add(sphereYup);
      sphereYup.position.set(position.x, position.y, position.z);
    },
    renderCamera() {
      // register Three.js scene with Cesium
      this.camera.fov = Cesium.Math.toDegrees(this.cesium.viewer.camera.frustum.fovy) // ThreeJS FOV is vertical
      this.camera.updateProjectionMatrix();

      // Clone Cesium Camera projection position so the
      // Three.js Object will appear to be at the same place as above the Cesium Globe
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      this.camera.matrixAutoUpdate = false;
      var cvm = this.cesium.viewer.camera.viewMatrix;
      var civm = this.cesium.viewer.camera.inverseViewMatrix;
      this.camera.matrixWorld.set(
          civm[0], civm[4], civm[8], civm[12],
          civm[1], civm[5], civm[9], civm[13],
          civm[2], civm[6], civm[10], civm[14],
          civm[3], civm[7], civm[11], civm[15]
      );
      this.camera.matrixWorldInverse.set(
          cvm[0], cvm[4], cvm[8], cvm[12],
          cvm[1], cvm[5], cvm[9], cvm[13],
          cvm[2], cvm[6], cvm[10], cvm[14],
          cvm[3], cvm[7], cvm[11], cvm[15]
      );

      let ThreeContainer = document.getElementById("ThreeContainer")
      var width = ThreeContainer.clientWidth;
      var height = ThreeContainer.clientHeight;
      var aspect = width / height;
      this.camera.aspect = aspect;
      this.camera.updateProjectionMatrix();
    },
  },
  mounted() {
    this.initThree()
    this.initCesium()
    this.render()
    this.addGeometry()
  },
  components: {}
}
</script>

<style scoped>
#cesiumContainer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  margin: 0;
  overflow: hidden;
  padding: 0;
  font-family: sans-serif;
}

#ThreeContainer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  margin: 0;
  overflow: hidden;
  padding: 0;
  font-family: sans-serif;
  z-index: 100;
  pointer-events: none;
}

body {
  height: 100%;
  width: 100%;
  margin: 0;
  overflow: hidden;
  padding: 0;
  background: #000;
}
</style>