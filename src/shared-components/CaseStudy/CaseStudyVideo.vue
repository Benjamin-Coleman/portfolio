<template lang="html">
	<div class="case-study__video case-study__row">
		<video class="case-study__video-element " autoplay loop>
			<slot></slot>
		</video>
	</div>
</template>

<script>
export default {

}
</script>

<style lang="scss">

.case-study__video-element {
	width: 100%;
	font-size: 30px;
	display: block;
	position: relative;
	padding: 7em 7em;
	background-color: #03162A;
	z-index: 1;
}

.case-study__video {
	font-size: 30px;
	margin: 5em 0em;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;

	&:last-child {
		margin-bottom: 0em;
	}

}

</style>
