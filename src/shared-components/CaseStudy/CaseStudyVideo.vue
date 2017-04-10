<template lang="html">
	<div class="case-study__video">
		<video class="case-study__video-element " loop ref="video">
			<slot></slot>
		</video>
	</div>
</template>

<script>

import inViewport from 'in-viewport'
import _ from 'lodash'

export default {

	mounted(){
		this.events()
	},

	beforeDestroy(){
		this.unlistenEvents()
	},

	methods: {

		events(){
			window.addEventListener('wheel', this.isVisible)
		},

		unlistenEvents(){
			window.removeEventListener('wheel', this.isVisible)
		},

		isVisible(){
			inViewport(this.$refs.video) ? this.$refs.video.play() : this.$refs.video.pause()
		}

	}

}
</script>

<style lang="scss">

.case-study__video-element {
	width: 100%;
	font-size: 30px;
	display: block;
	position: relative;
	padding: 5em 5em;
	background-color: #03162A;
	z-index: 1;
}

.case-study__video {
	font-size: 30px;
	margin: 5em 0em;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;

}

.case-study__video-half {

	width: 40%;
	margin-bottom: 0em;

	.case-study__video-element {
		padding: 5em 5em;
		max-height: 530px;
	}

	&:first-child {
		.case-study__video-element {
			margin-right: 5em;
			padding-left: 5em;
			padding-right: 2.5em;
		}
	}

	&:last-child {
		.case-study__video-element {
			margin-left: 5em;
			padding-left: 2.5em;
			padding-right: 5em;
		}
	}

}

.case-study__video-row {
	display: flex;
	align-items: center;
	justify-content: center;
}

</style>
