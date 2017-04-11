import SmoothScroll from './SmoothScroll.js'
import InViewport from 'in-viewport'

export default class Parallax extends SmoothScroll {

	constructor(options, vsOptions = {}) {
		super(options, vsOptions)
		this.parallaxElements = options.parallaxElements || []
	}

	onScroll(e){
		super.onScroll(e)
		this.testParallaxElements()
	}

	setParallaxElements(parallaxElements){
		this.parallaxElements = parallaxElements
	}

	testParallaxElements(){

		for (var i = 0; i < this.parallaxElements.length; i++) {
			InViewport(this.parallaxElements[i].element) ?  this.parallaxElements[i].inViewport = true : this.parallaxElements[i].inViewport = false
		}

	}

	moveElement(elementToMove){
		let distanceToMove = this.currentY * elementToMove.ratio
		this.applyTransform(elementToMove.el, distanceToMove)
	}

	moveElements(){
		for (var i = 0; i < this.parallaxElements.length; i++) {
			if(this.parallaxElements[i].inViewport){
				this.moveElement(this.parallaxElements[i])
			}
		}
	}

	animate(){
		super.animate()
		this.parallaxElements && this.moveElements()
	}

}
