class SliderStore {

	constructor() {
		this.state = {
			currentSliderId: 0
		}
	}

	increment(){
		this.state.currentSliderId ++
	}

	decrement(){
		this.state.currentSliderId --
	}

}

export default new SliderStore()
