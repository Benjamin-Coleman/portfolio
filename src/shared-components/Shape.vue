<template lang="html">

		<svg class="shape" :style="style" :width="size" :height="size" :viewBox="'0 0 ' + size + ' ' + size" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			<desc>Svg shape</desc>
			<defs>
				<linearGradient x1="50%" y1="0%" x2="100%" y2="100%" :id="gradientId">
					<stop :stop-color="gradientStart" offset="0%"></stop>
					<stop :stop-color="gradientStop" offset="100%"></stop>
				</linearGradient>
			</defs>
			<polygon v-if="type === 'polygon'" stroke="none" :fill="'url(#'+gradientId+')'" fill-rule="evenodd" :points="polygonPoints"></polygon>
			<polygon v-else-if="type === 'triangle'" stroke="none" :fill="'url(#'+gradientId+')'" fill-rule="evenodd" :points="size/2 + ' 7.66333121e-14 ' + size + ' ' + size + ' -2.27373675e-13 ' + size"></polygon>
			<circle v-else-if="type === 'circle'" stroke="none" :fill="'url(#'+gradientId+')'" fill-rule="evenodd" :cx="size/2" :cy="size/2" :r="size/2"></circle>
		</svg>

</template>

<script>
export default {
	props: ['type', 'size', 'gradientStart', 'gradientStop', 'x', 'y', 'z'],
	data(){
		return {
			p: {
				p1: this.size,
				p2: this.size/2,
				p3: this.size/6.82,
				p4: this.size/1.171
			},
			gradientId: 'linearGradient' + this.gradientStart + this.gradientStop,
			style: "transform: translate3d("+this.x+","+this.y+","+this.z+") scale(0.5)"
		}
	},
	computed: {
		polygonPoints(){
			return this.p.p2+' '+0+' '+this.p.p4+' '+this.p.p3+' '+this.p.p1+' '+this.p.p2+' '+this.p.p4+' '+this.p.p4+' '+this.p.p2+' '+this.p.p1+' '+this.p.p3+' '+this.p.p4+' '+0+' '+this.p.p2+' '+this.p.p3+' '+this.p.p3
		}
	}
}
</script>

<style lang="scss">

	.shape {
		position: absolute;
		left: 50%;
		top: 50%;
	}

</style>
