<template>
  <div class="app">
    <router-view></router-view>
    <three-background></three-background>
  </div>
</template>

<script>

import ThreeBackground from './shared-components/ThreeBackground/ThreeBackground.vue'

export default {
  name: 'app',
  components: {
    ThreeBackground
  }
}
</script>

<style lang="scss" src="./commons/style/app.scss">
</style>
