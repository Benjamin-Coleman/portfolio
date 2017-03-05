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

import menuStore from '../../stores/MenuStore.js'
import LeaveAnimationDelay from '../../commons/script/LeaveAnimationDelay.js'
import {EventBus} from '../../event-bus.js'

import _ from 'lodash'

export default {
	name: 'home',

	data() {
		return {
			menuState: menuStore.state
		}
	},

	computed: {
		menuIsClosed(){
			return this.menuState.isClosed
		}
	},

	beforeRouteLeave (to, from, next) {
		let delay = 1500
		EventBus.$emit('leave-page', to.name)
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
