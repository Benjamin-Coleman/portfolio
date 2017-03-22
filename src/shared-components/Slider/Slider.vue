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
	import {TweenLite, Expo} from 'gsap'
	import Slide from './Slide.vue'
	import SlideIndicator from './SlideIndicator.vue'
	import sliderStore from '../../stores/SliderStore.js'
	import menuStore from '../../stores/MenuStore.js'
	import _ from 'lodash'

	const slides = require('./slides.json').slides

	export default {

		mounted(){
			sliderStore.setActive()
			this.events()
			this.debouncedBackToSlide = _.debounce(this.backToSlide, 300)
		},

		beforeDestroy(){
			this.unlistenEvents()
			sliderStore.reset()
			sliderStore.setInactive()
		},

		data(){
			return {
				slides: slides,
				state: sliderStore.state,
				menuState: menuStore.state,
				targetPosY: 0,
				slideTransform: 0,
				oldDeltaY: 0
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
				document.addEventListener('wheel', this.wheel)
				EventBus.$on('appear-slide', this.wheelLoop)
			},

			unlistenEvents(){
				document.removeEventListener('keyup', this.keyUp)
				document.removeEventListener('wheel', this.wheel)
				EventBus.$off('appear-slide', this.wheelLoop)
			},

			wheel(){
				event.preventDefault()
				let targetModifier = 4

				if (event.deltaY !== this.oldDeltaY && !this.sliderIsAnimated) {
					event.deltaY > 0 ? this.targetPosY -= targetModifier : this.targetPosY += targetModifier
					this.oldDeltaY = event.deltaY
				}

				this.debouncedBackToSlide()

			},

			backToSlide(){
				this.targetPosY = 0
			},

			wheelLoop(){
				let slideLimit = 45

				this.slideTransform += (this.targetPosY - this.slideTransform) * .08
				TweenLite.set(this.$refs.slideContainer, {y: this.slideTransform})
				sliderStore.setPosY(this.slideTransform)

				if (this.slideTransform <= -slideLimit) {
					this.nextSlide()
					_.delay(this.resetWheel.bind(this), 1000)
				}
				else if (this.slideTransform >= slideLimit){
					this.prevSlide()
					_.delay(this.resetWheel.bind(this), 1000)
				}
				else {
					requestAnimationFrame(this.wheelLoop)
				}
			},

			resetWheel(){
				this.targetPosY = 0
				this.slideTransform = 0
				this.oldDeltaY = 0
				TweenLite.set(this.$refs.slideContainer, {y: this.slideTransform})
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

			nextSlide(){
				this.goToSlide(this.currentSlideId + 1)
			},

			prevSlide(){
				this.goToSlide(this.currentSlideId - 1)
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
