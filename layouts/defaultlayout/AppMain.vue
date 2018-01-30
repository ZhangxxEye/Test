<template>
  <section class="app-main" :style="[hiddenSidebarStyle]">
    <div class="container is-fluid is-marginless app-content markdown">

      <transition
        mode="out-in"
        enter-active-class="fadeIn"
        leave-active-class="fadeOut"
        appear>
        <nuxt/>

      </transition>
    </div>
  </section>
</template>

<script>
 // import Levelbar from './Levelbar'
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        sidebar: 'app/sidebar'
      }),
      hiddenSidebarStyle () {
        return this.sidebar.hidden ? { 'margin-left': 0 } : null
      }
    },

    components: {
      //Levelbar
    }
  }
</script>

<style lang="scss">
  @import '~bulma/sass/utilities/variables';
  @import '~bulma/sass/utilities/mixins';

  .app-main {
    padding-top: 50px;
    margin-left: 180px;
    transform: translate3d(0, 0, 0);

    @include mobile() {
      margin-left: 0;
    }

  }

  .app-content {
    padding: 20px;
  }
</style>
