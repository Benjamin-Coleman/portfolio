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

export default {
	name: 'home',

	data() {
		return {}
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
