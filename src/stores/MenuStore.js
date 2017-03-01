class MenuStore {

	constructor() {
		this.state = {
			isClosed: true
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

}

export default new MenuStore()
