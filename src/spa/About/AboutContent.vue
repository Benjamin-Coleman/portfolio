<template lang="html">

	<div class="about-content" ref="aboutContent">
		<div class="about-content__title" v-html="title"></div>
		<div class="about-content__content" v-html="content"></div>
		<div class="about-content__social">
			<div class="about-content__social-title">{{ socialTitle }}</div>
			<div class="about-content__networks">
				<div class="about-content__network" v-for="network in networks">
					<a class="about-content__network__link" :href="network.link" target="_blank">{{ network.name }}</a>
				</div>
			</div>
		</div>
	</div>

</template>

<script>

import {TimelineLite, TweenLite,Expo} from 'gsap'
import {EventBus} from '../../event-bus.js'
import MenuStore from '../../stores/MenuStore.js'
import LoaderStore from '../../stores/LoaderStore.js'
const aboutText = require('./about.json').about

export default {

	data(){
		return {
			title: aboutText.title,
			content: aboutText.content,
			socialTitle: aboutText.socialTitle,
			networks: aboutText.socialNetworks,
			menuState: MenuStore.state,
			loaderState: LoaderStore.state
		}
	},

	computed: {

		pageReady(){
			return this.loaderState.pageReady
		},

		menuIsClosed(){
			return this.menuState.isClosed
		}

	},

	mounted(){
		this.$bigTitle = this.$el.querySelectorAll('.about-content__big-title')
		this.events()
		this.loaderReady()
	},

	beforeDestroy(){
		this.unlistenEvents()
	},

	methods: {

		events(){
			EventBus.$on('leave-page', this.leave)
			EventBus.$on('toggle-menu', this.toggleMenu)
			EventBus.$on('page-ready', this.loaderReady)
		},

		unlistenEvents(){
			EventBus.$off('leave-page', this.leave)
			EventBus.$off('toggle-menu', this.toggleMenu)
			EventBus.$off('page-ready', this.loaderReady)
		},

		loaderReady(){
			this.pageReady && this.appear()
		},

		appear(){
			let tl = new TimelineLite({delay: .5})
				tl.staggerFromTo(this.$refs.aboutContent.children, 1.5, {y: 40, autoAlpha: 0}, {y: 0, autoAlpha: 1, ease: Expo.easeOut}, .1)
		},

		leave(){
			let tl = new TimelineLite()
				tl.add(TweenMax.staggerTo(this.$refs.aboutContent.children, .3, {y: 40, autoAlpha: 0, ease: Expo.easeIn, overwrite: 'all'}, -.08))
		},

		toggleMenu(){
			this.menuIsClosed ? this.appear() : this.leave()
		}
	}

}
</script>

<style lang="scss">

	$about-blue: #828ED4;
	$about-title-gradient-1: #FFC3CA;
	$about-title-gradient-2: #A8A9E7;

	.about-content {
		max-width: 27em;
		margin: auto;

		font-size: 20px;
		font-family: 'PlayfairDisplay';
		text-align: center;
		color: #ffffff;
	}

	.about-content__title {
		font-style: italic;
		letter-spacing: .12em;
	}

	.about-content__big-title {
		font-size: 80px;
		font-family: 'SorrenMedium';
		text-transform: uppercase;
		font-style: normal;
		letter-spacing: .12em;
		display: inline-block;
		vertical-align: middle;
		margin: 0px 10px;

		background-image: linear-gradient($about-title-gradient-1, $about-title-gradient-2);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.about-content__content {
		font-size: 14px;
		line-height: 1.8em;
		margin: 3.5em 0px;
	}

	.about-content__link {
		font-style: italic;
		text-decoration: none;
		color: $about-blue;
		transition: color .4s ease;

		&:hover {
			color: lighten($about-blue, 12);
		}

	}

	.about-content__social-title {
		font-size: 14px;
		margin-bottom: 1em;
		letter-spacing: .1em;
		font-style: italic;
		color: $about-blue;
	}

	.about-content__network {
		display: inline-block;
		&:after {
			content: '-';
			color: $about-blue;
			margin: 0em .5em;
		}

		&:last-child {
			&:after {
				display: none;
				content: '';
			}
		}
	}

	.about-content__network__link {
		text-decoration: none;
		display: inline-block;
		vertical-align: middle;
		color: $about-blue;
		font-family: 'SorrenMedium';
		text-transform: uppercase;
		letter-spacing: .1em;
		font-size: 32px;
		transition: all .4s ease;

		&:hover {
			color: lighten($about-blue, 12);
		}

	}

	@media screen and (max-width: 760px) {
		.about-content { font-size: 15px; margin: 0 .8em;}
		.about-content__big-title { font-size: 30px;}
	}

</style>
