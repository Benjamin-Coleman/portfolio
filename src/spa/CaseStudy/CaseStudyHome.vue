<template lang="html">
	<div class="case-study-home">
		<case-study></case-study>
	</div>
</template>

<script>
import CaseStudy from './CaseStudy.vue'
import _ from 'lodash'
import {EventBus} from '../../event-bus.js'

import MenuStore from '../../stores/MenuStore.js'
import AnimationStore from '../../stores/AnimationStore.js'

export default {
	name: 'case-study-home',

	components: {
		CaseStudy
	},

	beforeRouteLeave (to, from, next) {
		console.log(from)
		if (!MenuStore.state.isAnimated) {
			let delay = 1500
			let targetedPage = to.name

			AnimationStore.setRouterInfo(from.name, targetedPage)
			EventBus.$emit('leave-page', targetedPage)
			_.delay(next, delay)
		}
	},

}
</script>

<style lang="css">
</style>
