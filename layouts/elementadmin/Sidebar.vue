<template>
    <el-menu mode="vertical" theme="dark" :default-active="$route.path">
        <sidebar-item :routes='menus'></sidebar-item>
    </el-menu>
</template>

<script>
    import { mapGetters } from 'vuex';
    import SidebarItem from './SidebarItem';

    export default {
      components: { SidebarItem },
      data () {
        return {
          menus: [{
            name: 'Alert',
            path: '/sample/alert',
            icon: 'zujian'
          },
            {
              name: 'Aside',
              path: '/sample/aside',
              icon: 'zujian'
            },
            {
              name: 'MyVuetable',
              path: '/myvuetable',
              icon: 'zujian'
            }
          ]
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-menu {
    min-height: 100%;
}

</style>
