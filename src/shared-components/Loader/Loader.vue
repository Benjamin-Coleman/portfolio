<template lang="html">
	<div class="loader-container" :class="{'loader--loaded': pageReady}">
		<div class="loader">
			<div class="loader__text">
				<img src="/src/assets/imgs/loading.svg" alt="">
			</div>
			<div class="loader__lines">
				<div class="loader__thin-line"></div>
				<div class="loader__big-line" ref="loaderBigLine"></div>
			</div>
			<div class="loader__state">
				{{ loadingState }}%
			</div>
		</div>
	</div>
</template>

<script>

import AssetsLoader from 'assets-loader'
const assets = require('./assets.json').assets

export default {

	data(){
		return {
			linesScale: 0,
			targetState: 100/3/100,
			pageReady: false
		}
	},

	mounted(){
		let loader = AssetsLoader()

		if (window.devicePixelRatio >= 2) {
			loader.add(assets[1]['paths'])
		}
		else {
			loader.add(assets[0]['paths'])
		}

		loader.on('progress', progress=>{
			this.setProgression(progress)
		})
		loader.on('complete', assets=>{
			this.setPageReady()
		})
		loader.start()

		this.progress()
	},

	methods: {
		setPageReady(){
			this.linesScale = 1
			this.pageReady = true
		},
		setProgression(progress){
			this.targetState = progress
		},
		progress(){
			this.linesScale += (this.targetState - this.linesScale) * 0.009

			this.$refs.loaderBigLine.style.webkitTransform = "scaleX("+this.linesScale+")";
			this.$refs.loaderBigLine.style.MozTransform = "scaleX("+this.linesScale+")";
			this.$refs.loaderBigLine.style.msTransform = "scaleX("+this.linesScale+")";
			this.$refs.loaderBigLine.style.OTransform = "scaleX("+this.linesScale+")";
			this.$refs.loaderBigLine.style.transform = "scaleX("+this.linesScale+")";
			this.linesScale >= 	1 ? undefined : requestAnimationFrame(this.progress.bind(this))
		}
	},

	computed: {
		loadingState(){
			return Math.floor(this.linesScale * 100)
		}
	}

}
</script>

<style lang="scss">

	.loader-container {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: rgb(1, 24, 50);
		background-size: contain;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		user-select: none;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.loader__text {
		transform: translate(-20px, 15px);
	}

	.loader__lines {
		width: 250px;
		height: 50px;
		position: relative;
		z-index: -1;
		transform-origin: left;
		display: inline-block;
		vertical-align: middle;
	}

	.loader__thin-line {
		width: 100%;
		height: 1px;
		background-color: #ffffff;
		transform-origin: left;
		position: absolute;
		display: block;
		top: 50%;
	}

	.loader__big-line {
		width: 100%;
		height: 100%;
		margin-left: 20px;
		position: relative;
		z-index: -1;
		transform-origin: left;
		background-image: linear-gradient(-135deg, #FFC3CA 0%, #7E9DF6 100%);
	}

	.loader--loaded {
		animation-name: pageReady;
		animation-duration: .8s;
		animation-timing-function: ease;
		animation-fill-mode: forwards;

		.loader__big-line {
			transition: all .7s cubic-bezier(0.19, 1, 0.22, 1);
			transform: scale(1);
		}

	}

	.loader__state {
		color: #ffffff;
		font-family: 'PlayfairDisplay';
		font-style: italic;
		font-size: 25px;
		min-width: 3em;
		margin-left: .6em;
		display: inline-block;
		vertical-align: middle;
	}

	@keyframes pageReady {
	    0%   {opacity: 1;}
			99%  {opacity: 0;}
	    100% {opacity: 0; visibility: hidden;}
	}

</style>
