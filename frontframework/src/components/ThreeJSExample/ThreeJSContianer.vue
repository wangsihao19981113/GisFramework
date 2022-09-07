<template>
  <div id="threejscontianer"></div>
</template>

<script>
import * as THREE from "three"
import {OrbitControls} from "three/examples/js/controls/OrbitControls"
export default {
  name: "ThreeJSCreater",
  mounted() {
    debugger
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 10000000 );

    let renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById("threejscontainer").appendChild( renderer.domElement );

    let controls = new OrbitControls( camera, renderer.domElement )
    controls.minDistance = 0.1;
    controls.maxDistance = 10000000;

    let geometry = new THREE.BoxGeometry( 1, 1, 1 );
    let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    let cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    let animate = function () {
      requestAnimationFrame( animate );
      // controls.update();
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render( scene, camera );
    };

    window.three = {
      camera:camera,
      scene:scene,
      controls:controls
    }
    animate();
  }
}
</script>

<style scoped>

</style>
