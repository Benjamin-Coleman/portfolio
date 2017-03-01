class LeaveAnimationDelay {

	constructor() {
		this.delay = 0
	}

	getLeaveDelay(component){
		this.getChildrenDelay(component)
		return this.delay
	}

	getChildrenDelay(component){

		if (component.leaveDelay !== undefined) {
			component.leaveDelay > this.delay ? this.delay = component.leaveDelay : undefined
		}

		if (component.$children.length > 0) {
			for (var i = 0; i < component.$children.length; i++) {
				this.getChildrenDelay(component.$children[i])
			}
		}

	}

}

export default LeaveAnimationDelay
