class SliderStore {

	constructor() {
		this.state = {
			currentSlideId: 0,
			isAnimated: false,
			posY: 0,
			isActive: false,
			caseStudyIsOpen: false
		}
	}

	increment(){
		this.state.currentSlideId ++
	}

	decrement(){
		this.state.currentSlideId --
	}

	setSlideId(slideIdToSet){
		this.state.currentSlideId = slideIdToSet
	}

	sliderIsAnimated(){
		this.state.isAnimated = true
	}

	sliderIsNotAnimated(){
		this.state.isAnimated = false
	}

	setPosY(posY){
		this.state.posY = posY
	}

	setActive(){
		this.state.isActive = true
	}

	setInactive(){
		this.state.isActive = false
	}

	openCaseStudy(){
		this.state.caseStudyIsOpen = true
	}

	closeCaseStudy(){
		this.state.caseStudyIsOpen = false
	}

	reset(){
		this.state.currentSlideId = 0
	}

}

export default new SliderStore()
