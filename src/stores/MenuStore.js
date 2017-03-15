class MenuStore {

	constructor() {
		this.state = {
			isClosed: true,
			isAnimated: false
		}
	}

	openMenu(){
		this.state.isClosed = false
	}

	closeMenu(){
		this.state.isClosed = true
	}

	toggleMenu(){
		this.state.isClosed === true ? this.state.isClosed = false : this.state.isClosed = true
	}

	menuIsAnimated(){
		this.state.isAnimated = true
	}

	menuIsNotAnimated(){
		this.state.isAnimated = false
	}

}

export default new MenuStore()
