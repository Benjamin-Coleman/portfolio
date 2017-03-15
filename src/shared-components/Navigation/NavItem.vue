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

		this.appearAnim = new TimelineLite({paused: true, delay: .2})
			this.appearAnim.to(this.$refs.hoverLine, 1, {x: '-50%', scaleX: 1, autoAlpha: 1, ease: Expo.easeOut})

		this.event()
	},

	beforeDestroy(){
		this.unlistenEvents()
	},

	methods: {
		isCurrentRoute(){
			return this.$refs.link.$el.classList.contains('router-link-active')
		},
		event(){
			EventBus.$on('toggle-menu', this.toggleMenu)
		},
		unlistenEvents(){
			EventBus.$off('toggle-menu', this.toggleMenu)
		},
		mouseover: function(){
			!this.currentRoute ? this.hoverAnim.delay(0).play() : undefined
		},
		mouseout: function(){
			!this.currentRoute ? this.hoverAnim.delay(0).reverse() : undefined
		},
		toggleMenu(){
			if(!this.menuIsClosed && this.currentRoute){
				this.appearAnim.timeScale(1).restart(true)
			}
			else if (this.menuIsClosed && this.currentRoute) {
				this.appearAnim.timeScale(2).reverse(0)
			}
		}
	},

}
</script>

<style lang="scss">

	.menu-link__link {
		text-decoration: none;
	}

	.router-link-active {
		cursor: default;
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
