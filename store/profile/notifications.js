import axios from 'axios'

export default {
  namespaced: true,
  state: {
    notifications: []
  },
  getters: {
    getNotifications: s => s.notifications,
    getNotificationsLength: s => s.notifications.length,
    getNotificationsTextType: s => type => {
      switch (type) {
        case 'POST':
          return 'опубликовал новую запись'
        case 'POST_COMMENT':
          return 'оставил комментарий:'
        case 'COMMENT_COMMENT':
          return 'ответил на ваш комментарий:'
        case 'FRIEND_REQUEST':
          return 'добавил вас в друзья'
        case 'FRIEND_BIRTHDAY':
          return 'день рождение'
        case 'MESSAGE':
          return 'прислал сообщение:'
      }
    },
  },
  mutations: {
    setNotifications: (s, value) => s.notifications = value,
    resetNotifications: (s) => s.notifications = [],
    deleteNotifications: (state, id) => {
      state.notifications = state.notifications.filter((item) => item.id !== id);
    },
    syncNotifications(state) {
      state.notifications = state.notifications.map((item) => ({
        ...item
      }));
    },
  },
  actions: {
    async apiNotifications({
      commit,
      dispatch
    }) {
      await axios({
        url: 'notifications',
        method: 'GET'
      }).then(response => {

        // if (`${response.data.data.map(z => z.sent_time)}` !== `${state.notifications.map(z => z.sent_time)}`) {
          commit('setNotifications', response.data.data)
        // }
        // добавить когда будет прод
        // setTimeout(() => {
        //   dispatch('apiNotifications')
        // }, 5000)

      }).catch(() => {})
    },
    async readNotificationItem(context, id) {
      context.commit('deleteNotifications', id);
      await axios(
        {
        url: `notifications?id=${id}`,
        method: 'PUT'
      }).then(() => {
        context.commit('syncNotifications')
      }).catch((error) => {console.log(error)})
    },
    async readNotifications(context) {
      await axios({
        url: 'notifications?all=true',
        method: 'PUT'
      }).then(() => {
        context.commit('resetNotifications')
      }).catch(() => {})
    }
  }
}
