<template lang="html">
	<div class="case-study__lightswan">
		<div class="case-study__photo-background-container">
			<div class="case-study__photo-background"></div>
			<img class="case-study__photo" src="../../assets/imgs/case-study/lightswan/card.png"
			srcset="../../assets/imgs/case-study/lightswan/card@2x.png 2x"
			alt="">
		</div>

		<div class="case-study__typography case-study__row">
			<div class="case-study__title">Typography</div>
			<div class="case-study__typography-block">
				<div class="case-study__mini-title">
					Europa - titling
				</div>
				<img class="case-study__typo-img" src="../../assets/imgs/case-study/lightswan/typo1.svg" alt="">
			</div>
			<div class="case-study__typography-block">
				<div class="case-study__mini-title">
					Baskerville - text
				</div>
				<img class="case-study__typo-img" src="../../assets/imgs/case-study/lightswan/typo2.svg" alt="">
			</div>
		</div>

		<div class="case-study__colors case-study__row">
			<div class="case-study__title">Colors</div>
			<div class="case-study__color-blocks">
				<div class="case-study__color-block" v-for="color in colors">
					<div class="case-study__color" :style="'background-color: '+color.hex "></div>
					<div class="case-study__mini-title">{{color.hex}}</div>
				</div>
			</div>
		</div>

		<div class="case-study__middle-part">

		</div>



		<div class="case-study__home">

			<div class="case-study__line case-study__row">

				<div class="case-study__half-block">
					<div class="case-study__title">Home</div>
					<div class="case-study__text-content">
						We choose to put Jesse Owens on the homepage of Lightswan.
						It was an important cultural reference for François Pumir and Florian Pittion-Rossillon.  It’s also a strong symbol which corresponds to the image they want to give to their company. Forerunner, powerful and limitless.
					</div>
				</div>

				<div class="case-study__half-block">
					<div class="case-study__mobile-screen">
						<div class="case-study__screen-circle">
							<img src="../../assets/imgs/case-study/lightswan/home-mobile.png"
							srcset="../../assets/imgs/case-study/lightswan/home-mobile@2x.png 2x"
							alt="">
						</div>
					</div>
				</div>

			</div>

			<div class="case-study__full-screenshot">
				<img class="case-study__full-screenshot__bg"
					src="../../assets/imgs/case-study/lightswan/screen-bg.svg"
					alt="">
				<img class="case-study__full-screenshot__img case-study__row case-study__img "
					src="../../assets/imgs/case-study/lightswan/home-desktop.jpg"
					srcset="../../assets/imgs/case-study/lightswan/home-desktop@2x.jpg 2x"
					alt="">
			</div>

			<div class="case-study__row">
					<img class="case-study__perspective-mockup"
					src="../../assets/imgs/case-study/lightswan/perspective-mockup.png"
					srcset="../../assets/imgs/case-study/lightswan/perspective-mockup@2x.png 2x"
					alt="">
			</div>

			<div class="case-study__line case-study__row case-study__article-mobile">

				<div class="case-study__half-block">
					<div class="case-study__title">Article</div>
					<div class="case-study__text-content">
						It was very important to have a blog on the site to share the vision of the company.  The content  is the heart of the communication strategy of lightswan. This is why there is many custom blog functionalities like a custom player, as slideshow, differents styling fot pictures and custom block for quotes.
					</div>
				</div>

				<div class="case-study__half-block">
					<div class="case-study__mobile-screen">
						<div class="case-study__screen-circle">
							<img src="../../assets/imgs/case-study/lightswan/article-mobile.png"
							srcset="../../assets/imgs/case-study/lightswan/article-mobile@2x.png 2x"
							alt="">
						</div>
					</div>
				</div>

			</div>

			<div class="case-study__full-screenshot">
				<img class="case-study__full-screenshot__bg"
					src="../../assets/imgs/case-study/lightswan/screen-bg.svg"
					alt="">
				<img class="case-study__full-screenshot__img case-study__row case-study__img "
					src="../../assets/imgs/case-study/lightswan/article-desktop.jpg"
					srcset="../../assets/imgs/case-study/lightswan/article-desktop@2x.jpg 2x"
					alt="">
			</div>

			</div>
		</div>

	</div>
</template>

<script>
export default {
	data(){
		return {
			colors: [
				{hex: '#F7F3EA'},
				{hex: '#2A3142'},
				{hex: '#82CAC4'},
				{hex: '#EE8A73'}
			]
		}
	}
}
</script>

<style lang="scss">

	.case-study__lightswan {

		.case-study__photo-background {
			background-color: #F7F3EA;
		}

		.case-study__color-block {

			.case-study__mini-title {
				opacity: 1;
				text-align: center;
				margin-top: .5em;
			}

		}

		.case-study__full-screenshot__bg {
			background-color: #F7F3EA;
		}

		.case-study__screen-circle {
			background-color: #F7F3EA;
		}

		.case-study__home {
			font-size: 30px;
			width: 100%;
			margin-top: 10em;
		}

		.case-study__perspective-mockup {
			display: block;
		}

		.case-study__article-mobile {
			margin-top: 10em;
		}

	}

</style>
