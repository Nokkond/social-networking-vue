import axios from 'axios'

export default {
  namespaced: true,
  state: {
    feeds: [],
    totalFeeds: null,
  },
  getters: {
    getFeeds: s => s.feeds,
    getTotalFeeds: s => s.totalFeeds,
  },
  mutations: {
    setFeeds: (s, feeds) => s.feeds = feeds,
    setTotalFeeds: (s, totalFeeds) => s.totalFeeds = totalFeeds,
    setCommentsById: (s, payload) => {
      s.feeds[s.feeds.indexOf(s.feeds.find(el => el.id === payload.post_id))].comments = payload.value
      s.feeds.push('dog-nail')
      s.feeds.splice(-1,1)
    },
    setFeedsById: (s, payload) => s.feeds[s.feeds.indexOf(s.feeds.find(el => el.id === payload.id))] = payload
  },
  actions: {
    async apiFeeds({
      commit
    }, payload) {
      let query = []
      payload && Object.keys(payload).map(el => {
        payload[el] && query.push(`${el}=${payload[el]}`)
      })
      await axios({
        url: `feeds?${query.join('&')}itemPerPage=5`,
        method: 'GET'
      }).then(response => {
        console.log("TCL: apiFeeds -> response", response)
        commit('setFeeds', response.data.data)
        commit('setTotalFeeds', response.data.total)
      }).catch(() => {})
    },
    async apiFeedsById({
      commit
    }, post_id) {
      await axios({
        url: `post/${post_id}`,
        method: 'GET'
      }).then(response => {
        console.log("TCL: apiFeeds -> response", response)
        commit('setFeedsById', response.data)
      }).catch(() => {})
    },
    async actionsFeed({
      dispatch
    }, payload) {
      console.log("TCL: payload", payload)
      let url = payload.edit ? `post/${payload.post_id}` : `users/${payload.id}/wall`
      let method = payload.edit ? 'PUT' : 'POST'
      if (payload.publish_date) url += '?publish_date=' + payload.publish_date
      await axios({
        url,
        method,
        data: {
          title: payload.title,
          post_text: payload.post_text,
          tags: payload.tags
        }
      }).then(response => {
        if (payload.edit) {
          dispatch('users/info/apiWallById', payload.post_id, {
            root: true
          })
        } else {
          payload.route === 'News' ?
            dispatch('apiFeeds') :
            dispatch('users/info/apiWall', {
              id: payload.id
            }, {
              root: true
            })
        }
      }).catch(() => {})
    },
    async deleteFeeds({dispatch}, payload) {
      await axios({
        url: `post/${payload.post_id}`,
        method: 'DELETE'
      }).then(response => {
        payload.route === 'News' ?
          dispatch('apiFeeds') :
          dispatch('users/info/apiWall', {
            id: payload.id
          }, {
            root: true
          })
      }).catch(() => {})
    }
  }
}
