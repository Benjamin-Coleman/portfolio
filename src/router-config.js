import Home from './spa/Home/Home.vue'
import Work from './spa/Work/Work.vue'
import About from './spa/About/About.vue'
import CaseStudy from './spa/CaseStudy/CaseStudy.vue'

export const routes = [
	{
		path: '/',
		component: Home,
		name: 'home'
	},
	{
		path: '/work/:id',
		component: CaseStudy
	},
	{
		path: '/work',
		name: 'work',
		component: Work,
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
