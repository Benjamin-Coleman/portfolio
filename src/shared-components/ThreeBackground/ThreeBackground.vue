<template lang="html">
	<div class="three-background">
		<div class="background-renderer" ref="bgRenderer"></div>
		<div class="material-renderer" ref="materialRenderer"></div>
	</div>
</template>

<script>

import {TimelineLite, TweenLite, Expo} from 'gsap'
import {EventBus} from '../../event-bus.js'
const THREE = require('three')

const materials = require('./materials.json').materials
const slides = require('./slides.json')

import sliderStore from '../../stores/SliderStore.js'
import menuStore from '../../stores/MenuStore.js'
import animationStore from '../../stores/AnimationStore.js'

export default {

	data(){
		return {
			cameraY: 0,
			state: sliderStore.state,
			menuState: menuStore.state,
			animationState: animationStore.state
		}
	},

	computed: {
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
		getCurrentSlidePosY(){
			return this.state.posY
		},
		sliderIsActive(){
			return this.state.isActive
		}
	},

	mounted(){
		this.init()
		this.animate()
		this.events()

		this.materials = []
		this.generateMaterials()
		this.initBg(this.$route.name)
		this.appearAnim()

	},

	beforeDestroy(){
		this.unlistenEvents()
	},

	methods: {

		init(){
			this.scene = new THREE.Scene()
			this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
			this.camera.position.z = 10

			this.renderer = new THREE.WebGLRenderer({antialias: false, alpha: true})
			this.renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1)
			this.renderer.setSize(window.innerWidth, window.innerHeight)
			this.$refs.bgRenderer.appendChild(this.renderer.domElement)
			this.render()
		},

		appearAnim(){
			let tl = new TimelineLite()
				tl.fromTo(this.camera.position, 3, {z: 17},{z: 10, ease: Expo.easeOut})
		},

		openMenuAnim(){
			let tl= new TimelineLite()
				tl.add(TweenLite.to(this.camera.position, 1.5,{z: 15, ease: Expo.easeOut, overwrite: 'all'}))
		},

		closeMenuAnim(){
			let tl = new TimelineLite()
				tl.add(TweenLite.to(this.camera.position, 1.5,{z: 10, ease: Expo.easeOut, overwrite: 'all'}))
		},

		render() {
			this.renderer.render(this.scene, this.camera)
		},

		rendererResize(){
			this.renderer.setSize(window.innerWidth, window.innerHeight)
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
		},

		animate() {
			requestAnimationFrame(this.animate.bind(this))
			this.wheel()
			this.render()
		},

		wheel(){
			if (!this.sliderIsAnimated && this.sliderIsActive && this.menuIsClosed) {
				this.camera.position.y = this.getCurrentSlidePosY / 100
			}
		},

		events(){
			window.addEventListener('resize', this.rendererResize.bind(this))
			EventBus.$on('toggle-menu', this.toggleMenu);
			EventBus.$on('slide-next',this.nextAnim)
			EventBus.$on('slide-prev', this.prevAnim)
			EventBus.$on('leave-page', this.goToPage)
			EventBus.$on('go-to-case-study', this.goToCaseStudy)
		},

		unlistenEvents(){
			window.removeEventListener('resize', this.rendererResize.bind(this))
			EventBus.$off('toggle-menu', this.toggleMenu);
			EventBus.$off('slide-next',this.nextAnim)
			EventBus.$off('slide-prev', this.prevAnim)
			EventBus.$off('leave-page', this.goToPage)
		},

		toggleMenu(){
			this.menuIsClosed ? this.closeMenuAnim() : this.openMenuAnim()
		},

		goToPage(targetedPage){
			let leaveAnim = this.getCurrentAnimLeave
			this[leaveAnim](targetedPage)
		},

		goToCaseStudy(){
			TweenLite.to(this.camera.position, 2,{z: 10.5, ease: Expo.easeOut})
		},

		leaveFromCaseStudy(){
			TweenLite.to(this.camera.position, 2,{z: 10, ease: Expo.easeOut})
		},

		nextAnim(){
			let targetedBg = slides[this.$route.name][this.currentSlideId].backgroundColor
			let tl = new TimelineLite()
				tl.to(this.camera.position, .5,{y: -25, ease: Power1.easeIn})
				tl.to(this.$el, .5,{backgroundColor: targetedBg, ease: Power1.easeInOut})
				tl.call(this.generateShapesForSlide, [this.$route.name, this.currentSlideId])
				tl.set(this.camera.position, {y: 20})
				tl.to(this.camera.position, .7,{z: 10, y: 0, ease: Expo.easeOut})
		},

		prevAnim(){
			let targetedBg = slides[this.$route.name][this.currentSlideId].backgroundColor
			let tl = new TimelineLite()
				tl.to(this.camera.position, .5,{y: 25, ease: Power1.easeIn})
				tl.to(this.$el, .5,{backgroundColor: targetedBg, ease: Power1.easeInOut})
				tl.call(this.generateShapesForSlide, [this.$route.name, this.currentSlideId])
				tl.set(this.camera.position, {y: -20})
				tl.to(this.camera.position, .7,{z: 10, y: 0, ease: Expo.easeOut})
		},

		leaveUp(to){
			let targetedBg = slides[to][0].backgroundColor
			TweenLite.to(this.camera.position, .8, {z: 10, ease: Expo.easeOut})
			let tl = new TimelineLite()
				tl.to(this.camera.position, 1,{y: -25, ease: Expo.easeIn})
				tl.to(this.$el, .5,{backgroundColor: targetedBg, ease: Power1.easeInOut})
				tl.call(this.generateShapesForSlide, [to, 0])
				tl.set(this.camera.position, {y: 20})
				tl.to(this.camera.position, 1,{y: 0, ease: Expo.easeOut})
		},

		leaveDown(to){
			let targetedBg = slides[to][0].backgroundColor
			TweenLite.to(this.camera.position, .8, {z: 10, ease: Expo.easeOut})
			let tl = new TimelineLite()
				tl.to(this.camera.position, 1,{y: 25, ease: Expo.easeIn})
				tl.to(this.$el, .5,{backgroundColor: targetedBg, ease: Power1.easeInOut})
				tl.call(this.generateShapesForSlide, [to, 0])
				tl.set(this.camera.position, {y: -20})
				tl.to(this.camera.position, 1,{y: 0, ease: Expo.easeOut})
		},

		leaveForward(to){
			let targetedBg = slides[to][0].backgroundColor
			let tl = new TimelineLite()
				tl.to(this.camera.position, 1,{z: -10, ease: Expo.easeIn})
				tl.to(this.$el, .5,{backgroundColor: targetedBg, ease: Power1.easeInOut})
				tl.call(this.generateShapesForSlide, [to, 0])
				tl.set(this.$refs.bgRenderer.children,{opacity: 0})
				tl.set(this.camera.position, {z: 20})
				tl.to(this.$refs.bgRenderer.children, 2, {opacity: 1, ease: Expo.easeOut})
				tl.to(this.camera.position, 1,{z: 10, ease: Expo.easeOut}, '-=2')
		},

		leaveBackward(to){
			let targetedBg = slides[to][0].backgroundColor
			let tl = new TimelineLite()
				tl.to(this.camera.position, 1.5,{z: 50, ease: Expo.easeIn})
				tl.to(this.$refs.bgRenderer.children, .5, {opacity: 0, ease: Power1.easeInOut}, '-=1')
				tl.to(this.$el, .5,{backgroundColor: targetedBg, ease: Power1.easeInOut}, '-=.5')
				tl.call(this.generateShapesForSlide, [to, 0])
				tl.set(this.camera.position, {z: 0})
				tl.to(this.$refs.bgRenderer.children, 2, {opacity: 1, ease: Expo.easeOut})
				tl.to(this.camera.position, 1,{z: 10, ease: Expo.easeOut}, '-=2')
		},

		goForward(){
			let tl= new TimelineLite({delay: 3.5})
				tl.to(this.camera.position, 1, {z: -10, ease: Expo.easeIn})
				tl.set(this.camera.position,{z: 20})
				tl.set(this.$refs.bgRenderer.children,{opacity: 0})
				tl.to(this.$refs.bgRenderer.children, 2, {opacity: 1, ease: Expo.easeOut})
				tl.to(this.camera.position, 2, {z: 10, ease: Expo.easeOut}, '-=2')
		},

		createGradientTexture(firstColor, secondColor){
			let size = 16;
			let canvas = document.createElement('canvas')
			canvas.width = size
			canvas.height = size

			let context = canvas.getContext( '2d' )

			context.rect( 0, 0, size, size )
			let gradient = context.createLinearGradient( 0, 0, size, size )
			gradient.addColorStop(0, firstColor)
			gradient.addColorStop(1, secondColor)
			context.fillStyle = gradient
			context.fill()

			return canvas;
		},

		generateShapesForSlide(page, slideId){

			let slide  = slides[page][slideId]

			this.clearScene()

			for (let i = 0; i < slide.shapes.length; i++) {
				let shape = slide.shapes[i]
				let geometry = new THREE.CircleGeometry(shape.size, shape.edges);
				let material = this.materials[shape.materialId]

				let mesh = new THREE.Mesh(geometry, material)

				mesh.position.set(shape.x, shape.y, shape.z)
				shape.rotateZ !== undefined ? mesh.rotateZ(shape.rotateZ) : undefined
				this.scene.add(mesh)
			}

		},

		clearScene(){
			this.scene = new THREE.Scene()
		},

		initBg(page){
			if (slides[page] === undefined) {
				return;
			}
			if( slides[slides[page]] !== undefined ){
				return this.initBg(slides[slides[page]])
			}

			let targetedBg = slides[page][0].backgroundColor
			TweenLite.set(this.$el, {backgroundColor: targetedBg})
			this.generateShapesForSlide(page, 0)
		},

		generateMaterials(){
			for (let i = 0; i < materials.length; i++) {

				let colorStart = materials[i].colorStart
				let colorStop = materials[i].colorStop
				let texture = new THREE.Texture(this.createGradientTexture(colorStart, colorStop))
				texture.needsUpdate = true
				let material = new THREE.MeshBasicMaterial({
					map: texture,
					transparent: false,
				})
				this.materials.push(material)

			}
		}

	}
}
</script>

<style lang="scss">

	.three-background {
		z-index: -5;
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}

	.background-renderer {
		canvas {
			position: absolute;
			top: 0;
			left: 0;
			z-index: -10;
		}
	}

</style>
