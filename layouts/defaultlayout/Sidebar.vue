<template>
  <aside class="menu app-sidebar animated" :class="{ slideInLeft: show, slideOutLeft: !show }">
    <p class="menu-label">
      General
    </p>
    <ul class="menu-list" v-for="(item, index) in menu">
      <li>
      <nuxt-link :to="item.path" :exact="true" :aria-expanded="isExpanded(item) ? 'true' : 'false'"
                 v-if="item.path"  active-class="active"  tag="a" @click.native="toggle(index, item)">
        <span class="icon is-small"><i :class="['fa', item.icon]"></i></span>
        {{ item.name }}
      </nuxt-link>

        <a :aria-expanded="isExpanded(item)" v-else @click="toggle(index, item)">
          <span class="icon is-small"><i :class="['fa', item.icon]"></i></span>
          {{ item.label || item.name }}
          <span class="icon is-small is-angle" v-if="item.children && item.children.length">
            <i class="fa fa-angle-down"></i>
          </span>
        </a>

        <expanding v-if="item.children && item.children.length">
          <ul v-show="isExpanded(item)">
            <li v-for="subItem in item.children" v-if="subItem.path">
              <nuxt-link :to="subItem.path">
                {{ subItem && subItem.label || subItem.name }}
              </nuxt-link>
            </li>
          </ul>
        </expanding>

      </li>
    </ul>
  </aside>
</template>

<script>

  import { mapGetters, mapActions } from 'vuex'

  export default {
    components: {
    },

    props: {
      show: Boolean
    },

    data () {
      return {
        isReady: false
      }
    },

    mounted () {
      let route = this.$route
      if (route.name) {
        this.isReady = true
       // this.shouldExpandMatchItem(route)
      }
    },

    computed: mapGetters({
        menu: 'menu/menuitems'
    }),

    methods: {
      ...mapActions({
        expandMenu:'menu/expandMenu'
      }),
      isExpanded (item) {
        return item.expanded
      },
      toggle (index, item) {
        this.expandMenu({
          index: index,
          expanded: !item.expanded
        })
      }
    },

    watch: {

    }

  }
</script>

<style lang="scss">
  @import '~bulma/sass/utilities/variables';
  @import '~bulma/sass/utilities/mixins';

  .app-sidebar {
    position: fixed;
    top: 50px;
    left: 0;
    bottom: 0;
    padding: 20px 0 50px;
    width: 180px;
    min-width: 45px;
    max-height: 100vh;
    height: calc(100% - 50px);
    z-index: 1024 - 1;
    background: #FFF;
    box-shadow: 0 2px 3px rgba(17, 17, 17, 0.1), 0 0 0 1px rgba(17, 17, 17, 0.1);
    overflow-y: auto;
    overflow-x: hidden;

    @include mobile() {
      transform: translate3d(-180px, 0, 0);
    }

    .icon {
      vertical-align: baseline;
      &.is-angle {
        position: absolute;
        right: 10px;
        transition: transform .377s ease;
      }
    }

    .menu-label {
      padding-left: 5px;
    }

    .menu-list {
      li a {
        &[aria-expanded="true"] {
          .is-angle {
            transform: rotate(180deg);
          }
        }
      }

      li a + ul {
        margin: 0 10px 0 15px;
      }
    }
  }
</style>
