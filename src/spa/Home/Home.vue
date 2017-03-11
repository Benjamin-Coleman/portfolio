<template lang="html">
	<div class="home">
		<navigation></navigation>
		<home-title></home-title>
		<home-button></home-button>
	</div>
</template>

<script>

import Navigation from '../../shared-components/Navigation/Navigation.vue'
import HomeButton from './HomeButton.vue'
import HomeTitle from './HomeTitle.vue'

import AnimationStore from '../../stores/AnimationStore.js'
import {EventBus} from '../../event-bus.js'
const animMap = require('../../anim-map.json')

import _ from 'lodash'

export default {
	name: 'home',

	data() {
		return {}
	},

	beforeRouteLeave (to, from, next) {
		let delay = 1500
		let targetedPage = to.name
		AnimationStore.setRouterInfo(from.name, targetedPage)
		EventBus.$emit('leave-page', targetedPage)
		_.delay(next, delay)
  },

	components: {
		Navigation,
		HomeButton,
		HomeTitle
	}
}
</script>

<style lang="scss">
</style>
