import axios from 'axios'

export default {
  namespaced: true,
  state: {
    cities: [],
    default:[
      {
        id: 1,
        title: 'Москва',
      },
      {
        id: 2,
        title: 'Detroit',
      }
    ],
  },
  getters: {
    getCities: s => s.cities,
    getDefaultCities: s => s.default,
  },
  mutations: {
    setCities: (s, cities) => s.cities = cities,
    setDefaultCities: (state, city) => state.default = city,
  },
  actions: {
    async apiCities({ commit } ) {
      await axios({
        url: 'platform/cities',
        method: 'GET'
      }).then(response => {
        console.log(response.data.data)
        commit('setCities', response.data.data)
      }).catch(error => {console.log(error.message)})
    },
  }
}
