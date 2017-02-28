import Home from './spa/Home/Home.vue'
import Work from './spa/Work/Work.vue'

export const routes = [
	{
		path: '/',
		component: Home,
		name: 'home'
	},
	{
		path: '/work',
		name: 'work',
		component: Work
	},
	{
		path: '*',
		name: 'all',
		component: Home
	}
]
