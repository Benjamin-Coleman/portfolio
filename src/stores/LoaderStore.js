class LoaderStore {

	constructor() {
		this.state = {
			pageReady: false
		}
	}

	setPageReady(){
		this.state.pageReady = true
	}

	setPageNotReady(){
		this.state.pageReady = false
	}

}

export default new LoaderStore()
