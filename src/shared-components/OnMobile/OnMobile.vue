<template lang="html">

	<div class="on-mobile">
		<about-content></about-content>
	</div>

</template>

<script>

import AboutContent from '../../spa/About/AboutContent.vue'

export default {

	components: {
		AboutContent
	}

}
</script>

<style lang="scss">

	.on-mobile {
		position: absolute;
		z-index: 1000;
		top: 0px;
		height: 0px;
		width: 100%;
		height: 100%;
		background-color: #021B39;
		display: none;
		overflow: scroll;

		@media screen and (max-width: 760px) {
			display: block;
		}

	}

</style>
