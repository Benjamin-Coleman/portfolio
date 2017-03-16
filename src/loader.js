require('./commons/style/loader.scss')

class Loader {
	constructor() {
		this.linesScale = .1
		this.$el = document.querySelector('.loader-container')
		this.$loaderThinLine = document.querySelector('.loader__thin-line')
		this.$loaderBigLine = document.querySelector('.loader__big-line')
		this.startProgress()
		this.events()
	}

	startProgress(){
		this.linesScale += (1 - this.linesScale) * 0.003

		this.$loaderThinLine.style.webkitTransform = "scaleX("+this.linesScale+")";
		this.$loaderThinLine.style.MozTransform = "scaleX("+this.linesScale+")";
		this.$loaderThinLine.style.msTransform = "scaleX("+this.linesScale+")";
		this.$loaderThinLine.style.OTransform = "scaleX("+this.linesScale+")";
		this.$loaderThinLine.style.transform = "scaleX("+this.linesScale+")";

		this.$loaderBigLine.style.webkitTransform = "scaleX("+this.linesScale+")";
		this.$loaderBigLine.style.MozTransform = "scaleX("+this.linesScale+")";
		this.$loaderBigLine.style.msTransform = "scaleX("+this.linesScale+")";
		this.$loaderBigLine.style.OTransform = "scaleX("+this.linesScale+")";
		this.$loaderBigLine.style.transform = "scaleX("+this.linesScale+")";

		this.linesScale >= 0.9 ? undefined : requestAnimationFrame(this.startProgress.bind(this))
	}

	events(){
		window.addEventListener('load', this.pageReady.bind(this))
	}

	pageReady(){
		window.removeEventListener('load', this.pageReady.bind(this))
		this.linesScale = 1
		this.$loaderThinLine.classList.add('loader__line--active')
		this.$loaderBigLine.classList.add('loader__line--active')
		this.$el.classList.add('loader--loaded')
	}
}

export default new Loader()
