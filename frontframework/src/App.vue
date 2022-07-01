<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

import Home from "@/components/home/HomePage";

export default {
  name: 'App',
  components: {
    Home,
  }
}
</script>

<style>
body{
  margin: 0;
  overflow:hidden
}
#app {
  width: 100%;
  height: 100%;
}
</style>
