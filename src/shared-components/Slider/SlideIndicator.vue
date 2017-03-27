<template lang="html">

		<div class="slide-indicator">
			<div class="slide-indicator__current-slide" ref="currentSlide">{{ currentSlideId + 1 }}</div>
			<div class="slide-indicator__separator" ref="separator"></div>
			<div class="slide-indicator__slider-length" ref="sliderLength">{{ sliderLength }}</div>
			<div class="slide-indicator__slider-name" ref="sliderName">{{ sliderName }}</div>
		</div>

</template>

<script>

import SplitText from '../../commons/script/SplitText.js'
import {TimelineLite, Expo} from 'gsap'
import {EventBus} from '../../event-bus.js'
import sliderStore from '../../stores/SliderStore.js'
const slides = require('./slides.json').slides

export default {

	data(){
		return {
			state: sliderStore.state,
			currentSlideId: sliderStore.state.currentSlideId,
			sliderLength: slides.length,
			sliderName: 'Projets'
		}
	},

	computed: {
		titleColor(){
			return slides[this.state.currentSlideId].titleColor
		},
		textColor(){
			return slides[this.state.currentSlideId].textColor
		}
	},

	mounted(){

		let splittedSliderName = new SplitText(this.$refs.sliderName, {
			classToGive: 'slide-indicator__slider-name__splitted'
		})

		this.appearAnim = new TimelineLite({delay: .3})
			this.appearAnim.set(this.$refs.currentSlide, {color: this.titleColor})
			this.appearAnim.set(this.$refs.sliderLength, {color: this.titleColor})
			this.appearAnim.set(this.$refs.separator, {backgroundColor: this.titleColor})
			this.appearAnim.set(this.$refs.sliderName, {color: this.textColor})
			this.appearAnim.from(this.$refs.currentSlide, 1.5, {y: -30,autoAlpha: 0, ease: Expo.easeOut})
			this.appearAnim.from(this.$refs.sliderLength, 1.5, {y: 30,autoAlpha: 0, ease: Expo.easeOut}, 0)
			this.appearAnim.from(this.$refs.separator, 1.5, {scaleY: 0,autoAlpha: 0, ease: Expo.easeOut}, '-=1.5')
			this.appearAnim.staggerFrom(this.$refs.sliderName.children, 2, {y: 10, autoAlpha: 0, ease: Expo.easeOut}, .06, 0)

		this.events()

	},

	beforeDestroy(){
		this.unlistenEvents()
	},

	methods: {

		events(){
			EventBus.$on('slide-next',this.nextAnim)
			EventBus.$on('slide-prev', this.prevAnim)
			EventBus.$on('leave-page', this.leaveAnim)
			EventBus.$on('go-to-case-study', this.leaveAnim)
		},

		unlistenEvents(){
			EventBus.$off('slide-next',this.nextAnim)
			EventBus.$off('slide-prev', this.prevAnim)
			EventBus.$off('leave-page', this.leaveAnim)
			EventBus.$off('go-to-case-study', this.leaveAnim)
		},

		leaveAnim(){
			let tl = new TimelineLite()
				tl.to(this.$refs.currentSlide, .6, {y: -30,autoAlpha: 0, ease: Expo.easeIn})
				tl.to(this.$refs.sliderLength, .6, {y: 30,autoAlpha: 0, ease: Expo.easeIn}, 0)
				tl.to(this.$refs.separator, .6, {scaleY: 0,autoAlpha: 0, ease: Expo.easeIn}, '-=1')
				tl.staggerTo(this.$refs.sliderName.children, .6, {y: 10, autoAlpha: 0, ease: Expo.easeIn}, .04, 0)
		},

		prevAnim(){
			let tl = new TimelineLite()
				tl.to(this.$refs.currentSlide, 1, {y: 30, autoAlpha: 0, ease: Expo.easeIn})
				tl.set(this.$refs.currentSlide, {y: -30})
				tl.call(this.setNewSlideId)
				tl.to(this.$refs.currentSlide, 2, {y: 0, color: this.titleColor, autoAlpha: 1, ease: Expo.easeOut})
				tl.to(this.$refs.sliderLength, 2, {color: this.titleColor, ease: Expo.easeOut}, '-=2')
				tl.to(this.$refs.separator, 2, {backgroundColor: this.titleColor, ease: Expo.easeOut}, '-=2')
				tl.to(this.$refs.sliderName, 2, {color: this.textColor, ease: Expo.easeOut}, '-=2')
		},

		nextAnim(){
			let tl = new TimelineLite()
				tl.to(this.$refs.currentSlide, 1, {y: -30, autoAlpha: 0, ease: Expo.easeIn})
				tl.set(this.$refs.currentSlide, {y: 30})
				tl.call(this.setNewSlideId)
				tl.to(this.$refs.currentSlide, 2, {y: 0, color: this.titleColor, autoAlpha: 1, ease: Expo.easeOut})
				tl.to(this.$refs.sliderLength, 2, {color: this.titleColor, ease: Expo.easeOut}, '-=2')
				tl.to(this.$refs.separator, 2, {backgroundColor: this.titleColor, ease: Expo.easeOut}, '-=2')
				tl.to(this.$refs.sliderName, 2, {color: this.textColor, ease: Expo.easeOut}, '-=2')
		},

		setNewSlideId(){
			this.currentSlideId = sliderStore.state.currentSlideId
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
		font-size: 22px;
		text-align: center;
	}

	.slide-indicator__separator {
		display: inline-block;
		width: 1px;
		height: 2.4em;
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
		width: .2em;
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
