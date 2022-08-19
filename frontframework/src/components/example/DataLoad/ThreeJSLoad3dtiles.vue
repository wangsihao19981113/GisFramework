<template>
  <div>
    <div id="cesiumContainer"></div>
    <div id="ThreeContainer"></div>
  </div>
</template>

<script>
import {TilesRenderer , B3DMLoader , CMPTLoader} from "3d-tiles-renderer"
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
      }
    }
  },
  mounted() {
    this.initThree();
    // for (let i = 0; i < 78; i++)
    // {
    //   this.addB3DM("/3dtiles/3dtiles2/NoLod_"+i+".b3dm");
    // }
    //this.addGeometry2();
    this.addGeometry2()
    this.add3dtiles3();
    this.render();
  },
  methods:{
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

      let self = this;
      initCesium()


      function initCesium() {
        var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDg1ZWFmNS1mYWE4LTRmNTktYjE5MC1jM2M1MTQ5ZDVjZDkiLCJpZCI6MTI1ODYsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjE0Mjk1NDl9.v4k0l7bOOcnU4qHEU-ddKnGBnKmRQFHMXYGOjPvayqE";
        Cesium.Ion.defaultAccessToken = token;
        self.cesium.viewer = new Cesium.Viewer("cesiumContainer", {
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
      }


    },
    // 窗口监听函数
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    },
    // add3dtiles(){
    //    // 加载json，解析json 取出children中的路径进行拼装加载
    //   const qzpath = '/3dtiles/building/'
    //   let self = this;
    //
    //   this.$axios.get(qzpath + 'tileset.json').then((res)=>{
    //     // console.log(res)
    //     res = res.data;
    //     const tilesetArr = res.root.children
    //     for (const tilese of tilesetArr) {
    //       // console.log(qzpath + tilese.content.uri)
    //       let tilesRenderer = new TilesRenderer( qzpath + tilese.content.uri )
    //       tilesRenderer.setCamera( self.camera )
    //       tilesRenderer.setResolutionFromRenderer( self.camera, self.renderer )
    //       let tilesObj = tilesRenderer.group
    //       tilesObj.rotation.set(-Math.PI / 2, 0, 0)
    //       self.scene.add( tilesObj )
    //       self.tilesRendererArr.push(tilesRenderer)
    //     }
    //   })
    // },
    addGeometry() {
      const floorGeometry = new THREE.PlaneGeometry(100, 100, 0.1)
      const floorMaterial = new THREE.MeshPhongMaterial({
        color: 0x000000,
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
    addGeometry2(){
      let geometry = new THREE.SphereGeometry(1, 32, 32);
      let sphere = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xFFFF00, side: THREE.DoubleSide }));   //12面体
      // sphere.scale.set(5000,5000,5000);
      // sphere.position.z+=15000;
      // translate "up" in Three.js space so the "bottom" of the mesh is the handle
      let position = Cesium.Cartesian3.fromDegrees(122,23,0);
      sphere.scale.set(5000,5000,5000);
      sphere.uuid = "sphere";
      var sphereYup = new THREE.Group();
      sphereYup.add(sphere)
      this.scene.add(sphereYup);
      sphereYup.position.set(position.x, position.y, position.z);
    },
    add3dtiles2(){
      let tilesRenderer = new TilesRenderer( '/3dtiles/3dtiles/tileset.json' );
      tilesRenderer.setCamera( this.camera );
      tilesRenderer.setResolutionFromRenderer( this.camera, this.renderer );
      TilesRenderer.onLoadModel = onLoadModel;
      TilesRenderer.onDisposeModel = onDisposeModel;
      this.offsetParent = new THREE.Group();
      this.offsetParent.position.set(0,0,0)
      // this.offsetParent.scale.set(5000,5000,5000)
      this.scene.add( this.offsetParent );
      this.offsetParent.add( tilesRenderer.group );
      this.tilesRendererArr.push(tilesRenderer);


      const DEFAULT = 0;
      // const GRADIENT = 1;
      // const TOPOGRAPHIC_LINES = 2;
      // const LIGHTING = 3;
      // const params = {
      //
      //   'material': DEFAULT,
      //   'orthographic': false,
      //   'rebuild': this.add3dtiles2(),
      //
      // };


      function onLoadModel( scene ) {

        scene.traverse( c => {
          debugger
          if ( c.isMesh ) {

            c.originalMaterial = c.material;

          }

        } );
        updateMaterial( scene )

      }

      function onDisposeModel( scene ) {

        scene.traverse( c => {

          if ( c.isMesh ) {

            c.material.dispose();

          }

        } );



      }

      function updateMaterial( scene ) {
        debugger
        const materialIndex = 0;
        scene.traverse( c => {

          if ( c.isMesh ) {

            c.material.dispose();
            switch ( materialIndex ) {

              case DEFAULT:
                c.material = c.originalMaterial;
                c.material.side = 2;
                c.receiveShadow = false;
                c.castShadow = false;
                break;

            }


          }

        } );
      }


    },
    add3dtiles3(){
        this.offsetGroup = new THREE.Group();
        let position = Cesium.Cartesian3.fromDegrees(113.86494867,22.51559057,0);
        this.offsetGroup.position.set(position.x,position.y,position.z);
        this.offsetGroup.rotation.set(0.3,0.3,0.4)
        this.offsetGroup.rotateX(45)
        window.offsetGroup = this.offsetGroup;
        this.scene.add( this.offsetGroup );
        const qzpath = '/3dtiles/3dtiles2/'
        let self = this;
        this.$axios.get(qzpath + 'tileset.json').then((res)=>{
          // console.log(res)
          res = res.data;
          let tilesetArr = res.root.children
          console.log(tilesetArr);
          for(let i = 0 ; i < tilesetArr.length ; i++)
          {
            if(tilesetArr[i].content.uri)
            {
              let url = tilesetArr[i].content.uri;
              if(url.indexOf("b3dm") > -1)
              {
                self.addB3DM(qzpath+url);
              }
              if(url.indexOf("cmpt")>-1)
              {
                self.addCMPT(qzpath+url);
              }
            }
          }
        })
    },

    addCMPT(url){
      let model;
      let self = this;
      new CMPTLoader()
          .load( url )
          .then( res => {

            console.log( res );
            model = res.scene;
            self.offsetGroup.add( model );



          } );
    },
    addB3DM(url){
      let model;
      let self = this;
      function batchIdHighlightShaderMixin( shader ) {

        const newShader = { ...shader };
        newShader.uniforms = {
          highlightedBatchId: { value: - 1 },
          highlightColor: { value: new THREE.Color( 0xFFC107 ).convertSRGBToLinear() },
          ...THREE.UniformsUtils.clone( shader.uniforms ),
        };
        newShader.extensions = {
          derivatives: true,
        };
        newShader.lights = true;
        newShader.vertexShader =
            `
			attribute float _batchid;
			varying float batchid;
		` +
            newShader.vertexShader.replace(
                /#include <uv_vertex>/,
                `
			#include <uv_vertex>
			batchid = _batchid;
			`
            );
        newShader.fragmentShader =
            `
			varying float batchid;
			uniform float highlightedBatchId;
			uniform vec3 highlightColor;
		` +
            newShader.fragmentShader.replace(
                /vec4 diffuseColor = vec4\( diffuse, opacity \);/,
                `
			vec4 diffuseColor =
				abs( batchid - highlightedBatchId ) < 0.5 ?
				vec4( highlightColor, opacity ) :
				vec4( diffuse, opacity );
			`
            );

        return newShader;

      }

      new B3DMLoader()
          .load( url )
          .then( res => {

            console.log( res );
            model = res.scene;
            self.offsetGroup.add( model );

            // const box = new THREE.Box3();
            // box.setFromObject( model );
            // box.getCenter( self.offsetGroup.position ).multiplyScalar( - 1 );


            // reassign the material to use the batchid highlight variant.
            // in practice this should copy over any needed uniforms from the
            // original material.
            // model.traverse( c => {
            //
            //   if ( c.isMesh ) {
            //
            //     // c.material = new THREE.ShaderMaterial( batchIdHighlightShaderMixin( THREE.ShaderLib.standard ) );
            //
            //   }
            //
            // } );

          } );

    },
    render(){
      //this.controls.update();
      // for (let i = 0 ; i < this.tilesRendererArr.length ; i++) {
      //   this.tilesRendererArr[i].update();
      // }
      // this.offsetParent.rotation.set( 0, 0, 0 );
      // this.offsetParent.updateMatrixWorld( true );
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
</style>