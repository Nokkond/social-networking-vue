import axios from 'axios'

export default {
  namespaced: true,
  state: {
    country: null,
  },
  getters: {
    getCountries: s => s.country,
  },
  mutations: {
    setCountries: (s, country) => s.country = country
  },
  actions: {
    async apiCountries({ commit }) {
      await axios({
        url: 'platform/countries',
        method: 'GET'
      }).then(response => {
        commit('setCountries', response.data.data)
      }).catch(error => {})
    },
  }
}
