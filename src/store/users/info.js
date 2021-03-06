import axios from 'axios'
import moment from 'moment'
import router from '@/router'

export default {
  namespaced: true,
  state: {
    info: null,
    wall: [],
    users: null,
    totalFeeds: null,
  },
  getters: {
    getInfo(state) {
      if (!state.info) return
      let result = {
        ...state.info,
        storage: 'sadsad'
      }
      // если понадобиться то добавить склонение (для публикаций, но нужен или пол или отчество)
      // библиотека - petrovich
      result.fullName = result.first_name + ' ' + result.last_name
      result.ages = moment().diff(result.birth_date, 'years')
      result.is_onlined = moment().diff(moment(result.last_online_time), 'seconds') <= 120
      return result
    },
    getUsersInfo(state) {
      if (!state.users) return
      let result = {
        ...state.users
      }
      // если понадобиться то добавить склонение (для публикаций, но нужен или пол или отчество)
      // библиотека - petrovich
      result.fullName = result.first_name + ' ' + result.last_name
      result.ages = moment().diff(result.birth_date, 'years')
      result.is_onlined = moment().diff(moment(result.last_online_time), 'seconds') <= 120
      return result
    },
    getWall: s => s.wall,
    getWallPostedLength: s => s.wall.filter(el => el.type === 'POSTED').length,
    getWallQueuedLength: s => s.wall.filter(el => el.type === 'QUEUED').length,
    getTotalFeeds: s => s.totalFeeds,
  },
  mutations: {
    setInfo: (s, info) => s.info = info,
    setWall: (s, wall) => s.wall = wall,
    setWallById: (s, payload) => s.wall[s.wall.indexOf(s.wall.find(el => el.id === payload.id))] = payload.value,
    setCommentsById: (s, payload) => {
      s.wall[s.wall.indexOf(s.wall.find(el => el.id === payload.post_id))].comments = payload.value
      s.wall.push('dog-nail')
      s.wall.splice(-1,1)
    },
    setUsersInfo: (s, info) => s.users = info,
    setTotalFeeds: (s, totalFeeds) => s.totalFeeds = totalFeeds,
  },
  actions: {
    async apiInfo({
      commit
    }, id) {
      await axios({
        url: `users/${id}`,
        method: 'GET'
      }).then(response => {
        commit('setInfo', response.data.data)
      }).catch(error => {})
    },
    async apiWall({
      commit
    }, payload) {
      console.log('fetch wall', payload['id'])
      await axios({
        url: `users/${payload['id']}/wall?&itemPerPage=${payload['itemPerPage']}&offset=${payload['offset']}&type=${payload['type']}`,
        method: 'GET'
      }).then(response => {
        commit('setWall', response.data.data)
        commit('setTotalFeeds', response.data.total)
      }).catch(error => {console.log('fetch wall', payload[id])})
    },
    async apiWallById({
      commit
    }, id) {
      await axios({
        url: `post/${id}`,
        method: 'GET'
      }).then(response => {
        commit('setWallById', {
          id,
          value: response.data.data
        })
      }).catch(error => {})
    },
    async apiCommentsById({
      commit
    }, id) {
      await axios({
        url: `post/${id}/comments`,
        method: 'GET'
      }).then(response => {
        commit('setCommentsById', response.data.data)
      }).catch(error => {})
    },
    async userInfoId({
      commit, dispatch
    }, id) {
      await axios({
        url: `users/${id}`,
        method: 'GET'
      }).then(async response => {
        await dispatch('apiWall', {'id':id, 'offset': 0, 'itemPerPage': 10, 'type': 'posted'})
        commit('setUsersInfo', response.data.data)
      }).catch(error => {})
    },
    async checkOnline({
      commit, dispatch
    }) {
      await axios({
        url: 'users/checkonline',
        method: 'PUT'
      }).then(response => {}).catch(() => {})
    },
  }
}
