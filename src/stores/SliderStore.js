class SliderStore {

	constructor() {
		this.state = {
			currentSlideId: 0,
			isAnimated: false
		}
	}

	increment(){
		this.state.currentSlideId ++
	}

	decrement(){
		this.state.currentSlideId --
	}

	sliderIsAnimated(){
		this.state.isAnimated = true
	}

	sliderIsNotAnimated(){
		this.state.isAnimated = false
	}

	reset(){
		this.state.currentSlideId = 0
	}

}

export default new SliderStore()
