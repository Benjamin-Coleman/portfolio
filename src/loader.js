require('./commons/style/loader.scss')

class Loader {
	constructor() {
		this.linesScale = 0
		this.targetState = 100/3/100
		this.$el = document.querySelector('.loader-container')
		this.$loaderThinLine = document.querySelector('.loader__thin-line')
		this.$loaderBigLine = document.querySelector('.loader__big-line')
		this.$loaderState = document.querySelector('.loader__state')
		this.startProgress()
		this.events()
	}

	startProgress(){
		this.linesScale += (this.targetState - this.linesScale) * 0.009

		this.$loaderBigLine.style.webkitTransform = "scaleX("+this.linesScale+")";
		this.$loaderBigLine.style.MozTransform = "scaleX("+this.linesScale+")";
		this.$loaderBigLine.style.msTransform = "scaleX("+this.linesScale+")";
		this.$loaderBigLine.style.OTransform = "scaleX("+this.linesScale+")";
		this.$loaderBigLine.style.transform = "scaleX("+this.linesScale+")";

		this.parseLoadingState()
		this.linesScale >= 	1 ? undefined : requestAnimationFrame(this.startProgress.bind(this))
	}

	events(){
		document.addEventListener('readystatechange', this.readyStateChange.bind(this, event))
	}

	readyStateChange(){
		this.targetState += 100/2/100
		document.readyState === 'complete' ? this.pageReady() : undefined
	}

	getLoadingState(){
		return Math.floor(this.linesScale * 100)
	}

	parseLoadingState(){
		this.$loaderState.innerText = this.getLoadingState() + '%'
	}

	pageReady(){
		document.removeEventListener('readystatechange', this.pageReady.bind(this))
		this.linesScale = 1
		this.$loaderThinLine.classList.add('loader__line--active')
		this.$loaderBigLine.classList.add('loader__line--active')
		this.$el.classList.add('loader--loaded')
	}
}

export default new Loader()
