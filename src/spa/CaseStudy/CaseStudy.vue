<template lang="html">
	<div class="case-study">
		<div class="case-study__header" :class="{'case-study__header--open': isOpen}" ref="header">
			<close-button></close-button>
		</div>
		<div class="case-study__scroll-zone" ref="scrollZone">
			<div class="case-study__content">
				<div class="case-study__infos">
					<div class="case-study__info">
						<div class="case-study__info__title">Context</div>
						<div class="case-study__info__text">{{ slide.context }}</div>
					</div>
					<div class="case-study__info">
						<div class="case-study__info__title">Role</div>
						<div class="case-study__info__text">{{ slide.role }}</div>
					</div>
					<div class="case-study__info">
						<div class="case-study__info__title">Period</div>
						<div class="case-study__info__text">{{ slide.period }}</div>
					</div>
				</div>
				<div class="case-study__intro">
					<div class="case-study__intro__title">Presentation</div>
					<div class="case-study__intro__text">{{ slide.description }}</div>
				</div>
				<!-- <div class="case-study__photo-background-container">
					<div class="case-study__photo-background" :style="blockColorStyle"></div>
				</div> -->
			</div>
		</div>
	</div>
</template>

<script>
import CloseButton from './CloseButton.vue'
import {TimelineLite} from 'gsap'
import Smooth from 'smooth-scrolling'
import {EventBus} from  '../../event-bus.js'
import _ from 'lodash'

const slides = require('../../shared-components/Slider/slides.json').slides

export default {

	name: 'case-study',

	data(){
		return {
			isOpen: false
		}
	},

	beforeMount(){
		this.searchProject(this.$route.params.id)
		this.blockColorStyle = {
			backgroundColor: this.slide.backgroundColor
		}
	},

	mounted(){
		const smooth = new Smooth({
			native: false,
			section: this.$refs.scrollZone,
			ease: 0.15
		})
		smooth.init()
		this.events()
	},

	methods: {
		events(){
			window.addEventListener('wheel', this.wheel)
			EventBus.$on('page-ready', this.pageReady)
		},
		unlistenEvents(){
			window.removeEventListener('wheel', this.wheel)
			EventBus.$off('page-ready', this.pageReady)
		},
		pageReady(){
			this.isOpen = true
		},
		wheel(){
			if (event.deltaY > 0 && this.isOpen) {
				this.isOpen = false
				EventBus.$emit('toggle-header', this.isOpen)
			}
			else if (event.deltaY < 0 && !this.isOpen) {
				this.isOpen = true
				EventBus.$emit('toggle-header', this.isOpen)
			}
		},
		searchProject(projectToSearch){
			let project = _.find(slides, {'title': projectToSearch, 'case-study': true})
			project === undefined ? this.$router.replace({name: 'work'}) : this.slide = project
		}
	},

	components: {
		CloseButton
	}

}
</script>

<style lang="scss">

	$ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);

	.case-study {
		height: 100%;
	}

	.case-study__header {
		background-color: #011933;
		height: 100px;
		width: 100%;
		top: 0px;
		left: 0px;
		z-index: 1;
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: center;
		transform: translateY(-100px);
		transition: transform 1.6s $ease-out-expo;
	}

	.case-study__header--open {
		transform: translateY(0px);
	}

	.case-study__pane {
		position: relative;
		height: 80%;
		min-height: 700px;
		max-height: 1000px;
		width: 100%;
		background-color: red;
	}

	.case-study__content {
		width: 760px;
		min-height: 100%;
		color: #ffffff;
		margin: auto;
	}

	.case-study__scroll-zone {
		width: 100%;
		z-index: -3;
		overflow: scroll;
		background-color: #011933;
	}

	.case-study__infos {
		font-size: 21px;
		padding: 2.5em 0em;
		width: 95%;
		margin: auto;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: darken(#011933, 4);
		transform: translateY(-50%);
	}

	.case-study__info {
		display: inline-block;
		text-align: center;
		margin-left: 5em;

		&:first-child {
			margin-left: 0px;
		}

	}

	.case-study__info__title {
		font-family: 'SorrenMedium';
		text-transform: uppercase;
		letter-spacing: .08em;
		margin-bottom: .2em;
	}

	.case-study__info__text {
		font-family: 'PlayfairDisplay';
		font-style: italic;
		text-transform: capitalize;
		font-size: .7em;
		opacity: .5;
	}

	.case-study__intro {
		font-size: 30px;
		margin-top: 1.5em;
		margin-bottom: 6em;
	}

	.case-study__intro__title {
		font-family: 'SorrenMedium';
		letter-spacing: .09em;
		text-transform: uppercase;
		margin-bottom: 1em;

		&:after {
			content: '';
			display: block;
			width: 1em;
			height: 2px;
			background-color: #ffffff;
		}
	}

	.case-study__intro__text {
		font-family: 'PlayfairDisplay';
		font-size: .8em;
		line-height: 1.5em;
		color: #CCE4FF;
	}

	.case-study__photo-background-container {
		height: 400px;
	}

	.case-study__photo-background {
		position: absolute;
		left: 0;
		width: 100%;
		height: 400px;
	}

</style>
