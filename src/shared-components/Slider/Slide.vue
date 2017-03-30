<template lang="html">
	<div class="slide">
		<div class="slide-img">
			<img :src="imgPath" alt=""
					 :srcset="imgPath2x + ' 2x'"
					 class="slide-img__img" ref="slideImg"
			>
		</div>
		<div class="slide__info" ref="slideInfo">
			<div class="slide__id" :style="titleColorStyle">
				<div class="slide__id__text">0{{ slideId + 1 }}.</div>
			</div>

			<div class="slide__title" :style="titleColorStyle">{{ title }}</div>
			<div class="slide__description" :style="textColorStyle">{{ description }}</div>

			<div class="slide__sub-info">
				<div class="slide__sub-info__info">
					<div class="slide__sub-info__info__title" :style="titleColorStyle">Role</div>
					<div class="slide__sub-info__info__description" :style="textColorStyle">{{ role }}</div>
				</div>

				<div class="slide__sub-info__info">
					<div class="slide__sub-info__info__title" :style="titleColorStyle">Context</div>
					<div class="slide__sub-info__info__description" :style="textColorStyle">{{ context }}</div>
				</div>

				<div class="slide__sub-info__info">
					<div class="slide__sub-info__info__title" :style="titleColorStyle">Period</div>
					<div class="slide__sub-info__info__description" :style="textColorStyle">{{ period }}</div>
				</div>

			</div>

			<a class="slide__button" v-if="caseStudy" @click.prevent="loadCaseStudy" @mouseover="buttonHover" @mouseout="buttonOut" ref="button" :style="buttonStyle">
				<div v-if="isLoading" class="slide__button-text" ref="buttonText">{{ loadingState }}</div>
				<div v-else="isLoading" class="slide__button-text" ref="buttonText">view more</div>
				<div class="slide__button__loader" ref="loadingBar" :style="loadingButtonStyle"></div>
			</a>
			<a class="slide__button" v-else="caseStudy" :href="url" target="_blank" @mouseover="buttonHover" @mouseout="buttonOut" ref="button" :style="buttonStyle">
				<div class="slide__button-text" ref="buttonText">Go to website</div>
				<div class="slide__button__loader" ref="loadingBar" :style="loadingButtonStyle"></div>
			</a>

		</div>
	</div>
</template>

<script>

import HexToRgba from '../../commons/script/HexToRgba.js'
import SplitText from '../../commons/script/SplitText.js'
import {TimelineLite, Expo} from 'gsap'
import {EventBus} from '../../event-bus.js'
import AssetsLoader from 'assets-loader'

import sliderStore from '../../stores/SliderStore.js'
import menuStore from '../../stores/MenuStore.js'
import animationStore from '../../stores/AnimationStore.js'

import LoaderMixin from '../Loader/LoaderMixin.js'

export default {
	props: ['title', 'description', 'context', 'role', 'period', 'slideId', 'titleColor', 'textColor', 'imgPath', 'imgPath2x', 'caseStudy', 'url'],

	mixins: [LoaderMixin],

	data(){
		return {
			state: sliderStore.state,
			menuState: menuStore.state,
			animationState: animationStore.state,
			imgName: this.title,
			isLoading: false,
			progress: 0,
			buttonIsClickable: true,
			textColorStyle: {
				color: this.textColor
			},
			titleColorStyle: {
				color: this.titleColor
			},
			loadingButtonStyle: {
				backgroundColor: new HexToRgba().convert(this.textColor, 0.3)
			},
			buttonStyle: {
				color: this.titleColor,
				borderColor: new HexToRgba().convert(this.textColor, 0.3)
			}
		}
	},

	computed: {
		getSliderPosY(){
			return this.state.posY
		},
		currentSlideId(){
			return this.state.currentSlideId
		},
		menuIsClosed(){
			return this.menuState.isClosed
		},
		sliderIsAnimated(){
			return this.state.isAnimated
		},
		getCurrentAnimAppear(){
			return this.animationState.appear
		},
		getCurrentAnimLeave(){
			return this.animationState.leave
		},
		loadingState(){
			return 'Loading ' + this.progress * 100 + '%'
		}
	},

	mounted(){

		this.goUpAnim = new TimelineLite({paused: true})
			this.goUpAnim.staggerTo(this.$refs.slideInfo.children, .5, {y: -100, autoAlpha: 0,ease: Expo.easeIn}, .05)
			this.goUpAnim.to(this.$refs.slideImg, .8, {y: -window.innerHeight, ease: Expo.easeIn}, 0)
			this.goUpAnim.set(this.$el, {autoAlpha: 0})

		this.goDownAnim = new TimelineLite({paused: true})
			this.goDownAnim.staggerTo(this.$refs.slideInfo.children, .5, {y: 100, autoAlpha: 0,ease: Expo.easeIn}, -.05)
			this.goDownAnim.to(this.$refs.slideImg, .8, {y: window.innerHeight,ease: Expo.easeIn}, 0)
			this.goDownAnim.set(this.$el, {autoAlpha: 0})

		this.openMenuAnim = new TimelineLite({paused: true})
			this.openMenuAnim.call(()=>{
				this.closeMenuAnim.kill()
			})
			this.openMenuAnim.staggerTo(this.$refs.slideInfo.children, 1.4, {y: 0, autoAlpha: 1,ease: Expo.easeOut}, .05)
			this.openMenuAnim.to(this.$refs.slideImg, 2, {z: 0,ease: Expo.easeOut}, 0)

		this.closeMenuAnim = new TimelineLite({paused: true})
			this.closeMenuAnim.call(()=>{
				this.openMenuAnim.kill()
			})
			this.closeMenuAnim.staggerTo(this.$refs.slideInfo.children, .3, {y: 100, autoAlpha: 0,ease: Expo.easeIn}, -.05)
			this.closeMenuAnim.to(this.$refs.slideImg, 2, {z: -800, ease: Expo.easeOut}, 0)

		this.buttonHoverAnim = new TimelineLite({paused: true})
			this.buttonHoverAnim.to(this.$refs.buttonText, .2,{y: -20, rotationX: 45,autoAlpha: 0, ease: Expo.easeIn})
			this.buttonHoverAnim.set(this.$refs.buttonText,{y: 20, rotationX: -45})
			this.buttonHoverAnim.to(this.$refs.buttonText, .2,{y: 0, rotationX: 0,autoAlpha: 1, ease: Expo.easeOut})
			this.buttonHoverAnim.to(this.$refs.button, .5, {borderColor: new HexToRgba().convert(this.textColor, 1), ease: Expo.easeInOut}, 0)

		this.events()
		this.appearPage()
	},

	beforeDestroy(){
		this.unlistenEvents()
	},

	methods: {
		events(){
			EventBus.$on('slide-prev', this.slidePrev)
			EventBus.$on('slide-next', this.slideNext)
			EventBus.$on('toggle-menu', this.toggleMenu)
			EventBus.$on('leave-page', this.leavePage)
			EventBus.$on('close-case-study', this.closeCaseStudy)
		},
		unlistenEvents(){
			EventBus.$off('slide-prev', this.slidePrev)
			EventBus.$off('slide-next', this.slideNext)
			EventBus.$off('toggle-menu', this.toggleMenu)
			EventBus.$off('leave-page', this.leavePage)
			EventBus.$off('close-case-study', this.closeCaseStudy)
		},
		leavePage(){
			let leaveAnim = this.getCurrentAnimLeave
			sliderStore.setInactive()
			TweenLite.to(this.$refs.slideImg, 1, {z: 0,ease: Expo.easeOut})
			this.currentSlideId === this.slideId ? this[leaveAnim]() : undefined
		},
		appearPage(){
			let appearAnim = this.getCurrentAnimAppear
			this.currentSlideId === this.slideId ? this[appearAnim]() : undefined
		},
		closeCaseStudy(){
			let tl = new TimelineLite({paused: true, onComplete: ()=>{
				EventBus.$emit('case-study-closed')
				this.buttonIsClickable = true
			}})
				tl.staggerTo(this.$refs.slideInfo.children, 1, {y: 0, autoAlpha: 1, ease: Expo.easeOut}, .05)
				tl.to(this.$refs.slideImg, 1.5, {z: 0, ease: Expo.easeOut}, 0)

			this.slideId === this.currentSlideId ? tl.play(0) : undefined
		},
		goToCaseStudy(){
			event.preventDefault()
			this.buttonIsClickable = false
			if (this.slideId === this.currentSlideId) {
				EventBus.$emit('go-to-case-study')
				this.$router.replace({name: 'case-study', params: {id: this.title}})
				let tl = new TimelineLite()
					tl.to(this.$refs.slideInfo.children, 2, {y: 100,ease: Expo.easeOut})
					tl.to(this.$refs.slideInfo.children[2], 1, {autoAlpha: 0,ease: Expo.easeOut}, 0)
					tl.to(this.$refs.slideInfo.children[3], 1, {autoAlpha: 0,ease: Expo.easeOut}, 0)
					tl.to(this.$refs.slideInfo.children[4], 1, {autoAlpha: 0,ease: Expo.easeOut}, 0)
					tl.to(this.$refs.slideImg, 2, {z: -100, ease: Expo.easeOut}, 0)
					tl.to(this.$refs.slideImg, 2, {z: -100, ease: Expo.easeOut}, 0)
					tl.set(this.$refs.loadingBar, {scaleX: 0})
			}
			else {
				TweenLite.to(this.$refs.loadingBar, 1, {scaleX: 0, ease: Expo.easeOut})
			}
		},
		loadCaseStudy(){
			console.log(this.sliderIsAnimated)
			if (!this.buttonIsClickable || ( this.getSliderPosY < 1 && this.getSliderPosY > 1 ) || this.sliderIsAnimated) {
				return undefined
			}
			let assetsToLoad
			let caseStudyName = this.title.toLowerCase()
			window.devicePixelRatio <= 1 ? assetsToLoad = this.findAssets('1x', caseStudyName) : assetsToLoad = this.findAssets('2x', caseStudyName)

			this.isLoading = true
			this.buttonOut()

			let loader = AssetsLoader().add(assetsToLoad)
			loader.on('progress', progress=>{
				this.progress = progress
				TweenLite.to(this.$refs.loadingBar, .6, {scaleX: progress, ease: Expo.easeOut})
			})
			loader.on('complete', ()=>{
				this.goToCaseStudy()
				this.isLoading = false
				this.progress = 0
			})
			loader.start()
		},
		appearAnim(){
			let tl = new TimelineLite({paused: true, onComplete: ()=>{
				EventBus.$emit('appear-slide')
				sliderStore.setActive()
			}})
				tl.set(this.$el, {autoAlpha: 1})
				tl.set(this.$refs.slideInfo.children, {y: 100, autoAlpha: 0})
				tl.set(this.$refs.slideImg, {z: -1000})
				tl.to(this.$refs.slideImg, 3, {z: 0,ease: Expo.easeOut})
				tl.staggerTo(this.$refs.slideInfo.children, 2, {y: 0, autoAlpha: 1,ease: Expo.easeOut}, .05, '-=2.5')

			let tlCaseStudy = new TimelineLite({paused: true})
				tlCaseStudy.set(this.$el, {autoAlpha: 1})
				tlCaseStudy.set(this.$refs.slideInfo.children, {y: 200, autoAlpha: 0})
				tlCaseStudy.set(this.$refs.slideImg, {z: -1000})
				tlCaseStudy.to(this.$refs.slideImg, 3, {z: -100, ease: Expo.easeOut})
				tlCaseStudy.to(this.$refs.slideInfo.children[0], 2, {y: 100, autoAlpha: 1,ease: Expo.easeOut}, '-=3')
				tlCaseStudy.to(this.$refs.slideInfo.children[1], 2, {y: 100, autoAlpha: 1,ease: Expo.easeOut}, '-=2.8')

			this.$route.name === 'case-study' ? tlCaseStudy.play(0) : tl.play(0)
		},
		appearDown(delay){
			let tl = new TimelineLite({delay: delay, onComplete: ()=>{
				sliderStore.sliderIsNotAnimated()
				EventBus.$emit('appear-slide')
				sliderStore.setActive()
			}})
				tl.set(this.$refs.slideImg, {y: window.innerHeight*2})
				tl.set(this.$el, {autoAlpha: 1})
				tl.set(this.$refs.slideInfo, {y:0})
				tl.set(this.$refs.slideInfo.children, {y:100, autoAlpha: 0})
				tl.to(this.$refs.slideImg, .55, {y: 0,ease: Expo.easeOut})
				tl.staggerTo(this.$refs.slideInfo.children, .7, {y: 0, autoAlpha: 1,ease: Expo.easeOut}, .05, 0)
		},
		appearUp(delay){
			let tl = new TimelineLite({delay: delay, onComplete: ()=>{
				sliderStore.sliderIsNotAnimated()
				EventBus.$emit('appear-slide')
				sliderStore.setActive()
			}})
				tl.set(this.$refs.slideImg, {y: -window.innerHeight*2})
				tl.set(this.$el, {autoAlpha: 1})
				tl.set(this.$refs.slideInfo, {y:0})
				tl.set(this.$refs.slideInfo.children, {y: -100, autoAlpha:0})
				tl.to(this.$refs.slideImg, .55, {y: 0, ease: Expo.easeOut})
				tl.staggerTo(this.$refs.slideInfo.children, .7, {y: 0, autoAlpha: 1,ease: Expo.easeOut}, -.05, 0)
		},
		prevDown(){
			let tl = new TimelineLite()
				tl.staggerTo(this.$refs.slideInfo.children, .4, {y: 100, autoAlpha: 0,ease: Power1.easeIn}, -.04)
				tl.to(this.$refs.slideImg, .35, {y: window.innerHeight,ease: Power1.easeIn}, 0)
				tl.to(this.$refs.slideInfo, .4, {y: window.innerHeight,ease: Power1.easeIn}, 0)
				tl.set(this.$el, {autoAlpha: 0})
		},
		leaveDown(transitionTime = .8){
			let tl = new TimelineLite()
				tl.staggerTo(this.$refs.slideInfo.children, .5, {y: 100, autoAlpha: 0,ease: Expo.easeIn}, -.05)
				tl.to(this.$refs.slideImg, transitionTime, {y: window.innerHeight,ease: Expo.easeIn}, 0)
				tl.set(this.$el, {autoAlpha: 0})
		},
		leaveUp(transitionTime){
			let tl = new TimelineLite()
				tl.staggerTo(this.$refs.slideInfo.children, .4, {y: -100, autoAlpha: 0,ease: Power1.easeIn}, .04)
				tl.to(this.$refs.slideImg, transitionTime, {y: -window.innerHeight, ease: Power1.easeIn}, 0)
				tl.to(this.$refs.slideInfo, .4, {y: -window.innerHeight, ease: Power1.easeIn}, 0)
				tl.set(this.$el, {autoAlpha: 0})
		},
		leaveForward(){
			let tl = new TimelineLite()
				tl.to(this.$refs.slideImg, 1, {z: 1000, opacity: 0, ease: Expo.easeIn})
				tl.add(TweenMax.staggerTo(this.$refs.slideInfo.children, .5, {y: 100, autoAlpha: 0, ease: Expo.easeIn, overwrite: 'all'}, -.05))
		},
		appearBackward(){
			let tl = new TimelineLite({onComplete: ()=>{
				EventBus.$emit('appear-slide')
				sliderStore.setActive()
			}})
				tl.set(this.$el, {autoAlpha: 1})
				tl.set(this.$refs.slideInfo.children, {y: 100, autoAlpha: 0})
				tl.set(this.$refs.slideImg, {z: 1000, opacity: 0})
				tl.to(this.$refs.slideImg, 1.5, {z: 0, opacity: 1, ease: Expo.easeOut})
				tl.staggerTo(this.$refs.slideInfo.children, .9, {y: 0, autoAlpha: 1,ease: Expo.easeOut}, .08, 0)
		},

		toggleMenu(){
			this.currentSlideId === this.slideId && this.menuIsClosed ? this.openMenuAnim.play(0) : undefined
			this.currentSlideId === this.slideId && !this.menuIsClosed ? this.closeMenuAnim.play(0) : undefined
		},
		buttonHover(){
			!this.isLoading ? this.buttonHoverAnim.play() : undefined
		},
		buttonOut(){
			this.buttonHoverAnim.reverse()
		},
		slidePrev(lastSlideId){
			lastSlideId === this.slideId ? this.prevDown(.35) : undefined
			this.currentSlideId === this.slideId ? this.appearUp(1) : undefined
		},
		slideNext(lastSlideId){
			lastSlideId === this.slideId ? this.leaveUp(.35) : undefined
			this.currentSlideId === this.slideId ? this.appearDown(1) : undefined
		}
	}
}
</script>

<style lang="scss">

	.slide {
		position: absolute;
		opacity: 0;
		visibility: hidden;
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
	}

	.slide__info {
		max-width: 500px;
		font-family: 'SorrenMedium';
	}

	.slide__id__text {
		font-size: 90px;
		letter-spacing: .05em;
		opacity: .2;
		transform: translateY(20px);
	}

	.slide__title {
		text-transform: uppercase;
		font-size: 112px;
		letter-spacing: .05em;
	}

	.slide__description {
		font-family: 'PlayfairDisplay';
		font-size: 13px;
		line-height: 2em;
	}

	.slide__sub-info__info {
		display: inline-block;
		margin-left: 30px;
		margin-top: 30px;

		&:first-child {
			margin-left: 0px;
		}

	}

	.slide-img {
		margin-right: 200px;
		perspective-origin: 150% 50%;
		perspective: 1000px;
	}

	.slide-img__img {
		display: block;
	}

	.slide__sub-info__info__title {
		margin-bottom: 7px;
		font-size: 21px;
		letter-spacing: .09em;
		text-transform: uppercase;
	}

	.slide__sub-info__info__description {
		font-family: 'PlayfairDisplay';
		text-transform: capitalize;
		font-style: italic;
		font-size: 13px;
	}

	.slide__button {
		padding: 17px 36px 15px 36px;
		border-style: solid;
		border-width: 1px;
		border-radius: 3px;

		display: inline-block;
		position: relative;
		margin-top: 40px;

		text-decoration: none;
		font-size: 19px;
		letter-spacing: .09em;
		text-transform: uppercase;
		color: white;
		perspective: 1000px;
		overflow: hidden;
		cursor: pointer;
	}

	.slide__button__splitted-text {
		display: inline-block;
		white-space: pre;
	}

	.slide__button__loader {
		width: 100%;
		height: 100%;
		left: 0px;
		top: 0px;
		position: absolute;
		z-index: -1;

		transform: scaleX(0);
		transform-origin: left;
	}

</style>
