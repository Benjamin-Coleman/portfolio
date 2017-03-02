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

}

export default new SliderStore()
