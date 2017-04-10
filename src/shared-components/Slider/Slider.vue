<template lang="html">
	<div class="slider">
		<slide-indicator></slide-indicator>
		<div class="slide-container" ref="slideContainer" :style="transformStyle">
			<slide
				v-for="(slide, index) in slides"
				:title="slide.title"
				:titleColor="slide.titleColor"
				:textColor="slide.textColor"
				:description="slide.description"
				:context="slide.context"
				:role="slide.role"
				:period="slide.period"
				:imgPath="slide.imgPath"
				:imgPath2x="slide.imgPath2x"
				:caseStudy="slide['case-study']"
				:url="slide.url"
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
	import _ from 'lodash'

	import SliderStore from '../../stores/SliderStore.js'
	import VirtualScroll from 'virtual-scroll'
	import MenuStore from '../../stores/MenuStore.js'
	import LoaderStore from '../../stores/LoaderStore.js'

	const slides = require('./slides.json').slides

	export default {

		mounted(){
			this.vs = new VirtualScroll()
			this.events()
			this.loaderReady()
			this.debouncedBackToSlide = _.debounce(this.backToSlide, 300)
		},

		beforeDestroy(){
			this.unlistenEvents()
			SliderStore.reset()
			SliderStore.setInactive()
		},

		data(){
			return {
				slides: slides,
				state: SliderStore.state,
				menuState: MenuStore.state,
				loaderState: LoaderStore.state,
				targetPosY: 0,
				slideTransform: 0,
				oldSlideTransform: 0,
				oldDeltaY: 0,
				leave: false,
				directionQueue: '',
				transformStyle: {
					transform: 'translate3d(0, '+this.slideTransform+'px, 0)'
				}
			}
		},

		computed: {
			pageReady(){
				return this.loaderState.pageReady
			},
			currentSlideId(){
				return this.state.currentSlideId
			},
			sliderIsAnimated(){
				return this.state.isAnimated
			},
			sliderIsActive(){
				return this.state.isActive
			},
			menuIsClosed(){
				return this.menuState.isClosed
			},
			menuIsAnimated(){
				return this.menuState.isAnimated
			},
			getSliderPosY(){
				return this.state.posY
			}
		},

		methods: {

			events(){
				document.addEventListener('keyup', this.keyUp)
				this.vs.on(this.wheel)
				EventBus.$on('appear-slide', this.wheelLoop)
				EventBus.$on('leave-page', this.leavePage)
				EventBus.$on('go-to-case-study', this.goToCaseStudy)
				EventBus.$on('case-study-closed', this.closeCaseStudy)
				EventBus.$on('page-ready', this.loaderReady)
			},

			unlistenEvents(){
				document.removeEventListener('keyup', this.keyUp)
				this.vs.destroy()
				EventBus.$off('appear-slide', this.wheelLoop)
				EventBus.$off('leave-page', this.leavePage)
				EventBus.$off('go-to-case-study', this.goToCaseStudy)
				EventBus.$off('case-study-closed', this.closeCaseStudy)
				EventBus.$off('page-ready', this.loaderReady)
			},

			leavePage(){
				this.leave = true
			},

			loaderReady(){
				this.$route.name === 'case-study' && this.pageReady ? this.goToCaseStudy(): undefined
			},

			goToCaseStudy(){
				this.caseStudyOpen = true
				this.vs.off(this.wheel)
				document.removeEventListener('keyup', this.keyUp)
				this.wheelCaseStudy()
				this.leave = true
			},

			closeCaseStudy(){
				_.delay( ()=>{
					this.caseStudyOpen = false
					this.vs.on(this.wheel)
					document.addEventListener('keyup', this.keyUp)
					SliderStore.setActive()
					this.leave = false
					this.wheelLoop()
				},100)
			},

			wheel(){
				let targetModifier = event.deltaY

				if (!this.menuIsClosed) {
					return undefined
				}

				if (event.deltaY !== this.oldDeltaY && !this.sliderIsAnimated) {
					this.targetPosY -= targetModifier
					this.oldDeltaY = event.deltaY
				}

				this.debouncedBackToSlide()
			},

			backToSlide(){
				this.targetPosY = 0
			},

			wheelCaseStudy(){
				let newSlideTransform = this.getSliderPosY
				this.slideTransform = newSlideTransform
				this.transformStyle.transform = 'translate3d(0, '+this.slideTransform+'px, 0)'
				this.caseStudyOpen ? requestAnimationFrame(this.wheelCaseStudy) : undefined
			},

			wheelLoop(){
				let slideLimit = 130
				let newSlideTransform = this.slideTransform + (this.targetPosY - this.slideTransform) * .09
						newSlideTransform = this.getRoundedValue(newSlideTransform)

				if (newSlideTransform !== this.oldSlideTransform) {
					this.oldSlideTransform = this.slideTransform
					this.slideTransform = newSlideTransform
					this.transformStyle.transform = 'translate3d(0, '+this.slideTransform+'px, 0)'
					SliderStore.setPosY(this.slideTransform)
				}

				if (this.slideTransform <= -slideLimit || this.directionQueue === 'next') {
					this.nextSlide()
					_.delay(this.resetWheel.bind(this), 1000)
				}
				else if (this.slideTransform >= slideLimit || this.directionQueue === 'prev'){
					this.prevSlide()
					_.delay(this.resetWheel.bind(this), 1000)
				}
				else if (!this.leave) {
					requestAnimationFrame(this.wheelLoop)
				}
			},

			getRoundedValue(valueToRound){
				let roundedValue = valueToRound * 1000
					roundedValue = Math.round(roundedValue)
					roundedValue = roundedValue / 1000

					return roundedValue
			},

			resetWheel(){
				this.targetPosY = 0
				this.slideTransform = 0
				this.oldDeltaY = 0
				this.directionQueue = ''
				this.transformStyle.transform = 'translate3d(0, 0, 0)'
			},

			keyUp(event){
				event.preventDefault()
				if (!this.sliderIsAnimated && this.menuIsClosed && !this.menuIsAnimated) {
					if (event.keyCode === 38) {
						this.directionQueue = 'prev'
					}
					else if (event.keyCode === 40) {
						this.directionQueue = 'next'
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
					SliderStore.reset()
				}
				else if (slideId < 0) {
					direction = 'prev'
					SliderStore.setSlideId(slides.length-1)
				}
				else {
					this.currentSlideId < slideId ? direction = 'next' : direction= 'prev'
					direction === 'next' ? SliderStore.increment() : SliderStore.decrement()
				}
				EventBus.$emit('slide-'+direction, lastSlideId)
				SliderStore.sliderIsAnimated()
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
		z-index: 0;
	}

	.slide-container {
		width: 100%;
		height: 100%;
		position: absolute;
	}

</style>
