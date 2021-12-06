import axios from 'axios'

export default {
  namespaced: true,
  state: {
    token: localStorage.getItem('user-token') || '',
    status: ''
  },
  getters: {
    apiToken: s => s.token,
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status
  },
  mutations: {
    setToken: (s, token) => s.token = token,
    setStatus: (s, status) => s.status = status
  },
  actions: {
    async register({
      dispatch
    }, user) {
      await axios({
        url: 'account/register',
        data: user,
        method: 'POST'
      }).then(async response => {
        dispatch('global/alert/setAlert', {
          status: 'success',
          text: 'Вы успешно зарегестрированы'
        }, {
          root: true
        })
        await dispatch('login', {
          email: user.email,
          password: user.passwd1
        })
      }).catch(error => {
      commit('setStatus', 'error')
      })
    },
    async login({
      commit
    }, user) {
      commit('setStatus', 'loading')
      await axios({
        url: 'auth/login',
        data: user,
        method: 'POST'
      }).then(response => {
        const token = response.data.data.token
        localStorage.setItem('user-token', token)
        axios.defaults.headers.common['Authorization'] = token
        commit('setToken', token)
        commit('setStatus', 'success')
        commit('profile/info/setInfo', response.data.data, {
          root: true
        })
      }).catch(error => {
        commit('setStatus', 'error')
        localStorage.removeItem('user-token')
        throw error;
      })
      return null;
    },
    async logout({
      commit,
      dispatch
    }) {
      await axios({
        url: 'auth/logout',
        method: 'POST'
      }).then(() => {
        commit('setToken', '')
        commit('setStatus', 'logout')
        dispatch('global/alert/setAlert', {
          status: 'success',
          text: 'Вы вышли из системы'
        }, {
          root: true
        })
        localStorage.removeItem('user-token')
        delete axios.defaults.headers.common['Authorization']
      }).catch(error => {})
    }
  }
}
