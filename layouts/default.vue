<template>
  <div id="app">
    <navbar :show="true"></navbar>
    <sidebar :show="sidebar.opened && !sidebar.hidden"></sidebar>
    <app-main></app-main>
    <footer-bar></footer-bar>
  </div>
</template>

<script>
  // import NprogressContainer from 'vue-nprogress/src/NprogressContainer'

  // import { Navbar, Sidebar, AppMain, FooterBar } from './defaultlayout'
  // import '~assets/scss/main.scss'

  import {Navbar, Sidebar, AppMain, FooterBar} from './defaultlayout'

  import { mapGetters, mapActions } from 'vuex'

  export default {
    components: {
      Navbar,
      Sidebar,
      AppMain,
      FooterBar
      // NprogressContainer
    },
    computed: mapGetters({
      sidebar: 'app/sidebar'
    }),

    beforeMount () {
      const { body } = document
      const WIDTH = 768
      const RATIO = 3

      const handler = () => {
        if (!document.hidden) {
          let rect = body.getBoundingClientRect()
          let isMobile = rect.width - RATIO < WIDTH

          this.toggleDevice(isMobile ? 'mobile' : 'other')
          this.toggleSidebar({opened: !isMobile})
        }
      }

      document.addEventListener('visibilitychange', handler)
      window.addEventListener('DOMContentLoaded', handler)
      window.addEventListener('resize', handler)
    },

    methods: {
      ...mapActions({
        toggleDevice: 'app/toggleDevice',
        toggleSidebar: 'app/toggleSidebar'
      })

    }
  }
</script>

<style lang="scss">

 // @import '~animate.css';
 // .animated {
 //   animation-duration: .377s;
 // }

  //@import '~bulma';

  //@import '~wysiwyg.css/wysiwyg.sass';

  //$fa-font-path: '~font-awesome/fonts/';
  //@import '~font-awesome/scss/font-awesome';

  html {
    background-color: whitesmoke;
  }

  .nprogress-container {
    position: fixed !important;
    width: 100%;
    height: 50px;
    z-index: 2048;
    pointer-events: none;

    #nprogress {
      $color: #48e79a;

      .bar {
        background: $color;
      }
      .peg {
        box-shadow: 0 0 10px $color, 0 0 5px $color;
      }

      .spinner-icon {
        border-top-color: $color;
        border-left-color: $color;
      }
    }
  }
</style>
