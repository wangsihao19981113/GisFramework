<template>
  <div id="index" style="width: 100%;height: 100%">
  </div>
</template>

<script>

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default {
  name: 'ThreeJSComponenet',
  data() {
    return {
      scene: '',
      light: '',
      camera: '',
      controls: '',
      renderer: '',
      model_list:[],
    }
  },
  methods: {
    // 初始化three.js相关内容
    init() {
      this.scene = new THREE.Scene()
      this.scene.add(new THREE.AmbientLight(0x999999)) // 环境光
      // this.scene.background
      // this.light = new THREE.DirectionalLight(0xdfebff, 0.45) // 从正上方（不是位置）照射过来的平行光，0.45的强度
      // this.light.position.set(100, 600, 400)
      // this.light.position.multiplyScalar(0.3)
      // this.light.shadow.camera.near = 20 // 产生阴影的最近距离
      // this.light.shadow.camera.far = 20000 // 产生阴影的最远距离
      // this.light.shadow.camera.left = -500 // 产生阴影距离位置的最左边位置
      // this.light.shadow.camera.right = 500 // 最右边
      // this.light.shadow.camera.top = 500 // 最上边
      // this.light.shadow.camera.bottom = -500 // 最下面
      //
      // // 光源开启阴影
      // this.light.castShadow = true
      // this.light.shadow.mapSize = new THREE.Vector2(1024, 1024)
      // var helper = new THREE.DirectionalLightHelper(this.light, 5)
      // this.scene.add(helper)
      // this.scene.add(this.light)

      // 初始化相机
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000000)
      this.camera.position.set(100, 0, 700)
      this.renderer = new THREE.WebGLRenderer({
        alpha: true
      })
      // this.renderer.setClearColor(0xff0000) // 设置背景颜色
      this.renderer.setPixelRatio(window.devicePixelRatio) // 为了兼容高清屏幕
      this.renderer.setSize(window.innerWidth, window.innerHeight) // 改成这样就可以居中
      this.renderer.shadowMap.enabled = true

      const container = document.getElementById('index') // threeJS挂载位置
      container.appendChild(this.renderer.domElement)
      window.addEventListener('resize', this.onWindowResize, false) // 添加窗口监听事件（resize-onresize即窗口或框架被重新调整大小）

      // 初始化控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.target.set(0, 0, 0) // ------------------
      this.controls.minDistance = 80
      this.controls.maxDistance = 500000
      this.controls.maxPolarAngle = Math.PI / 3
      this.controls.update()
    },
    // 窗口监听函数
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    },
    render() {
      requestAnimationFrame(this.render)
      this.renderer.render(this.scene, this.camera)
    },
    // 外部模型加载函数
    loadGltf() {
      const that = this
      // 加载模型
      var loader = new GLTFLoader()
      loader.setPath('gltf/')
      loader.load('fengche_dh_new.gltf', function (gltf) {
        // 就是两个模型 这个是动态的,下面是静态的,这些从sketchfab上面下载即可
        gltf.scene.traverse((object) => {
          if (object.isMesh) {
            // 修改模型的材质
            console.log(object)
            object.castShadow = true;
            object.frustumCulled = false;
            object.material.emissive = object.material.color;
            object.material.emissiveMap = object.material.map;
            that.model_list.push(object)
          }
          console.log("组合")

        })
        gltf.scene.position.set(0,-350,0)
        gltf.scene.receiveShadow = true
        that.scene.add(gltf.scene)
      })
    },
    addGeometry() {
      const floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1)
      const floorMaterial = new THREE.MeshPhongMaterial({
        color: 0xFF0000,
        shininess: 0
        // wireframe: true
      })
      const floor = new THREE.Mesh(floorGeometry, floorMaterial)
      floor.rotation.x = -0.5 * Math.PI
      floor.position.y = -2.1
      // 地板接受阴影开启
      floor.receiveShadow = true
      this.scene.add(floor)
    },
    LeftClickControl(){
      var self = this;
      this.renderer.domElement.addEventListener(
          "click",
          event => {
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            console.log(mouse);
            var raycaster = new THREE.Raycaster();
            raycaster.setFromCamera( mouse, self.camera );
            const intersects = raycaster.intersectObjects( [self.model_list[0]], false );
            let INTERSECTED
            if ( intersects.length > 0 ) {
              if ( INTERSECTED != intersects[ 0 ].object ) {
                if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
                INTERSECTED = intersects[ 0 ].object;
                INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                INTERSECTED.material.emissive.setHex( 0xff0000 );
              }
            } else {

              if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

              INTERSECTED = null;

            }

          }
      );
    }
  },
  mounted() {
    this.init()
    this.loadGltf()
    this.render()
    //this.addGeometry()
    this.LeftClickControl()
    window.that = this
  },
  components: {}
}

</script>

<style scoped>

</style>