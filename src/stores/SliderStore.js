class SliderStore {

	constructor() {
		this.state = {
			currentSlideId: 0
		}
	}

	increment(){
		this.state.currentSlideId ++
	}

	decrement(){
		this.state.currentSlideId --
	}

	reset(){
		this.state.currentSlideId = 0
	}

}

export default new SliderStore()
