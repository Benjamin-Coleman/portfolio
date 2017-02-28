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
	const slides = require('./slides.json')

	export default {

		props: ['slideId'],

		mounted(){
			this.events()
			this.initSlider()
		},

		data(){
			return {
				slides: slides.slides,
				currentSlideId: 0,
			}
		},

		methods: {

			events(){
				window.addEventListener('keyup', event=>{
					this.keyUp(event)
				})
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
				if (this.slideId !== undefined && this.containSlide(this.slideId)) {
					this.currentSlideId = parseInt(this.slideId)
				}
				else {
					this.$router.push({name: 'work'})
				}
				EventBus.$emit('slide-appear', this.currentSlideId)
			},

			containSlide(slideId){
				if (slideId >= 0 && slideId <= slides.slides.length - 1) {
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
				EventBus.$emit('slide-'+direction, this.currentSlideId)
				this.currentSlideId = slideId
			}

		},
		components: {
			Slide,
			SlideIndicator
		}
	}
</script>

<style lang="scss">
</style>
