export const state = () => ({
  items: [{
    name: 'Alert',
    path: '/sample/alert',
    icon: 'fa-tachometer'
  },
    {
      name: 'Aside',
      path: '/sample/aside',
      icon: 'fa-tachometer'
    },
    {
      name: 'MyVuetable',
      path: '/myvuetable',
      icon: 'fa-tachometer'
    },
    {
      name: 'Template',
      path: '/templatetable',
      icon: 'fa-tachometer'
    },
    {
      name: 'Charts',
      expanded: false,
      icon: 'fa-bar-chart-o',
      children: [
        {
          name: 'Histogram',
          path: '/charts/histogram'
        },
        {
          name: 'Line',
          path: '/charts/line'
        },
        {
          name: 'Peity',
          path: '/peity'
        },
        {
          name: 'Plotly',
          path: '/plotly'
        }
      ]
    }
  ]

})

export const getters = {
  menuitems: state => state.items,
  componententry: state => {
    return state.items.filter(c => c.meta && c.meta.label === 'Components')[0]
  }
}

export const mutations = {

  EXPAND_MENU (state, menuItem) {
    console.log('menuItem.index:' + menuItem.index)
    if (menuItem.index > -1) {
      if (state.items[menuItem.index]) {
        state.items[menuItem.index].expanded = menuItem.expanded
      }
    }
  }

}

export const actions = {
  async expandMenu  ({commit}, menuItem) {
    if (menuItem) {
      menuItem.expanded = menuItem.expanded || false
      //console.log(menuItem.expanded);
      commit('EXPAND_MENU', menuItem)
    }
  },
}
