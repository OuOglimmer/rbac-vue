<script setup>
</script>

<template>
  <router-view />
</template>

<style lang="less">
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
#app {
  width: 100%;
  height: 100%;
}
* {
  transition: all 0.3s ease-in-out;
}
.no-transition {
  transition: none !important;
}
</style>
