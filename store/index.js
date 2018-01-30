import pkg from '../package.json'

export const state = () => ({
  //counter: 0,
  pkg
})

export const mutations = {
  increment (state) {
    //state.counter++
  }
}

export const getters = {
   pkg : state => state.pkg
}




export const actions = {

}
