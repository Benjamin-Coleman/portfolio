import Home from './spa/Home/Home.vue'
import Work from './spa/Work/Work.vue'
import About from './spa/About/About.vue'

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
		path: '/about',
		name: 'about',
		component: About
	},
	{
		path: '*',
		name: 'all',
		component: Home
	}
]
