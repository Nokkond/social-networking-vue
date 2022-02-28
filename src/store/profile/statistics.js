import axios from 'axios'

export default {
  namespaced: true,
  state: {
    result: {
      comments: 34,
      first_publication: null,
      likes: null,
      posts: [],
      //things: []
      statistics: [{
        'comments': 0,
        'first_publication': '2021-11-12T11:55:56.000+00:00',
        'likes': 0,
        'posts': 1
      }
      ]
    }
  },
  getters: {
    getResult: s => s.result,
    getResultById: s => id => s.result[id],
  },
  mutations: {
    setResult: (s, payload) => s.result[payload.id] = payload.value,
    setResultArray: (s, payload) => s.result[payload.id].push(payload.value),
    // resetFriendsById: (s, payload) => {
    //   s.result[payload.id] = s.result[payload.id].filter((item) => item.payload.value.id !== payload.value.id);
    // },
  },
  actions: {
    async apiGetStatistics({
                       commit,
                     }, payload) {
      let query = []
      payload && Object.keys(payload).map(el => {
        payload[el] && query.push(`${el}=${payload[el]}`)
      })
      await axios({
        url: `statistics?${query.join('&')}`,
        method: 'GET'
      }).then(response => {
        commit('setResult', {
          id: 'statistics',
          value: response.data
        })
        // dispatch('apiFriends')
      }).catch(error => {console.log(error)})
    },

  }
}
