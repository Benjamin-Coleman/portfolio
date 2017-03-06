<template lang="html">
  <div class="work">
		<navigation></navigation>
		<slider></slider>
  </div>
</template>

<script>

import Navigation from '../../shared-components/Navigation/Navigation.vue'
import Slider from '../../shared-components/Slider/Slider.vue'
import LeaveAnimationDelay from '../../commons/script/LeaveAnimationDelay.js'

import {EventBus} from '../../event-bus.js'
import _ from 'lodash'

export default {
	data() {
		return {}
	},

  beforeRouteLeave (to, from, next) {
    let delay = 1500
    EventBus.$emit('leave-page', to.name)
    _.delay(next, delay)
  },

	components: {
		Navigation,
		Slider,
	}
}

</script>

<style lang="scss">
</style>
