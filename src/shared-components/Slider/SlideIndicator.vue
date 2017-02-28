<template lang="html">
	<transition
		v-on:leave="leave"
		>
		<div class="slide-indicator">
			<div class="slide-indicator__current-slide" ref="currentSlide">{{ currentSlide }}</div>
			<div class="slide-indicator__separator" ref="separator"></div>
			<div class="slide-indicator__slider-length" ref="sliderLength">{{ sliderLength }}</div>
			<div class="slide-indicator__slider-name" ref="sliderName">{{ sliderName }}</div>
		</div>
	</transition>
</template>

<script>

import SplitText from '../../commons/script/SplitText.js'
import {TimelineLite, Expo} from 'gsap'
import {EventBus} from '../../event-bus.js'
const slides = require('./slides.json')

export default {

	data(){
		return {
			currentSlide: 1,
			sliderLength: slides.slides.length,
			sliderName: 'Projets'
		}
	},

	mounted(){

		let splittedSliderName = new SplitText(this.$refs.sliderName, {
			classToGive: 'slide-indicator__slider-name__splitted'
		})

		this.appearAnim = new TimelineLite({delay: .3})
			this.appearAnim.from(this.$refs.currentSlide, 2, {y: -30,autoAlpha: 0, ease: Expo.easeOut})
			this.appearAnim.from(this.$refs.sliderLength, 2, {y: 30,autoAlpha: 0, ease: Expo.easeOut}, 0)
			this.appearAnim.from(this.$refs.separator, 2, {scaleY: 0,autoAlpha: 0, ease: Expo.easeOut}, '-=1.5')
			this.appearAnim.staggerFrom(this.$refs.sliderName.children, 2, {y: 10, autoAlpha: 0, ease: Expo.easeOut}, .06, 0)

		this.nextAnim = new TimelineLite({paused: true})
			this.nextAnim.to(this.$refs.currentSlide, 1.2, {y: -30, autoAlpha: 0, ease: Expo.easeIn})
			this.nextAnim.set(this.$refs.currentSlide, {y: 30})
			this.nextAnim.to(this.$refs.currentSlide, 2, {y: 0, autoAlpha: 1, ease: Expo.easeOut})
	},

	methods: {

		leave(el, done){
			this.appearAnim.eventCallback('onReverseComplete', done)
			this.appearAnim.reverse(0, true)
		}

	}

}
</script>

<style lang="scss">

	.slide-indicator {
		position: absolute;
		left: 40px;
		top: 50%;
		transform: translateY(-50%);
		font-family: 'SorrenMedium';
		text-transform: uppercase;
		font-size: 21px;
		text-align: center;
	}

	.slide-indicator__separator {
		display: inline-block;
		width: 1px;
		height: 2.4em;
		background-color: #000;
		margin: 0px .3em;
		transform-origin: center;
	}

	.slide-indicator__slider-length {
		display: inline-block;
		font-size: 1.5em;
	}

	.slide-indicator__current-slide {
		display: inline-block;
		vertical-align: bottom;
		font-size: 3em;
	}

	.slide-indicator__slider-name {
		margin-top: .4em;
		letter-spacing: .07em;
	}

	.slide-indicator__slider-name__splitted {
		display: inline-block;
		white-space: pre;
	}

</style>
