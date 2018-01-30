import axios from 'axios'
const server = "http://localhost:8080"
export const state = () => ({
  users:{}
})
export const getters = {
  schemas: (state) => {
    let labels = state.users.tableLables
    if (labels) {
      labels.map((value) => {
        value['model'] = value['prop']
        return value
      })
      return labels
    }
  }
}


export const mutations = {

  GET_USERS_SUCCESS (state, users) {
    state.users = users
  }
}

export const actions = {
  getUsers ({commit}, payload) {
    return new Promise((resolve, reject) => {
      axios["get"](server+'/api/users', payload) .then(function (response) {
        commit('GET_USERS_SUCCESS',response.data)
        resolve(response.data)
      })
        .catch(function (error) {
          reject(error)
        });
    })
  },
  delete ({commit}, payload) {
    let params = ''
    if (payload.length == 1) {
      params = payload[0]
    } else if (payload.length > 1) {
      params = payload.join('&ids=')
    }
    return new Promise((resolve, reject) => {
      axios["delete"](server + '/api/delete?ids=' + params) .then(function (response) {
        resolve(response)
      })
        .catch(function (error) {
          reject(error)
        });
    })
  },
  batchDelete ({commit}, payload) {
    let parames = {}
    parames['id'] = payload
    return new Promise((resolve, reject) => {
      axios["delete"](server + '/api/delete', {params: parames}) .then(function (response) {
        resolve(response)
      })
        .catch(function (error) {
          reject(error)
        });
    })
  },
  update ({commit}, payload) {
    let type = payload.type
    let url = ''
    if (type === 'edit')
      url = '/api/update'
    else url = '/api/add'
    return new Promise((resolve, reject) => {
      axios["post"](server + url, payload) .then(function (response) {
        resolve(response)
      })
        .catch(function (error) {
          reject(error)
        });
    })
  }
}

