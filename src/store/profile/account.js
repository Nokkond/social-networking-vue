import axios from 'axios'

export default {
  namespaced: true,
  state: {
    notifications: [{
        icon: 'comments',
        name: 'О новых комментариях к моим публикациям',
        type: 'POST_COMMENT',
        enable: false
      },
      {
        icon: 'reviews',
        name: 'О ответах на мои комментарии',
        type: 'COMMENT_COMMENT',
        enable: false
      },
      {
        icon: 'friends',
        name: 'О заявках в друзья',
        type: 'FRIEND_REQUEST',
        enable: false
      },
      {
        icon: 'messages',
        name: 'О новых личных сообщениях',
        type: 'MESSAGE',
        enable: false
      },
      {
        icon: 'birthdays',
        name: 'О дне рождения друга',
        type: 'FRIEND_BIRTHDAY',
        enable: false
      }
    ],
  },
  getters: {
    getNotificationsSettings: s => s.notifications
  },
  mutations: {
    setNotificationsSettings: (s, notifications) => s.notifications.map(el => el.enable = notifications.find(n => n.type === el.type).enable)
  },
  actions: {
    async passwordRecovery({}, email) {
      await axios({
        url: 'account/password/recovery',
        method: 'PUT',
        data: email
      }).then(response => {}).catch(error => {
        commit('setStatus', 'error')
      })
    },
    async shiftEmail({}) {
      await axios({
        url: 'account/shift-email',
        method: 'PUT'
      }).then(response => {}).catch(error => {
      })
    },
    async passwordSet({
      rootState
    }, password) {
      let data = {
        token: rootState.auth.api.token,
        password
      }
      await axios({
        url: 'account/password/set',
        method: 'PUT',
        data
      }).then(response => {}).catch(error => {
        commit('setStatus', 'error')
      })
    },
    async changeEmail({}, email) {
      await axios({
        url: 'account/email',
        method: 'PUT',
        data: email
      }).then(response => {}).catch(error => {
        commit('setStatus', 'error')
      })
    },
    changeNotifications({
      dispatch
    }, data) {
      axios({
        url: 'account/notifications',
        method: 'PUT',
        data
      }).then(response => {
        dispatch('global/alert/setAlert', {
          status: 'success',
          text: 'Настройки уведомления изменены'
        }, {
          root: true
        })
        dispatch('apiNotificationsSettings')
      }).catch(error => {})
    },
    async apiNotificationsSettings({
      commit
    }) {
      await axios({
        url: 'account/notifications',
        method: 'GET'
      }).then(response => {
        commit('setNotificationsSettings', response.data.data)
      }).catch(error => {})
    }
  }
}
