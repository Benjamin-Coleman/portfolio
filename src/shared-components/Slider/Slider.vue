<template lang="html">
	<div class="slider">
		<slide-indicator></slide-indicator>
		<div class="slide-container" ref="slideContainer">
			<slide
				v-for="(slide, index) in slides"
				:title="slide.title"
				:titleColor="slide.titleColor"
				:textColor="slide.textColor"
				:description="slide.description"
				:context="slide.context"
				:role="slide.role"
				:period="slide.period"
				:slideId="index">
			</slide>
		</div>
	</div>
</template>

<script>

	import {EventBus} from '../../event-bus.js'
	import Slide from './Slide.vue'
	import SlideIndicator from './SlideIndicator.vue'
	import sliderStore from '../../stores/SliderStore.js'
	import menuStore from '../../stores/MenuStore.js'

	const slides = require('./slides.json').slides

	export default {

		mounted(){
			this.events()
		},

		beforeDestroy(){
			this.unlistenEvents()
			sliderStore.reset()
		},

		data(){
			return {
				slides: slides,
				state: sliderStore.state,
				menuState: menuStore.state,
				posY: 0
			}
		},

		computed: {
			currentSlideId(){
				return this.state.currentSlideId
			},
			sliderIsAnimated(){
				return this.state.isAnimated
			},
			menuIsClosed(){
				return this.menuState.isClosed
			},
			menuIsAnimated(){
				return this.menuState.isAnimated
			}
		},

		methods: {

			events(){
				document.addEventListener('keyup', this.keyUp)
			},

			unlistenEvents(){
				document.removeEventListener('keyup', this.keyUp)
			},

			wheel(){
				event.preventDefault()
				this.posY = this.posY - 0.05 * event.deltaY
				TweenLite.to(this.$refs.slideContainer, 0.4, {
					ease: Expo.easeOut,
					y: this.posY,
					overwrite: 'all'
				})
			},

			keyUp(event){
				if (!this.sliderIsAnimated && this.menuIsClosed && !this.menuIsAnimated) {
					if (event.keyCode === 38) {
						this.goToSlide(this.currentSlideId - 1)
					}
					else if (event.keyCode === 40) {
						this.goToSlide(this.currentSlideId + 1)
					}
				}
			},

			containSlide(slideId){
				if (slideId >= 0 && slideId <= slides.length - 1) {
					return true
				}
				else {
					return false
				}
			},

			goToSlide(slideId){
				let lastSlideId = this.currentSlideId
				let direction

				if (slideId >= slides.length) {
					direction = 'next'
					sliderStore.reset()
				}
				else if (slideId < 0) {
					direction = 'prev'
					sliderStore.setSlideId(slides.length-1)
				}
				else {
					this.currentSlideId < slideId ? direction = 'next' : direction= 'prev'
					direction === 'next' ? sliderStore.increment() : sliderStore.decrement()
				}
				EventBus.$emit('slide-'+direction, lastSlideId)
				sliderStore.sliderIsAnimated()
			}
		},
		components: {
			Slide,
			SlideIndicator
		}
	}
</script>

<style lang="scss">
	.slider {
		position: absolute;
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
	}

	.slide-container {
		width: 100%;
		height: 100%;
	}

</style>
