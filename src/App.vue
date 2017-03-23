<template>
  <div class="app">
    <loader></loader>
    <router-view></router-view>
    <three-background></three-background>
  </div>
</template>

<script>

import ThreeBackground from './shared-components/ThreeBackground/ThreeBackground.vue'
import Loader from './shared-components/Loader/Loader.vue'

export default {
  name: 'app',
  components: {
    ThreeBackground,
    Loader
  }
}
</script>

<style lang="scss" src="./commons/style/app.scss">
</style>
