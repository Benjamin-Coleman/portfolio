<template lang="html">
	<div class="slider">
		<slide-indicator></slide-indicator>
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
</template>

<script>

	import {EventBus} from '../../event-bus.js'
	import Slide from './Slide.vue'
	import SlideIndicator from './SlideIndicator.vue'
	import sliderStore from '../../stores/SliderStore.js'

	const slides = require('./slides.json').slides

	export default {

		mounted(){
			this.events()
			this.initSlider()
		},

		beforeDestroy(){
			this.unlistenEvents()
		},

		data(){
			return {
				slides: slides,
				state: sliderStore.state
			}
		},

		computed: {
			currentSlideId(){
				return this.state.currentSlideId
			}
		},

		methods: {

			events(){
				document.addEventListener('keyup', this.keyUp)
				EventBus.$on('page-leave', sliderStore.reset)
			},

			unlistenEvents(){
				EventBus.$off('page-leave', sliderStore.reset)
				document.removeEventListener('keyup', this.keyUp)
			},

			keyUp(event){
				if (event.keyCode === 38) {
					this.goToSlide(this.currentSlideId - 1)
				}
				else if (event.keyCode === 40) {
					this.goToSlide(this.currentSlideId + 1)
				}
			},

			initSlider(){
				EventBus.$emit('slide-appear', this.currentSlideId)
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
				if ( !this.containSlide(slideId) ) {
					return
				}
				let direction
				this.currentSlideId < slideId ? direction = 'next' : direction= 'prev'
				direction === 'next' ? sliderStore.increment() : sliderStore.decrement()
				EventBus.$emit('slide-'+direction, this.currentSlideId)
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
</style>
