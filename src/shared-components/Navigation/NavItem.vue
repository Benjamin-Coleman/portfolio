<template lang="html">

	<div class="menu-link" @mouseover="mouseover" @mouseout="mouseout">
		<router-link class="menu-link__link" :to="to">
			<div class="menu-link__title" ref="title">{{ title }}</div>
			<div class="menu-link__hover" ref="hoverLine"></div>
			<div class="menu-link__subtitle">{{ subtitle }}</div>
		</router-link>
	</div>

</template>

<script>
import {TimelineLite, Expo} from 'gsap'

export default {

	props: ['to', 'title', 'subtitle'],

	mounted: function(){
		this.hoverAnim = new TimelineLite({paused: true})
			this.hoverAnim.to(this.$refs.hoverLine, .6, {x: '-50%', scaleX: 1, autoAlpha: 1, ease: Expo.easeOut})
	},

	methods: {
		mouseover: function(){
			this.hoverAnim.play()
		},
		mouseout: function(){
			this.hoverAnim.reverse()
		},
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
