<template lang="html">
	<div class="page-about">
		<navigation></navigation>
		<about-content></about-content>
	</div>
</template>

<script>

import Navigation from '../../shared-components/Navigation/Navigation.vue'
import AboutContent from './AboutContent.vue'

import {EventBus} from '../../event-bus.js'
import _ from 'lodash'

export default {

	beforeRouteLeave (to, from, next) {
		let delay = 1500
		EventBus.$emit('leave-page', to.name)
		_.delay(next, delay)
  },

	components: {
		Navigation,
		AboutContent
	}
}
</script>

<style lang="scss">

	.page-about {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

</style>
