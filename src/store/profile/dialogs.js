import axios from 'axios'
import moment from 'moment'
import { sort } from 'semver'

const mergeIncomingMessages = ({ commit, state }, response) => {
  const fromServerNewFirst = response.data.data
  fromServerNewFirst.forEach(m => (m.sid = '' + m.id))
  const onlyNewMessages = fromServerNewFirst.filter(msgServer => !state.messages.some(m => m.id === msgServer.id))
  if (onlyNewMessages.length > 0) {
    commit('addMessages', { messages: onlyNewMessages, total: response.data.total })
  }
}

//  [msg 0] [msg 1] .... [msg 10]
//                          ^
//                          oldestLoadedId
// <-newest messages------------------------------------------------------older
export default {
  namespaced: true,
  state: {
    dialogs: [],
    unreadedMessages: 0, // total unreaded
    messages: [], // sorted oldest->newest 0 is oldest
    total: 0,
    dialogsLoaded: false,
    activeId: null,
    oldLastKnownMessageId: null,
    isHistoryEndReached: false,
    message_count: 0
  },
  getters: {
    oldestKnownMessageId: s => (s.messages.length > 0 ? s.messages[0]['id'] : null),
    dialogs: s => s.dialogs,
    activeDialog: s => s.dialogs.find(el => el.id == s.activeId),
    activeDialogId: s => s.activeId,
    dialogsLoaded: s => s.dialogsLoaded,
    unreadedMessages: s => s.unreadedMessages,
    message_count: s => {if (!s.total) {return s.total}else{return s.message_count}},
    hasOpenedDialog: s => dialogId => !!s.dialogs.find(el => el.id == dialogId),
    isHistoryEndReached: s => s.isHistoryEndReached,
    messages: s => s.messages,
    total: s => s.total
  },
  mutations: {
    setMessagesCount: (s, read) => (s.message_count = read),
    setUnreadedMessages: (s, unread) => (s.unreadedMessages = unread),
    setDialogs: (s, dialogs) => {s.dialogs = dialogs; s.message_count = message_count},
    dialogsLoaded: s => (s.dialogsLoaded = true),
    addMessages: (s, { messages, total }) => {
      s.messages = [...s.messages, ...messages]
      s.messages.sort((a, b) => a.time - b.time)
      s.total = total
      s.message_count = total
      console.log(getters.total)
    },
    selectDialog: (state, dialogId) => {
      state.activeId = dialogId
      state.messages = []
      state.isHistoryEndReached = false
      //console.log( state.dialogs[1].id)
      //console.log( state.dialogs.id)
      //console.log( state.activeId)

      //console.log( state.dialogs.find(el => el.id == state.activeId).message_count)

      state.message_count = state.dialogs.find(el => el.id == state.activeId).message_count

    },
    markEndOfHistory: s => (s.isHistoryEndReached = true)
  },
  actions: {
    closeDialog({ commit }) {
      commit('selectDialog', null)
    },

    async switchDialog({ state, getters, commit, dispatch }, dialogId) {
      if (!state.dialogsLoaded) {
        await dispatch('apiLoadAllDialogs')
      }
      if (getters.hasOpenedDialog(dialogId)) {
        commit('selectDialog', dialogId)
        await dispatch('loadFreshMessages', dialogId)
      } else {
        console.log('what to do with this dialog???? ' + dialogId)
      }
    },

    async apiLoadAllDialogs({ commit }, payload) {
      let query = []
      payload &&
        Object.keys(payload).map(el => {
          payload[el] && query.push(`${el}=${payload[el]}`)
        })
      await axios({
        url: `dialogs?${query.join('&')}`,
        method: 'GET'
      })
        .then(response => {
          commit('setDialogs', response.data.data)
          commit('dialogsLoaded')
        })
        .catch(error => {
          console.error(error)
        })
    },
    async createDialogWithUser({ dispatch, commit }, userId) {
      await axios({
        url: 'dialogs',
        method: 'POST',
        data: {
          users_ids: [userId]
        }
      })
        .then(async response => {
          const dialogId = response.data.data.id
          await dispatch('apiLoadAllDialogs', dialogId)
          await dispatch('switchDialog', dialogId)
        })
        .catch(error => {
          console.error(error)
        })
    },
    async loadTotal({ commit, state, dispatch }, id) {
      await axios({
        url: `dialogs/${id}/messages`,
        method: 'GET',
        params: {

        }
      })
        .then(response => {
          mergeIncomingMessages({ commit, state }, response)
          if (state.chaseHistoryUnitilMessageId !== null) {
            // dispatch('')
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    async loadFreshMessages({ commit, state, dispatch }, id) {
      await axios({
        url: `dialogs/${id}/messages`,
        method: 'GET',
        params: {
          offset: state.message_count-9 >= 0 ? state.message_count-9 : 0,
          itemPerPage: 10
        }
      })
        .then(response => {
          mergeIncomingMessages({ commit, state }, response)
          if (state.chaseHistoryUnitilMessageId !== null) {
            // dispatch('')
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    async loadOlderMessages({ commit, getters, state }) {
      await axios({
        url: `dialogs/${getters.activeDialogId}/messages`,
        params: {
          fromMessageId: getters.oldestKnownMessageId-10 > 0 ? getters.oldestKnownMessageId-10 : 0,
          offset: getters.oldestKnownMessageId-10 > 0 ? getters.oldestKnownMessageId-10 : 0,
          itemPerPage: 10
        },
        method: 'GET'
      })
        .then(response => {
          mergeIncomingMessages({ commit, state }, response)
          if (response.data.data.length == 0) {
            commit('markEndOfHistory')
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    async postMessage({ dispatch }, payload) {
      await axios({
        url: `dialogs/${payload.id}/messages`,
        method: 'POST',
        data: {
          message_text: payload.message_text
        }
      })
        .then(response => {
          dispatch('loadFreshMessages', payload.id)
        })
        .catch(error => {
          console.error(error)
        })
    },
    async apiUnreadedMessages({ commit }) {
      await axios({
        url: 'dialogs/unreaded',
        method: 'GET'
      })
        .then(response => {
          commit('setUnreadedMessages', response.data.data.count);
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
