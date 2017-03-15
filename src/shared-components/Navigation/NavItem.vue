<template lang="html">

	<div class="menu-link" @mouseover="mouseover" @mouseout="mouseout">
		<router-link class="menu-link__link" :to="to" ref="link" exact>
			<div class="menu-link__title" ref="title">{{ title }}</div>
			<div class="menu-link__hover" ref="hoverLine"></div>
			<div class="menu-link__subtitle">{{ subtitle }}</div>
		</router-link>
	</div>

</template>

<script>

import {TimelineLite, Expo} from 'gsap'
import {EventBus} from '../../event-bus.js'

import menuStore from '../../stores/MenuStore.js'

export default {

	props: ['to', 'title', 'subtitle'],

	data(){
		return {
			state: menuStore.state
		}
	},

	computed: {
		menuIsClosed(){
			return this.state.isClosed
		}
	},

	mounted: function(){
		this.currentRoute = this.isCurrentRoute()

		this.hoverAnim = new TimelineLite({paused: true})
			this.hoverAnim.to(this.$refs.hoverLine, .6, {x: '-50%', scaleX: 1, autoAlpha: 1, ease: Expo.easeOut})

		this.event()
	},

	beforeDestroy(){
		this.unlistenEvent()
	},

	methods: {
		event(){
			this.currentRoute ? this.$el.addEventListener('click', this.clickCurrentLink) : undefined
		},
		unlistenEvent(){
			this.currentRoute ? this.$el.removeEventListener('click', this.clickCurrentLink) : undefined
		},
		isCurrentRoute(){
			return this.$refs.link.$el.classList.contains('router-link-active')
		},
		mouseover: function(){
			this.hoverAnim.play()
		},
		mouseout: function(){
			this.hoverAnim.reverse()
		},
		clickCurrentLink(){
			this.currentRoute ? EventBus.$emit('click-current-link') : undefined
		}
	},

}
</script>

<style lang="scss">

	.menu-link__link {
		text-decoration: none;
	}

	.menu-link {
		visibility: hidden;
		margin-bottom: 60px;
		transform: translateY(200px);
		&:last-child {
			margin-bottom: 0px;
		}
	}

	.menu-link__hover {
		width: 200px;
		z-index: -1;
		height: 50px;
		opacity: 0;
		position: absolute;
		margin-left: 50%;
		background-image: linear-gradient(-135deg, #FFC3CA 0%, #7E9DF6 100%);
		transform: translate3d(-50%, -90px, 0px) scaleX(0);
		transform-origin: left;
	}

	.menu-link__title {
		font-size: 112px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #ffffff;
		display: block;
	}


	.menu-link__subtitle {
		font-family: 'PlayfairDisplay';
		font-style: italic;
		font-size: 14px;
		letter-spacing: 0.2em;
		color: #CCE4FF;
	}

</style>
