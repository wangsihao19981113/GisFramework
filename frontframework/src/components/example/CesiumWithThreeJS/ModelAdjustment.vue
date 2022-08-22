<template>
  <div>
    <div id="cesiumContainer"></div>
    <div id="ThreeContainer"></div>
    <div class="adjustElement" style="margin: 0px">
      <el-button icon="el-icon-plus" @click="adjustPosition('lngplus')" ></el-button>
      <el-button icon="el-icon-minus" @click="adjustPosition('lngminus')"></el-button>
      <el-input v-model="input.lngUnion" placeholder="请输入内容"></el-input>
    </div>
    <div class="adjustElement" style="margin-top: 50px">
      <el-button icon="el-icon-plus" @click="adjustPosition('latplus')" ></el-button>
      <el-button icon="el-icon-minus" @click="adjustPosition('latminus')"></el-button>
      <el-input v-model="input.latUnion" placeholder="请输入内容"></el-input>
    </div>
    <div class="adjustElement" style="margin-top: 100px">
      <el-button icon="el-icon-plus" @click="adjustPosition('heightplus')" ></el-button>
      <el-button icon="el-icon-minus" @click="adjustPosition('heightminus')"></el-button>
      <el-input v-model="input.heightUnion" placeholder="请输入内容"></el-input>
    </div>
    <div class="adjustElement" style="margin-top: 150px">
      <el-button icon="el-icon-plus" @click="adjustRotation('xplus')"></el-button>
      <el-button icon="el-icon-minus" @click="adjustRotation('xminus')"></el-button>
      <el-input v-model="input.rotationXUnion" placeholder="请输入内容"></el-input>
    </div>
    <div class="adjustElement" style="margin-top: 200px">
      <el-button icon="el-icon-plus" @click="adjustRotation('yplus')"></el-button>
      <el-button icon="el-icon-minus" @click="adjustRotation('yminus')"></el-button>
      <el-input v-model="input.rotationYUnion" placeholder="请输入内容"></el-input>
    </div>
    <div class="adjustElement" style="margin-top: 250px">
      <el-button icon="el-icon-plus" @click="adjustRotation('zplus')"></el-button>
      <el-button icon="el-icon-minus" @click="adjustRotation('zminus')"></el-button>
      <el-input v-model="input.rotationZUnion" placeholder="请输入内容"></el-input>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

export default {
  name: "ThreeJSLoad3dtiles",
  data(){
    return {
      scene: null,
      clock: new THREE.Clock(),
      light: null,
      camera: null,
      controls: null,
      renderer: null,
      tilesRendererArr:[],
      cesium : {
        viewer: null
      },
      sphereYup:null,
      input:{
        lngUnion:0.01,
        latUnion:0.01,
        heightUnion:1,
        rotationXUnion:0.01,
        rotationYUnion:0.01,
        rotationZUnion:0.01
      }
    }
  },
  mounted() {
    this.test();
    this.initThree();
    this.initCesium();
    this.addGeometry();
    this.render();
  },
  methods:{
    test(){
      let coordinate = [[20.560585,110.48226],[20.577832,110.589409],[20.588599,110.589409],[20.593259,110.580654],[20.604668,110.585804],[20.601776,110.59164],[20.597116,110.590954],[20.595348,110.596619],[20.614148,110.605888],[20.610613,110.612583],[20.600651,110.608635],[20.604507,110.61636],[20.623948,110.626831],[20.620253,110.633526],[20.600008,110.626316],[20.59342,110.636959],[20.578796,110.631123],[20.560635,110.637131],[20.545044,110.628548],[20.532827,110.637646],[20.527843,110.632668],[20.534434,110.62254],[20.525593,110.615845],[20.527682,110.609665],[20.543276,110.614815],[20.549384,110.61327],[20.54199,110.609493],[20.544561,110.601768],[20.560314,110.608292],[20.573653,110.605202],[20.566743,110.601425],[20.558626,110.482528],[20.560585,110.48226]];
      let a = "";
      for(var i = 0 ; i < coordinate.length ; i++)
      {
        a = a + coordinate[i][1] + " " + coordinate[i][0] + ","
      }
      console.log(a)
    },
    adjustPosition(type){
      if(this.sphereYup) {
        let positionNow = this.cesium.viewer.scene.globe.ellipsoid.cartesianToCartographic(new Cesium.Cartesian3(this.sphereYup.position.x, this.sphereYup.position.y, this.sphereYup.position.z));
        let lat = positionNow.latitude / Math.PI * 180;
        let lng = positionNow.longitude / Math.PI * 180;
        let height = positionNow.height;
        switch (type) {
          case "lngplus": {
            lng = lng + Number(this.input.lngUnion);
          }break
          case "lngminus": {
            lng = lng - Number(this.input.lngUnion);
          }break
          case "latplus": {
            lat = lat + Number(this.input.latUnion);
          }break
          case "latminus": {
            lat = lat - Number(this.input.latUnion);
          }break
          case "heightplus":{
            height = height + Number(this.input.heightUnion);
          }break
          case "heightminus":{
            height = height - Number(this.input.heightUnion);
          }break
        }
        this.changePosition(lng,lat,height,this.sphereYup)
      }
    },
    adjustRotation(type){
      if(this.sphereYup) {
        let x = this.sphereYup.rotation.x;
        let y = this.sphereYup.rotation.y;
        let z = this.sphereYup.rotation.z;
        switch (type) {
          case "xplus": {
            x = x + Number(this.input.rotationXUnion);
          }break
          case "xminus": {
            x = x - Number(this.input.rotationXUnion);
          }break
          case "yplus": {
            y = y + Number(this.input.rotationYUnion);
          }break
          case "yminus": {
            y = y - Number(this.input.rotationYUnion);
          }break
          case "zplus":{
            z = z + Number(this.input.rotationZUnion);
          }break
          case "zminus":{
            z = z - Number(this.input.rotationZUnion);
          }break
        }
        this.changeRotation(x,y,z,this.sphereYup)
      }
    },

    changePosition(lng,lat,height,item){
      if(item) {
        let position = Cesium.Cartesian3.fromDegrees(lng, lat, height);
        item.position.set(position.x,position.y,position.z)
      }
    },

    changeRotation(x,y,z,item){
      if(item) {
        item.rotation.set(x,y,z)
      }
    },





    initThree(){
      this.scene = new THREE.Scene()
      this.scene.add(new THREE.AmbientLight(0x999999)) // 环境光
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
      this.scene.add(this.light)
      // 初始化相机
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000000)
      this.camera.position.set(0, 0, 0)
      const container = document.getElementById('ThreeContainer') // threeJS挂载位置
      this.renderer = new THREE.WebGLRenderer({
        alpha: true
      })

      // this.renderer.setClearColor(0xff0000) // 设置背景颜色
      this.renderer.setPixelRatio(window.devicePixelRatio) // 为了兼容高清屏幕
      this.renderer.setSize(window.innerWidth, window.innerHeight) // 改成这样就可以居中
      this.renderer.shadowMap.enabled = true;
      container.appendChild(this.renderer.domElement)

      //添加控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.target.set(0, 0, 0) // ------------------
      this.controls.minDistance = 1
      this.controls.maxDistance = 500000
      // this.controls.maxPolarAngle = Math.PI / 3
      // this.controls.update()
      window.addEventListener('resize', this.onWindowResize, false) // 添加窗口监听事件（resize-onresize即窗口或框架被重新调整大小）

    },
    initCesium() {
      var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDg1ZWFmNS1mYWE4LTRmNTktYjE5MC1jM2M1MTQ5ZDVjZDkiLCJpZCI6MTI1ODYsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjE0Mjk1NDl9.v4k0l7bOOcnU4qHEU-ddKnGBnKmRQFHMXYGOjPvayqE";
      Cesium.Ion.defaultAccessToken = token;
      this.cesium.viewer = new Cesium.Viewer("cesiumContainer", {
        useDefaultRenderLoop: false,
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
        destination : Cesium.Cartesian3.fromDegrees(113.86494867,22.51559057,50000),
        orientation : {
          heading : Cesium.Math.toRadians(0.0),
          pitch : Cesium.Math.toRadians(-90.0),//倾斜角度
          roll : 0.0
        },
        duration:0,//动画持续时间
        complete:()=>{//飞行结束之后执行的方法
        }
      });
    },
    // 窗口监听函数
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    },
    addGeometry(){
      let geometry = new THREE.BoxGeometry(1, 1, 1);
      let sphere = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xFFFF00, side: THREE.DoubleSide }));   //12面体
      // sphere.scale.set(5000,5000,5000);
      // sphere.position.z+=15000;
      // translate "up" in Three.js space so the "bottom" of the mesh is the handle
      let position = Cesium.Cartesian3.fromDegrees(113.86494867,22.51559057,0);
      sphere.scale.set(5000,5000,5000);
      sphere.uuid = "sphere";
      this.sphereYup = new THREE.Group();
      this.sphereYup.add(sphere)
      this.scene.add(this.sphereYup);
      this.sphereYup.position.set(position.x, position.y, position.z);
    },
    render(){
      //this.controls.update();
      // for (let i = 0 ; i < this.tilesRendererArr.length ; i++) {
      //   this.tilesRendererArr[i].update();
      // }
      // this.offsetParent.rotation.set( 0, 0, 0 );
      requestAnimationFrame(this.render);
      this.renderCamera();
      this.renderer.render(this.scene, this.camera);
      this.cesium.viewer.render();
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
  }
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

.adjustElement{
  position:absolute;
  left: 100px;
  top: 100px;
  display: flex;
}

.adjustElement .el-input{
  margin-left: 10px;
}

</style>