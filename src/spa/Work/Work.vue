<template lang="html">
  <div class="work">
		<navigation></navigation>
		<slider :slideId="$route.params.slideId"></slider>
  </div>
</template>

<script>

import Navigation from '../../shared-components/Navigation/Navigation.vue'
import Slider from '../../shared-components/Slider/Slider.vue'

export default {
	data() {
		return {
		}
	},
	components: {
		Navigation,
		Slider,
	}
}

</script>

<style lang="scss">
</style>
