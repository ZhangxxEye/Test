import Cookies from 'js-cookie';

export const state = () => ({
  sidebar: {
    opened: !+Cookies.get('sidebarStatus')
  }
})

export const mutations = {

  TOGGLE_SIDEBAR: state => {
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1);
    } else {
      Cookies.set('sidebarStatus', 0);
    }
    state.sidebar.opened = !state.sidebar.opened;
  }
}


export const getters = {
  sidebar : state => state.sidebar
}


export const actions = {
  async ToggleSideBar({ commit }){
    commit('TOGGLE_SIDEBAR')
  }

}


