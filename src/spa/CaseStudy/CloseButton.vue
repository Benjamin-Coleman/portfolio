<template lang="html">
	<div class="close-button close-button__center-content ">
		<div class="close-button__mini-button-container close-button__center-content ">
			<div class="close-button__mini-button close-button__center-content ">
				<div class="close-button__line close-button__first-line"></div>
				<div class="close-button__line close-button__second-line"></div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'close-button'
}
</script>

<style lang="scss">

	.close-button {
		font-size: 46px;
		cursor: pointer;
		margin: auto;
		width: 1.2em;
		height: 1.2em;
		border-radius: 50%;
		background-image: linear-gradient(-135deg, #FFC3CA 0%, #7E9DF6 100%);
	}

	.close-button__mini-button-container {
		width: 1.1em;
		height: 1.1em;
		box-sizing: border-box;
		border-radius: 50%;
		background-color: #011933;
	}

	.close-button__mini-button {
		width: .97em;
		height: .97em;
		box-sizing: border-box;
		border-radius: 50%;
		border: 1px solid rgba(#ffffff, .3);
		background-color: #011933;
	}

	.close-button__line {
		width: 1px;
		height: 15px;
		background-color: #ffffff;
		position: absolute;
	}

	.close-button__center-content {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-button__first-line {
		transform: rotate(45deg);
	}

	.close-button__second-line {
		transform: rotate(-45deg);
	}

</style>
