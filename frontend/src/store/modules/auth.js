import axios from 'axios'

const state = {
  user: {
    username: localStorage.getItem('username') || ''
  }
}

const getters = {
  user: state => state.user
}

const actions = {
  async register({ commit }, payload) {
    const response = await axios.post('http://127.0.0.1:8000/api/register/', payload)
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('username', response.data.username)
    commit('setUser', { username: response.data.username })
  },

  logout({ commit }) {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    commit('setUser', { username: '' })
  }
}

const mutations = {
  setUser(state, user) {
    state.user = user
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
