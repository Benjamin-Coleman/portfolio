<template lang="html">

  <div ref="menu" class="menu menu--light">
    <div class="menu-hit" @click="toggleClose" @mouseover="iconMouseOver" @mouseout="iconMouseOut"></div>
    <div ref="menuIcon" class="menu-icon">
      <div class="menu-line menu-line--big"></div>
      <div class="menu-line menu-line--little"></div>
      <div class="menu-line menu-line--big"></div>
    </div>
    <span ref="menuCircleHover" class="menu-circle-hover"></span>
    <div class="menu-links" ref="menuLinks">
      <nav-item
        v-for="navItem in navItems"
        v-bind:title="navItem.title"
        v-bind:subtitle="navItem.subtitle"
        v-bind:to="navItem.to">
      </nav-item>
    </div>
    <div class="menu-background" ref="menuBackground"></div>
  </div>

</template>

<script>

import {TimelineLite, TweenLite, Power4} from 'gsap'
import SplitText from '../../commons/script/SplitText.js'

import {EventBus} from '../../event-bus.js'
import NavItem from './NavItem.vue'

import menuStore from '../../stores/MenuStore.js'
import sliderStore from '../../stores/SliderStore.js'

const slides = require('../ThreeBackground/slides.json')

export default {

  data: function(){
    return {
      state: menuStore.state,
      sliderState: sliderStore.state,
      navItems: [
        {
          title: 'Home',
          subtitle: 'Fresh start',
          to: '/'
        },
        {
          title: 'Work',
          subtitle: 'Some of my productions',
          to: '/work'
        },
        {
          title: 'About',
          subtitle: 'Me myself and I',
          to: '/about'
        }
      ]
    }
  },

  computed: {
    isClosed(){
      return this.state.isClosed
    },
    currentSlideId(){
      return this.sliderState.currentSlideId
    }
  },

  mounted: function(){
    let el = this.$el

    this.$menuLines = this.$refs.menuIcon.children
    this.$menuCircleHover = this.$refs.menuCircleHover
    this.$menuLinks = this.$refs.menuLinks.children

    this.changeColor()
    this.iconEnter()
    this.events()

    this.openMenuAnim = new TimelineLite({paused: true})
    this.openMenuAnim
      .to(this.$menuLines[1], 0.5, {x:-10, autoAlpha: 0, ease: Expo.easeInOut})
      .to(this.$menuLines[0], 0.5, {rotation: 45, scaleX:0.7 , ease: Expo.easeInOut}, 0)
      .to(this.$menuLines[2], 0.5, {rotation:-45, scaleX:0.7 , ease: Expo.easeInOut}, 0)
      .set(this.$refs.menuLinks, {autoAlpha: 1}, 0)
      .to(this.$refs.menuBackground, 1, {autoAlpha: 1, ease: Expo.easeOut}, 0)
      .staggerTo(this.$menuLinks, 1.5, {y:0 , autoAlpha:1,  ease: Expo.easeOut}, 0.08, 0)

    this.closeMenuAnim = new TimelineLite({paused: true})
    this.closeMenuAnim
      .to(this.$menuLines[1], 0.5, {x:0, autoAlpha: 1, ease: Expo.easeInOut})
      .to(this.$menuLines[0], 0.5, {rotation: 0, scaleX:1 , ease: Expo.easeInOut}, 0)
      .to(this.$menuLines[2], 0.5, {rotation:0, scaleX:1 , ease: Expo.easeInOut}, 0)
      .to(this.$refs.menuBackground, 1, {autoAlpha: 0, ease: Expo.easeIn}, 0)
      .staggerTo(this.$menuLinks, 0.5, {y:200, autoAlpha:0, ease: Power4.easeIn}, -0.05, 0)
      .set(this.$refs.menuLinks, {autoAlpha: 0})

    this.iconMouseOverAnim = new TimelineLite({paused: true})
    this.iconMouseOverAnim
      .to(this.$menuLines[1], 0.3, {x:12,ease:Expo.easeOut}, 0)

    this.circleWaveAnim = new TimelineLite({paused: true})
      .to(this.$menuCircleHover, 0.6, {scale: 100, autoAlpha: .7, ease:Expo.easeInOut})
      .to(this.$menuCircleHover, 0.5, {autoAlpha: 0, ease:Expo.easeInOut}, '-=0.4')

    this.iconMouseOutAnim = new TimelineLite({paused: true})
    this.iconMouseOutAnim
      .to(this.$menuLines[1], 0.3, {x: 0 ,ease:Expo.easeIn}, 0)
  },

  methods: {
    events(){
      EventBus.$on('slide-next', ()=>{
        this.changeColor()
      })
      EventBus.$on('slide-prev', ()=>{
        this.changeColor()
      })
    },
    changeColor(){
      let gradient = slides[this.$route.name][this.currentSlideId].navigationGradient
      let backgroundImage = "linear-gradient(to right ,"+gradient[0]+","+gradient[1]+")"
      let tl = new TimelineLite()
        tl.to(this.$menuLines, 3,{backgroundImage: backgroundImage, ease: Power0.easeInOut})
    },
    toggleClose: function(){
      if (this.isClosed && this.menuIsNotAnimated()){
        this.openMenu()
      }
      else if(!this.isClosed && this.menuIsNotAnimated()){
        this.closeMenu()
      }
    },
    iconEnter: function(){
      let tl = new TimelineLite()
      tl.from(this.$menuLines[0], 0.4, {scaleX:0, ease:Power4.easeInOut}, '0.5')
      tl.from(this.$menuLines[2], 0.4, {scaleX:0, ease:Power4.easeInOut}, '-=0.2')
      tl.from(this.$menuLines[1], 0.4, {scaleX:0, ease:Power4.easeInOut}, '-=0.3')
    },
    iconMouseOver: function(){
      if (this.isClosed || (!this.iconMouseOverAnim.isActive() || !this.iconMouseOutAnim.isActive())) {
        this.iconMouseOverAnim.play()
        this.circleWaveAnim.play(0)
      }
    },
    iconMouseOut: function(){
      if (this.isClosed) {
        this.iconMouseOverAnim.reverse()
      }
    },
    menuIsNotAnimated: function(){
      if (this.openMenuAnim.isActive() || this.closeMenuAnim.isActive()) {
        return false
      }
      else {
        return true
      }
    },
    openMenu: function(){
      this.openMenuAnim.play(0)
      menuStore.openMenu()
      EventBus.$emit('toggle-menu', this.isClosed)
    },
    closeMenu: function(){
      this.closeMenuAnim.play(0)
      menuStore.closeMenu()
      EventBus.$emit('toggle-menu', this.isClosed)
    }
  },

  components: {
    NavItem
  }

}

</script>

<style lang="scss">

  .menu {
    width: 100%;
    height: 100%;
    position: absolute;
    font-family: 'SorrenMedium';
    overflow: hidden;
  }

  .menu-hit {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100px;
    height: 110px;
    cursor: pointer;
    z-index: 11;
  }

  .menu-icon {
    margin-top: 40px;
    margin-left: 40px;
    width: 50px;
    position: relative;
    z-index: 10;
    display: inline-block;
    vertical-align: middle;
  }

  .menu-line {
    width: 100%;
    height: 1px;
    background-image: linear-gradient(-134deg, #8A86BE 0%, #EEE0FB 100%, #B397B8 100%);
    margin-bottom: 11px;
    transform-origin: left;

    &:last-child {
      margin-bottom: 0px;
    }
  }

  .menu-line--little {
    width: 40%;
  }

  .menu-tooltip {
    margin-left: 30px;
    margin-top: 40px;
    vertical-align: middle;
    display: inline-block;

    font-size: 19px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .menu--light {
    color: #ffffff;
  }

  .menu-circle-hover {
    width: 1px;
    height: 1px;
    background-color: #ffffff;
    opacity: 0;
    position: fixed;
    top: 50px;
    left: 60px;
    border-radius: 50%;
    transform-origin: center;
    z-index: -1;
  }

  .menu-background {
    width: 100%;
    height: 100%;
    z-index: 9;
    position: absolute;
    visibility: hidden;
    opacity: 0;
    top: 0;
    left: 0;
    background-color: rgba(#011832, .9);
  }

  .menu-links {
    position: absolute;
    width: 100%;
    text-align: center;
    margin: auto;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    visibility: hidden;
  }

</style>
