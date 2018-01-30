export const state = () => ({
  device: {
    isMobile: false,
    isTablet: false
  },
  sidebar: {
    opened: false,
    hidden: false
  },
  effect: {
    translate3d: true
  }
})

export const mutations = {

  TOGGLE_DEVICE (state, device) {
    state.device.isMobile = device === 'mobile'
    state.device.isTablet = device === 'tablet'
  },

  TOGGLE_SIDEBAR (state, config) {
    if (state.device.isMobile && config.hasOwnProperty('opened')) {
      state.sidebar.opened = config.opened
    } else {
      state.sidebar.opened = true
    }

    if (config.hasOwnProperty('hidden')) {
      state.sidebar.hidden = config.hidden
    }
  },

  SWITCH_EFFECT(state, effectItem) {
    for (let name in effectItem) {
      state.effect[name] = effectItem[name]
    }
  }
}


export const getters = {
  //app : state => state.app,
  device : state => state.device,
  sidebar : state => state.sidebar,
  effect : state => state.effect
}


export const actions = {

  async  toggleSidebar  ({ commit }, config) {
      if (config instanceof Object) {
        commit('TOGGLE_SIDEBAR', config)
      }
    },

  async toggleDevice ({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
   },



  async switchEffect ({ commit }, effectItem) {
    if (effectItem) {
      commit('SWITCH_EFFECT', effectItem)
    }
  }

}


