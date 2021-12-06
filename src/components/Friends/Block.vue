<template lang="pug">
  .friends-block
    .friends-block__img
      img(v-if="info.photo" :src="info.photo" :alt="info.first_name")
      img(v-else src="/static/img/user/2.webp" :alt="info.first_name")
    .friends-block__info
      router-link.friends-block__name(:to="{name: 'ProfileId', params: {id: info.id}}") {{info.first_name}} {{info.last_name}}
      span.friends-block__age-city(v-if="info.moderator") модератор
      span.friends-block__age-city(v-else-if="info.birth_date && !info.city") {{agetostr(info)}}, город не указан
      span.friends-block__age-city(v-else-if="!info.birth_date && info.city") возраст не указан, {{info.city}}
      span.friends-block__age-city(v-else-if="info.birth_date && info.city") {{agetostr(info)}}, {{info.city}}
      span.friends-block__age-city(v-else) профиль не заполнен
    .friends-block__actions
      template(v-if="info.moderator")
        .friends-block__actions-block(v-tooltip.bottom="'Редактировать'")
          simple-svg(:filepath="'/static/img/edit.svg'")
        .friends-block__actions-block(v-tooltip.bottom="'Удалить из списка'" @click="openModal('deleteModerator')")
          simple-svg(:filepath="'/static/img/delete.svg'")
      template(v-else-if="info.admin")
        .friends-block__actions-block(v-tooltip.bottom="'Разблокировать'" v-if="blocked")
          simple-svg(:filepath="'/static/img/unblocked.svg'")
        .friends-block__actions-block(v-tooltip.bottom="'Заблокировать'" v-else)
          simple-svg(:filepath="'/static/img/blocked.svg'")
      template(v-else-if="!info.me")
        .friends-block__actions-block.message(v-if="!info.is_blocked && !info.is_you_blocked" v-tooltip.bottom="'Написать сообщение'" @click="sendMessage(info.id)")
          simple-svg(:filepath="'/static/img/sidebar/im.svg'")
        .friends-block__actions-block.message-blocked(v-else-if="!info.is_blocked && info.is_you_blocked" v-tooltip.bottom="'Вы заблокированы'")
          simple-svg(:filepath="'/static/img/sidebar/im.svg'")
        .friends-block__actions-block.delete(v-tooltip.bottom="'Удалить из друзей'" @click="openModal('delete')" v-if="info.is_friend === 'FRIEND' && !info.is_blocked")
          simple-svg(:filepath="'/static/img/delete.svg'")
        .friends-block__actions-block.request-received(v-tooltip.bottom="'Запрос в друзья'" @click="openModal('requestReceived')" v-else-if="info.is_friend === 'REQUEST_RECEIVED'")
          simple-svg(:filepath="'/static/img/friend-request.svg'")
        .friends-block__actions-block.cancel-request(v-tooltip.bottom="'Отменить запрос в друзья'" @click="apiCancelFriendRequest(info.id)" v-else-if="info.is_friend === 'REQUEST_SENT'")
          simple-svg(:filepath="'/static/img/friend-request.svg'")
        .friends-block__actions-block.add(v-tooltip.bottom="'Отправить запрос в друзья'" @click="apiAddFriends(info.id)" v-else-if="!info.is_blocked && !info.is_you_blocked")
          simple-svg(:filepath="'/static/img/friend-add.svg'")
        .friends-block__actions-block.add-blocked(v-tooltip.bottom="'Вы заблокированы'" v-else-if="!info.is_blocked && info.is_you_blocked")
          simple-svg(:filepath="'/static/img/friend-add.svg'")
        .friends-block__actions-block(v-if="!info.is_blocked" v-tooltip.bottom="'Заблокировать'" @click="openModal('blocked')")
          simple-svg(:filepath="'/static/img/friend-blocked.svg'")
        .friends-block__actions-block.unblock(v-else v-tooltip.bottom="'Разблокировать'" @click="openModal('unblocked')")
          simple-svg(:filepath="'/static/img/friend-unblock.svg'")
    modal(v-model="modalShow")
      p(v-if="modalText") {{modalText}}
      template(slot="actions")
        button-hover(v-if="modalType != 'requestReceived'" @click.native="onConfirm(info.id)") Да
        button-hover(v-else @click.native="onConfirm(info.id)") Принять
        button-hover(v-if="modalType != 'requestReceived'" variant="red" bordered @click.native="closeModal") Отмена
        button-hover(v-else variant="red" bordered @click.native="onDeclineFriendRequest(info.id)") Отклонить
</template>

<script>
import Modal from '@/components/Modal'
import { mapActions, mapGetters } from 'vuex'
import moment from "moment";
export default {
  name: 'FriendsBlock',
  props: {
    info: Object
  },
  components: { Modal },
  data: () => ({
    modalShow: false,
    modalType: 'delete',
  }),
  computed: {
    ...mapGetters('profile/dialogs', ['dialogs']),
    ...mapGetters('profile/friends', ['getResult', 'getResultById']),

    friends() {
      const friendsArr = this.getResultById('friends');

      if (!friendsArr) return;

      for (let i = 0; i < friendsArr.length; ++i) {
        const friendId = friendsArr[i].id;
        if (friendId === this.info.id) {
          return friendId
        }
      }
      return friendsArr;
    },

    modalText() {
      return this.modalType === 'delete'
        ? `Вы уверены, что хотите удалить пользователя ${this.info.first_name + ' ' + this.info.last_name} из друзей?`
        : this.modalType === 'deleteModerator'
        ? `Вы уверены, что хотите удалить ${this.info.first_name + ' ' + this.info.last_name} из списка модераторов?`
        : this.modalType === 'unblocked'
        ? `Вы уверены, что хотите разблокировать пользователя ${this.info.first_name + ' ' + this.info.last_name}?`
        : this.modalType === 'requestReceived'
        ? `Добавить ${this.info.first_name + ' ' + this.info.last_name} в друзья?`
        : `Вы уверены, что хотите заблокировать пользователя ${this.info.first_name + ' ' + this.info.last_name}?`
    },
  },
  methods: {
    ...mapActions('profile/friends', ['apiAddFriends', 'apiDeleteFriends', 'apiFriends', 'apiAcceptFriendRequest',
      'apiCancelFriendRequest', 'apiDeclineFriendRequest']),
    ...mapActions('profile/dialogs', ['openDialog']),
    ...mapActions('users/actions', ['apiBlockUser', 'apiUnblockUser']),
    closeModal() {
      this.modalShow = false
    },
    openModal(id) {
      this.modalType = id
      this.modalShow = true
    },
    sendMessage(userId) {
      this.$router.push({ name: 'Im', query: { userId: userId } })
    },
    onConfirm(id) {
      this.modalType === 'delete'
        ? this.apiDeleteFriends(id).then(() => this.closeModal())
        : this.modalType === 'deleteModerator'
        ? console.log('delete moderator')
        : this.modalType === 'unblocked'
        ? this.apiUnblockUser(id).then(() => this.closeModal())
        : this.modalType === 'requestReceived'
        ? this.apiAcceptFriendRequest(id).then(() => this.closeModal())
        : this.apiBlockUser(id).then(() => this.closeModal())
    },
    agetostr(info) {
      var age = moment().diff(info.birth_date, 'years');
      var txt;
      var count = age % 100;
      if (count >= 5 && count <= 20) {
        txt = 'лет';
      } else {
        count = count % 10;
        if (count == 1) {
          txt = 'год';
        } else if (count >= 2 && count <= 4) {
          txt = 'года';
        } else {
          txt = 'лет';
        }
      }
      return age+" "+txt;
    },
    onDeclineFriendRequest(id) {
      this.apiDeclineFriendRequest(id).then(() => this.closeModal())
    },
    ...mapActions('profile/friends', ['apiResultFriends'])
  },
  mounted() {
    if (this.friends.length === 0) this.apiResultFriends()
  },
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.friends-block {
  align-items: center;
  background: #fff;
  box-shadow: standart-boxshadow;
  padding: 20px;
  width: 100%;
  max-width: calc(50% - 20px);
  display: inline-flex;
  margin: 0 10px 20px;
}

.friends-block.friends-block_inner {
  max-width 100%
  margin 16px 0 0 0
}

.friends-block__img {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 30px;
  flex: none;

  @media (max-width: breakpoint-xxl) {
    margin-right: 10px;
  }

  img {
    width: 100%;
    max-width 100%
    height 100%
    object-fit cover
  }
}

.friends-block__info {
  margin-right: auto;
}

.friends-block__name {
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
  color: steel-gray;
  display: block;

  @media (max-width: breakpoint-xxl) {
    font-size: 14px;
  }
}

.friends-block__age-city {
  font-size: 15px;
  line-height: 22px;
  color: #5A5A5A;

  @media (max-width: breakpoint-xxl) {
    font-size: 13px;
  }
}

.friends-block__actions {
  display: flex;
  align-items: center;
}

.friends-block__actions-block {
  cursor: pointer;

  @media (max-width: breakpoint-xxl) {
    &+& {
      margin-left: 5px;
    }
  }

  &+& {
    margin-left: 10px;
  }

  &.message {
    margin-top: 5px;

    .simple-svg {
      fill: eucalypt;
    }
  }

  &.message-blocked {
    margin-top: 5px;

    .simple-svg {
      fill: #FF5573;
      cursor: not-allowed;
    }
  }

  &.cancel-request {

    .simple-svg path {
      fill: #FF5573;
      stroke: #FF5573;
    }
  }

  &.unblock {

    .simple-svg path {
      fill: #FF5573;
      stroke-width: 0.1;
      stroke: #FF5573;
    }
  }

  &.delete {
    margin-top: 3px;
  }

  &.add {
    margin-top: 2px;
    margin-left: 15px;
    align-items: center;
  }

  &.add-blocked {
    margin-top: 2px;
    margin-left: 15px;
    align-items: center;
    cursor: not-allowed;

    .simple-svg path {
      fill: #FF5573;
      stroke: #FF5573;

    }
  }

  .simple-svg-wrapper {
    width: 20px;
    height: 20px;
  }
}
</style>
