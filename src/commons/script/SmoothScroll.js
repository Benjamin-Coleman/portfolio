import VirtualScroll from 'virtual-scroll'

export default class SmoothScroll {

	constructor(options, vsOptions = {}){
		this.el = vsOptions.el
		this.ease = options.ease || .1
		this.targetY = 0
		this.currentY = 0
		this.height = this.el.getBoundingClientRect().height

		this.destroyed = false

		this.vs = new VirtualScroll(vsOptions)
		this.vs.on(this.onScroll.bind(this))

		this.animate()
	}

	onScroll(e){
		this.targetY += e.deltaY
		this.targetY = Math.max( (this.height - window.innerHeight) * -1, this.targetY)
		this.targetY = Math.min(0, this.targetY)
	}

	animate(){
		if (this.destroyed) {
			return undefined
		}
		else if (this.callbackWhenReachOffset && (this.currentY >= this.targetY - 1 && this.currentY <= this.targetY + 1) ) {
			return this.reachOffset()
		}
		else {
			requestAnimationFrame(this.animate.bind(this));
		}

		this.currentY += this.getRoundedValue( (this.targetY - this.currentY) * this.ease )
		let t = 'translate3d(0, ' + this.currentY + 'px, 0)'
		let s = this.el.style
		s["transform"] = t
		s["webkitTransform"] = t
		s["mozTransform"] = t
		s["msTransform"] = t
	}

	scrollTo(offset, callback){
		this.targetY = offset

		if (callback) {
			if (this.destroyed) { return callback() }
			this.scroolToCallback = callback
			this.callbackWhenReachOffset = true
		}
	}

	getRoundedValue(valueToRound){
		let roundedValue = valueToRound * 1000
		roundedValue = Math.round(roundedValue)
		roundedValue = roundedValue / 1000

		return roundedValue
	}

	reachOffset(){
		this.scroolToCallback()
		this.scroolToCallback = null
		this.callbackWhenReachOffset = false
	}

	reset(){
		this.targetY = 0
		this.currentY = 0
	}

	off(){
		this.vs.off()
	}

	destroy(){
		this.destroyed = true
		this.reset()
		this.vs.destroy()
	}

}
