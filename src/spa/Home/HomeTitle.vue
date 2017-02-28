<template lang="html">

	<div class="name-title">

		<div class="name-title__title-container">
			<div class="name-title__title" ref="title">
				{{ name }}
			</div>
			<div class="name-title__subtitle" ref="subtitle">
				{{ subtitle }}
			</div>
			<div class="name-title__square" ref="square"></div>
		</div>

	</div>

</template>

<script>
import {TimelineLite, TweenLite,Expo} from 'gsap'
import SplitText from '../../commons/script/SplitText.js'
import {EventBus} from '../../event-bus.js'

export default {
	data() {
		return {
			name: 'Raoul Gaillard',
			subtitle: "I’m a Dev & Ui student at Hetic.<br> Looking  for a 6 months internship.",
		}
	},
	mounted() {

		this.events()

		let splittedSubtitle = new SplitText(this.$refs.subtitle, {
			classToGive: 'subtitle-lines',
			whatToSplit: 'lines'
		})

		this.appearAnim = new TimelineLite()
		this.appearAnim.fromTo(this.$refs.title, 3,{z: -500, autoAlpha:0}, {z:0, autoAlpha: 1, ease: Expo.easeOut})
		this.appearAnim.staggerFromTo(this.$refs.subtitle.children, 2, {y:20, autoAlpha: 0}, { y:0, autoAlpha: 1, ease: Expo.easeOut}, .1, .5)
		this.appearAnim.fromTo(this.$refs.square, 3, {z:-1000, autoAlpha: 0}, {z: -200, autoAlpha: 1, ease: Expo.easeOut}, 0)

		this.openMenuAnim = new TimelineLite({paused: true})
			this.openMenuAnim.to(this.$refs.title, 3, {z:-500, ease: Expo.easeOut})
			this.openMenuAnim.staggerTo(this.$refs.subtitle.children, 2, { y:20, autoAlpha: 0, ease: Expo.easeOut}, .1, 0)
			this.openMenuAnim.to(this.$refs.square, 3, {z:-1000, ease: Expo.easeOut}, 0)

		this.closeMenuAnim = new TimelineLite({paused: true})
			this.closeMenuAnim.to(this.$refs.title, 3, {z:0, ease: Expo.easeOut})
			this.closeMenuAnim.staggerTo(this.$refs.subtitle.children, 2, { y:0, autoAlpha: 1, ease: Expo.easeOut}, .1, .5)
			this.closeMenuAnim.to(this.$refs.square, 3, {z:-200, ease: Expo.easeOut}, 0)

	},
	methods: {
		events(){
			EventBus.$on('toggle-menu', isClosed=>{
				this.toggleMenu(isClosed)
			})
		},

		toggleMenu(isClosed){
			this.closeMenuAnim.isActive() ? this.closeMenuAnim.kill() : undefined
			this.openMenuAnim.isActive() ? this.openMenuAnim.kill() : undefined
			isClosed ? this.closeMenuAnim.play(0) : this.openMenuAnim.play(0)
		},

	}
}
</script>

<style lang="scss">

	.name-title {
		height: 100%;
		width: 100%;
		font-size: 108px;
		position: absolute;
		z-index: -1;
		perspective: 1000px;
	}

	.home-title-st {
		display: inline-block;
		white-space: pre-wrap;
	}

	.name-title__title-container {
		perspective: 1000px;
		transform: translateY(-50%);
		position: relative;
		top: 50%;
	}

	.name-title__title {
    font-family: 'SorrenMedium';
		letter-spacing: .3em;
		text-transform: uppercase;
		color: #ffffff;
		text-align: center;
		position: relative;
		white-space: nowrap;
	}

	.name-title__subtitle {
		font-size: 14px;
		padding-top: 60px;
		line-height: 2em;
		font-family: 'PlayfairDisplay';
		font-style: italic;
		color: #CCE4FF;
		position: relative;
		text-align: center;
		margin: auto;
		max-width: 250px;
	}

	.subtitle-lines {
		display: inline-block;
	}

	.name-title__square {
		position: absolute;
		width: 6em;
		height: 1.6em;
		top: 50%;
		left: 50%;
		transform: translate3d(-50%, -85%, -200px);
		border: 15px solid #001429;
		z-index: -1;
	}

</style>
