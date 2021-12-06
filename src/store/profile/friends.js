import axios from 'axios'

export default {
  namespaced: true,
  state: {
    result: {
      friends: [],
      request: [],
      recommendations: []
    }
  },
  getters: {
    getResult: s => s.result,
    getResultById: s => id => s.result[id],
  },
  mutations: {
    setResult: (s, payload) => s.result[payload.id] = payload.value,
    setResultArray: (s, payload) => s.result[payload.id].push(payload.value),
    resetFriendsById: (s, payload) => {
      s.result[payload.id] = s.result[payload.id].filter((item) => item.payload.value.id !== payload.value.id);
    },
  },
  actions: {
    async isApiRequestFriends({
      commit
    }, payload) {
      let query = []
      payload && Object.keys(payload).map(el => {
        payload[el] && query.push(`${el}=${payload[el]}`)
      })
      await axios({
        url: `friends/?${query.join('&')}`,
        method: 'GET'
      }).then(response => {
        console.log(response.data.data)
        commit('setResultArray', {
          id: 'request',
          value: response.data.data
        })
      }).catch(error => {
        console.log(error)
      })
    },
    async isApiFriends({
      commit,
    }, payload) {
      let query = []
      payload && Object.keys(payload).map(el => {
        payload[el] && query.push(`${el}=${payload[el]}`)
      })
      await axios({
        url: `friends?${query.join('&')}`,
        method: 'GET'
      }).then(response => {
        commit('setResultArray', {
          id: 'friends',
          value: ''
        })
        commit('resetFriendsById', {
          id: 'request',
          value: ''
        })
      })
      .catch(error => {
        console.log(error)
      })
    },
    async apiFriends({
      commit,
    }, payload) {
      let query = []
      payload && Object.keys(payload).map(el => {
        payload[el] && query.push(`${el}=${payload[el]}`)
      })
      await axios({
        url: `friends?${query.join('&')}`,
        method: 'GET'
      }).then(response => {
        commit('resetFriendsById', {
          id: 'friends',
          value: response.data.data
        })
        // dispatch('apiFriends')
      }).catch(error => {console.log(error)})
    },
    apiDeleteFriends({
      dispatch
    }, id) {
      axios({
        url: `friends/${id}`,
        method: 'DELETE'
      }).then(response => {
        console.log("TCL: response", response)
        dispatch('global/alert/setAlert', {
          status: 'success',
          text: 'Пользователь удален из друзей'
        }, {
          root: true
        })
        dispatch('apiFriends')
      }).catch(error => {
        console.log(error)
      })
    },
    apiAddFriends({
      dispatch
    }, id) {
      axios({
        url: `friends/${id}`,
        method: 'POST'
      }).then(response => {
        dispatch('global/alert/setAlert', {
          status: 'success',
          text: 'Запрос на дружбу отправлен'
        }, {
          root: true
        })
        dispatch('apiFriends')
      }).catch(error => {
        console.log(error)
      })
    },
    apiAcceptFriendRequest({
      dispatch
    }, id) {
      axios({
        url: `friends/${id}`,
        method: 'POST'
      }).then(response => {
        dispatch('global/alert/setAlert', {
          status: 'success',
          text: 'Вы приняли запрос на дружбу'
        }, {
          root: true
        })
        dispatch('apiFriends')
      }).catch(error => {
        console.log(error)
      })
    },
    apiDeclineFriendRequest({
      dispatch
    }, id) {
      axios({
        url: `friends/${id}`,
        method: 'DELETE'
      }).then(response => {
        dispatch('global/alert/setAlert', {
          status: 'success',
          text: 'Запрос на дружбу отклонён'
        }, {
          root: true
        })
        dispatch('apiFriends')
      }).catch(error => {
        console.log(error)
      })
    },
    apiCancelFriendRequest({
      dispatch
    }, id) {
      axios({
        url: `friends/${id}`,
        method: 'DELETE'
      }).then(response => {
        dispatch('global/alert/setAlert', {
          status: 'success',
          text: 'Запрос на дружбу отменён'
        }, {
          root: true
        })
        dispatch('apiFriends')
      }).catch(error => {
        console.log(error)
      })
    },
    async apiRequestFriends({
      commit
    }, payload) {
      let query = []
      payload && Object.keys(payload).map(el => {
        payload[el] && query.push(`${el}=${payload[el]}`)
      })
      await axios({
        url: `friends/request?${query.join('&')}`,
        method: 'GET'
      }).then(response => {
        commit('setResult', {
          id: 'request',
          value: response.data.data,
        })
      }).catch(error => {console.log(error)})
    },
    async apiResultFriends({
      commit
    }, payload) {
      let query = []
      payload && Object.keys(payload).map(el => {
        payload[el] && query.push(`${el}=${payload[el]}`)
      })
      await axios({
        url: `friends/?${query.join('&')}`,
        method: 'GET'
      }).then(response => {
        commit('setResult', {
          id: 'friends',
          value: response.data.data,
        })
      }).catch(error => {console.log(error)})
    },
    async apiRecommendations({
      commit
    }, payload) {
      let query = []
      payload && Object.keys(payload).map(el => {
        payload[el] && query.push(`${el}=${payload[el]}`)
      })
      await axios({
        url: `friends/recommendations?${query.join('&')}`,
        method: 'GET'
      }).then(response => {
        commit('setResult', {
          id: 'recommendations',
          value: response.data.data,
        })
      }).catch(error => {})
    }
  }
}
