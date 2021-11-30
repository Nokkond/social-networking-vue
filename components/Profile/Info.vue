<template lang="pug">
  .profile-info(v-if="info")
    .profile-info__pic
      .profile-info__img(:class="{offline: !online && !me}")
        img(v-if="info.photo" :src="info.photo" :alt="info.fullName")
        img(v-else src="/static/img/user/2.webp" :alt="info.fullName")
      .profile-info__actions(v-if="!me && meBlocked && !blocked")
        button-hover(disable) Вы заблокированы
      .profile-info__actions(v-else-if="!me && meBlocked && blocked")
        button-hover(:disable="blocked" @click.native="onSentMessage") Вы заблокированы
        button-hover.profile-info__add(:variant="btnVariantInfo.variant" bordered  @click.native="profileAction") {{btnVariantInfo.text}}
      .profile-info__actions(v-else-if="!me")
        button-hover(:disable="blocked" @click.native="onSentMessage") Написать сообщение
        button-hover.profile-info__add(:variant="btnVariantInfo.variant" bordered  @click.native="profileAction") {{btnVariantInfo.text}}
    .profile-info__main
      router-link.edit(v-if="me" :to="{name: 'Settings'}" v-tooltip.bottom="'Редактировать профиль'")
        simple-svg(:filepath="'/static/img/edit.svg'")
      span.profile-info__blocked(:class="{blocked}" v-else @click="blockedUser") {{blockedText}}
      .profile-info__header
        h1.profile-info__name {{info.fullName}}
        span.user-status(:class="{online, offline: !online}") {{statusText}}
      .profile-info__block
        span.profile-info__title Дата рождения:
        span.profile-info__val(v-if="info.birth_date") {{info.birth_date | moment("D MMMM YYYY") }} ({{ageToStr(info.ages)}})
        span.profile-info__val(v-else) не заполнено
      .profile-info__block
        span.profile-info__title Телефон:
        a.profile-info__val(v-if="info.phone" :href="`tel:${info.phone}`") {{info.phone | phone}}
        a.profile-info__val(v-else) не заполнено
      .profile-info__block
        span.profile-info__title Страна:
        span.profile-info__val(v-if="info.country") {{info.country}}
        span.profile-info__val(v-else) не заполнено
      .profile-info__block
        span.profile-info__title Город:
        span.profile-info__val(v-if="info.city") {{info.city}}
        span.profile-info__val(v-else) не заполнено
      .profile-info__block
        span.profile-info__title О себе:
        span.profile-info__val(v-if="info.about") {{info.about}}
        span.profile-info__val(v-else) не заполнено
    modal(v-model="modalShow")
      p(v-if="modalText") {{modalText}}
      template(slot="actions")
        button-hover(v-if="modalType != 'requestReceived'" @click.native.prevent="onConfirm") Да
        button-hover(v-else @click.native.prevent="onConfirm") Принять
        button-hover(v-if="modalType != 'requestReceived'" variant="red" bordered @click.native="closeModal") Отмена
        button-hover(v-else variant="red" bordered @click.native="onDeclineFriendRequest") Отклонить
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Modal from '@/components/Modal'
import moment from "moment";

export default {
  name: 'ProfileInfo',
  components: { Modal },
  props: {
    me: Boolean,
    online: Boolean,
    blocked: Boolean,
    friend: String,
    meBlocked: Boolean,
    info: Object
  },
  data: () => ({
    modalShow: false,
    modalText: '',
    modalType: 'deleteFriend'
  }),
  computed: {
    ...mapGetters('profile/dialogs', ['dialogs']),
    statusText() {
      return this.online ? 'онлайн' : 'не в сети'
    },
    blockedText() {
      return this.blocked ? 'Пользователь заблокирован' : 'Заблокировать'
    },
    btnVariantInfo() {
      return this.blocked
        ? { variant: 'red', text: 'Разблокировать' }
        : this.friend === 'FRIEND'
        ? { variant: 'red', text: 'Удалить из друзей' }
        : this.friend === 'REQUEST_RECEIVED'
        ? { variant: 'blue', text: 'Запрос в друзья' }
        : this.friend === 'REQUEST_SENT'
        ? { variant: 'white', text: 'Отменить запрос в друзья' }
        : { variant: 'white', text: 'Добавить в друзья' }
    }
  },
  methods: {
    ...mapActions('users/actions', ['apiBlockUser', 'apiUnblockUser']),
    ...mapActions('profile/friends', ['apiAddFriends', 'apiDeleteFriends', 'apiDeclineFriendRequest',
      'apiAcceptFriendRequest', 'apiCancelFriendRequest']),
    ...mapActions('profile/dialogs', ['createDialogWithUser', 'apiLoadAllDialogs']),
    ...mapActions('users/info', ['apiInfo']),
    blockedUser() {
      if (this.blocked) return
      this.modalText = `Вы уверены, что хотите заблокировать пользователя ${this.info.fullName}?`
      this.modalShow = true
      this.modalType = 'block'
    },
    profileAction() {
      if (this.blocked) {
        this.apiUnblockUser(this.$route.params.id).then(() => {
          this.apiInfo(this.$route.params.id)
        })
        return
      }
      if (this.friend === 'FRIEND') {
        this.modalText = `Вы уверены, что хотите удалить пользователя ${this.info.fullName} из друзей?`
        this.modalShow = true
        this.modalType = 'deleteFriend'
        return
      }
      if (this.friend === 'REQUEST_RECEIVED') {
        this.modalText = `Добавить ${this.info.fullName} в друзья?`
        this.modalShow = true
        this.modalType = 'requestReceived'
        return
      }
      if (this.friend === 'REQUEST_SENT') {
        this.apiCancelFriendRequest(this.info.id).then(() => {
          this.apiInfo(this.$route.params.id)
        })
        return
      }
      this.apiAddFriends(this.info.id).then(() => {
        this.apiInfo(this.$route.params.id)
      })
    },
    closeModal() {
      this.modalShow = false
    },
    onConfirm() {
      if (this.modalType === 'block') {
        this.apiBlockUser(this.$route.params.id).then(() => {
          this.apiInfo(this.$route.params.id)
          this.closeModal()
        })
        return
      }
      if (this.modalType === 'deleteFriend') {
        this.apiDeleteFriends(this.$route.params.id).then(() => {
          this.apiInfo(this.$route.params.id)
          this.closeModal()
        })
        return
      }
      if (this.modalType === 'requestReceived') {
        this.apiAcceptFriendRequest(this.info.id).then(() => {
          this.apiInfo(this.$route.params.id)
          this.closeModal()
        })
        return
      }
    },
    onDeclineFriendRequest() {
      this.apiDeclineFriendRequest(this.$route.params.id).then(() => {
        this.apiInfo(this.$route.params.id)
        this.closeModal()
      })
    },
    onSentMessage() {
      if (this.blocked) return false
      this.$router.push({ name: 'Im', query: { userId: this.info.id } })
    },
    ageToStr(age) {
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
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.profile-info {
  display: flex;
  padding: 25px 30px 25px 50px;
  background: #FFFFFF;
  box-shadow: standart-boxshadow;
  position: relative;

  @media (max-width: breakpoint-xxl) {
    padding: 25px;
  }
}

.profile-info__pic {
  border-right: 1px solid #E6E6E6;
  padding-right: 55px;
  margin-right: 60px;

  @media (max-width: breakpoint-xxl) {
    margin-right: 20px;
    padding-right: 20px;
  }
}

.profile-info__img {
  width: 215px;
  height: 215px;
  border-radius: 50%;
  overflow: hidden;
  border: 5px solid #21A45D;

  @media (max-width: breakpoint-xxl) {
    width: 150px;
    height: 150px;
    margin: 0 auto;
  }

  img {
    width: 100%;
    object-fit: cover;
    max-width: 100%;
    height: 100%;
  }

  &.offline {
    border-color: #747474;
  }
}

.profile-info__actions {
  margin-top: 25px;
  max-width: 215px;

  @media (max-width: breakpoint-xxl) {
    max-width: 180px;
  }

  .btn {
    width: 100%;
  }
}

.profile-info__add {
  margin-top: 10px;
}

.profile-info__main {
  padding: 20px 0;
}

.profile-info__blocked {
  position: absolute;
  top: 30px;
  right: 45px;
  color: eucalypt;
  font-size: 15px;
  letter-spacing: 0.01em;
  cursor: pointer;

  &.blocked {
    color: #47474C;
    cursor: default;
  }
}

.profile-info__header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.profile-info__name {
  font-family: font-exo;
  font-weight: 200;
  font-size: 30px;
  line-height: 24px;
  color: #000000;
  margin-right: 15px;
}

.profile-info__block {
  display: flex;
  font-size: 15px;

  &+& {
    margin-top: 5px;
  }

  &:last-child {
    margin-top: 30px;
  }
}

.profile-info__title {
  width: 100%;
  max-width: 200px;
  flex: none;
  line-height: 25px;
  color: #47474C;

  @media (max-width: breakpoint-xxl) {
    max-width: 150px;
  }
}

.profile-info__val {
  color: #747487;
  line-height: 25px;
  width: 450px;
}
</style>
