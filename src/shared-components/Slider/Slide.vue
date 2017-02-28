<template lang="html">
	<div class="slide">
		<div class="slide__info" ref="slideInfo">
			<div class="slide__id" :style="titleColorStyle">
				<div class="slide__id__text">0{{ slideId + 1 }}.</div>
			</div>
			<div class="slide__title" :style="titleColorStyle">
				{{ title }}
			</div>
			<div class="slide__description" :style="textColorStyle">
				{{ description }}
			</div>
			<div class="slide__sub-info">

				<div class="slide__sub-info__info">
					<div class="slide__sub-info__info__title" :style="titleColorStyle">
						Role
					</div>
					<div class="slide__sub-info__info__description" :style="textColorStyle">
						{{ role }}
					</div>
				</div>

				<div class="slide__sub-info__info">
					<div class="slide__sub-info__info__title" :style="titleColorStyle">
						Context
					</div>
					<div class="slide__sub-info__info__description" :style="textColorStyle">
						{{ context }}
					</div>
				</div>

				<div class="slide__sub-info__info">
					<div class="slide__sub-info__info__title" :style="titleColorStyle">
						Period
					</div>
					<div class="slide__sub-info__info__description" :style="textColorStyle">
						{{ period }}
					</div>
				</div>

			</div>
			<a class="slide__button" @mouseover="buttonHover" @mouseout="buttonOut" href="#" ref="button" :style="buttonStyle">view more</a>
		</div>


	</div>
</template>

<script>

import HexToRgba from '../../commons/script/HexToRgba.js'
import SplitText from '../../commons/script/SplitText.js'
import {TimelineLite, Expo} from 'gsap'
import {EventBus} from '../../event-bus.js'


export default {
	props: ['title', 'description', 'context', 'role', 'period', 'slideId', 'titleColor', 'textColor'],
	data(){
		return {
			textColorStyle: {
				color: this.textColor
			},
			titleColorStyle: {
				color: this.titleColor
			},
			buttonStyle: {
				color: this.titleColor,
				borderColor: new HexToRgba().convert(this.textColor, 0.3)
			}
		}
	},
	mounted(){

		let splitButtonText = new SplitText(this.$refs.button, {
			classToGive: 'slide__button__splitted-text'
		})

		this.events()

		this.appearSlideAnim = new TimelineLite({paused: true})
			this.appearSlideAnim.set(this.$el, {autoAlpha: 1})
			this.appearSlideAnim.set(this.$refs.slideInfo.children, {y:200 , autoAlpha: 0})
			this.appearSlideAnim.staggerTo(this.$refs.slideInfo.children, 2, {y: 0, autoAlpha: 1, ease: Expo.easeOut}, .05)

		this.appearDownAnim = new TimelineLite({paused: true, delay: 1.4})
			this.appearDownAnim.set(this.$el, {autoAlpha: 1})
			this.appearDownAnim.set(this.$refs.slideInfo.children, {y: 100, autoAlpha: 0})
			this.appearDownAnim.staggerTo(this.$refs.slideInfo.children, .9, {y: 0, autoAlpha: 1,ease: Expo.easeOut}, .08)

		this.appearUpAnim = new TimelineLite({paused: true, delay: 1.4})
			this.appearUpAnim.set(this.$el, {autoAlpha: 1})
			this.appearUpAnim.set(this.$refs.slideInfo.children, {y: -100, autoAlpha:0})
			this.appearUpAnim.staggerTo(this.$refs.slideInfo.children, .9, {y: 0, autoAlpha: 1,ease: Expo.easeOut}, -.05)

		this.goUpAnim = new TimelineLite({paused: true})
			this.goUpAnim.staggerTo(this.$refs.slideInfo.children, .5, {y: -100, autoAlpha: 0,ease: Expo.easeIn}, .05)
			this.goUpAnim.set(this.$el, {autoAlpha: 0})

		this.goDownAnim = new TimelineLite({paused: true})
			this.goDownAnim.staggerTo(this.$refs.slideInfo.children, .5, {y: 100, autoAlpha: 0,ease: Expo.easeIn}, -.05)
			this.goDownAnim.set(this.$el, {autoAlpha: 0})

		this.buttonHoverAnim = new TimelineLite({paused: true})
			this.buttonHoverAnim.to(this.$refs.button.children, .2,{y: -20, rotationX: 45,autoAlpha: 0, ease: Expo.easeIn})
			this.buttonHoverAnim.set(this.$refs.button.children,{y: 20, rotationX: -45})
			this.buttonHoverAnim.to(this.$refs.button.children, .2,{y: 0, rotationX: 0,autoAlpha: 1, ease: Expo.easeOut})
			this.buttonHoverAnim.to(this.$refs.button, .5, {borderColor: new HexToRgba().convert(this.textColor, 1), ease: Expo.easeInOut}, 0)

	},
	methods: {
		events(){
			EventBus.$on('slide-prev', currentSlideId=>{
				this.slidePrev(currentSlideId)
			})
			EventBus.$on('slide-next', currentSlideId=>{
				this.slideNext(currentSlideId)
			})
			EventBus.$on('slide-appear', currentSlideId=>{
				currentSlideId === this.slideId ? this.appearSlideAnim.play(0) : undefined
			})
		},
		buttonHover(){
			this.buttonHoverAnim.play()
		},
		buttonOut(){
			this.buttonHoverAnim.reverse()
		},
		slidePrev(currentSlideId){
			currentSlideId === this.slideId ? this.goDownAnim.restart(true) : undefined
			currentSlideId - 1 === this.slideId ? this.appearUpAnim.restart(true) : undefined
		},
		slideNext(currentSlideId){
			currentSlideId === this.slideId ? this.goUpAnim.restart(true) : undefined
			currentSlideId + 1 === this.slideId ? this.appearDownAnim.restart(true) : undefined
		}
	}
}
</script>

<style lang="scss">

	.slide {
		opacity: 0;
		visibility: hidden;
	}

	.slide__info {
		position: absolute;
		max-width: 500px;
		top: 50%;
		left: 60%;
		transform: translateY(-50%);
		perspective: 1000px;
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
		padding: 15px 36px;
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
	}

	.slide__button__splitted-text {
		display: inline-block;
		white-space: pre;
	}

</style>
